import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CalendarClock, Send } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';

import { useAuth } from '../../auth/infrastructure/useAuth';
import { createBroadcastMessage } from '../infrastructure/messagesService';
import { useConnections } from '../infrastructure/useConnections';
import { useContacts } from '../infrastructure/useContacts';

type SendMode = 'now' | 'scheduled';

export const BroadcastPage = () => {
  const { user } = useAuth();
  const { connections, loading: loadingConnections, error: connectionsError } = useConnections(user?.uid);
  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const { contacts, loading: loadingContacts, error: contactsError } = useContacts(user?.uid, selectedConnectionId);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [sendMode, setSendMode] = useState<SendMode>('now');
  const [scheduledAt, setScheduledAt] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedConnectionId && connections.length > 0) {
      setSelectedConnectionId(connections[0].id);
    }

    if (selectedConnectionId && connections.every((connection) => connection.id !== selectedConnectionId)) {
      setSelectedConnectionId(connections[0]?.id ?? '');
    }
  }, [connections, selectedConnectionId]);

  useEffect(() => {
    setSelectedContactIds((currentIds) =>
      currentIds.filter((contactId) => contacts.some((contact) => contact.id === contactId)),
    );
  }, [contacts]);

  const toggleContact = (contactId: string) => {
    setSelectedContactIds((currentIds) =>
      currentIds.includes(contactId)
        ? currentIds.filter((currentContactId) => currentContactId !== contactId)
        : [...currentIds, contactId],
    );
  };

  const selectAllContacts = () => {
    setSelectedContactIds(contacts.map((contact) => contact.id));
  };

  const clearSelectedContacts = () => {
    setSelectedContactIds([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !selectedConnectionId) {
      return;
    }

    const messageText = text.trim();
    const scheduledDate = sendMode === 'scheduled' ? new Date(scheduledAt) : null;

    if (selectedContactIds.length === 0) {
      setFormError('Selecione pelo menos um contato.');
      return;
    }

    if (!messageText) {
      setFormError('Escreva a mensagem do broadcast.');
      return;
    }

    if (sendMode === 'scheduled' && (!scheduledAt || !scheduledDate || scheduledDate <= new Date())) {
      setFormError('Informe uma data futura para agendar a mensagem.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    setSuccessMessage('');

    try {
      await createBroadcastMessage({
        clientId: user.uid,
        connectionId: selectedConnectionId,
        contactIds: selectedContactIds,
        text: messageText,
        scheduledAt: scheduledDate,
      });

      setText('');
      setScheduledAt('');
      setSelectedContactIds([]);
      setSendMode('now');
      setSuccessMessage(sendMode === 'scheduled' ? 'Mensagem agendada com sucesso.' : 'Mensagem enviada com sucesso.');
    } catch {
      setFormError('Nao foi possivel criar a mensagem.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasConnections = connections.length > 0;
  const hasContacts = contacts.length > 0;

  return (
    <Paper elevation={0} className="border border-slate-200 p-6">
      <Stack component="form" spacing={3} onSubmit={handleSubmit}>
        <div>
          <Typography variant="h5" component="h2" fontWeight={700}>
            Broadcast
          </Typography>
          <Typography color="text.secondary">
            Envie agora ou agende uma mensagem para contatos de uma conexao.
          </Typography>
        </div>

        {loadingConnections ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            <CircularProgress size={22} />
            <Typography color="text.secondary">Carregando conexoes...</Typography>
          </Stack>
        ) : hasConnections ? (
          <FormControl fullWidth>
            <InputLabel id="broadcast-connection-label">Conexao</InputLabel>
            <Select
              labelId="broadcast-connection-label"
              label="Conexao"
              value={selectedConnectionId}
              onChange={(event) => setSelectedConnectionId(event.target.value)}
            >
              {connections.map((connection) => (
                <MenuItem key={connection.id} value={connection.id}>
                  {connection.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Alert severity="info">Crie uma conexao antes de enviar broadcasts.</Alert>
        )}

        {selectedConnectionId && (
          <Paper elevation={0} className="border border-slate-200 p-4">
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                <div>
                  <Typography fontWeight={700}>Contatos</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedContactIds.length} selecionado(s)
                  </Typography>
                </div>
                <Stack direction="row" spacing={1}>
                  <Button type="button" size="small" onClick={selectAllContacts} disabled={!hasContacts}>
                    Selecionar todos
                  </Button>
                  <Button type="button" size="small" onClick={clearSelectedContacts} disabled={selectedContactIds.length === 0}>
                    Limpar
                  </Button>
                </Stack>
              </Stack>

              {loadingContacts ? (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CircularProgress size={22} />
                  <Typography color="text.secondary">Carregando contatos...</Typography>
                </Stack>
              ) : hasContacts ? (
                <FormGroup className="grid gap-1 md:grid-cols-2">
                  {contacts.map((contact) => (
                    <FormControlLabel
                      key={contact.id}
                      control={
                        <Checkbox
                          checked={selectedContactIds.includes(contact.id)}
                          onChange={() => toggleContact(contact.id)}
                        />
                      }
                      label={`${contact.name} - ${contact.phone}`}
                    />
                  ))}
                </FormGroup>
              ) : (
                <Alert severity="info">Cadastre contatos nessa conexao antes de enviar mensagens.</Alert>
              )}
            </Stack>
          </Paper>
        )}

        <TextField
          label="Mensagem"
          value={text}
          onChange={(event) => setText(event.target.value)}
          required
          multiline
          minRows={4}
          fullWidth
        />

        <RadioGroup row value={sendMode} onChange={(event) => setSendMode(event.target.value as SendMode)}>
          <FormControlLabel value="now" control={<Radio />} label="Enviar agora" />
          <FormControlLabel value="scheduled" control={<Radio />} label="Agendar" />
        </RadioGroup>

        {sendMode === 'scheduled' ? (
          <TextField
            label="Data e horario"
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />
        ) : null}

        {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
        {formError ? <Alert severity="error">{formError}</Alert> : null}
        {connectionsError ? <Alert severity="error">{connectionsError}</Alert> : null}
        {contactsError ? <Alert severity="error">{contactsError}</Alert> : null}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting || !hasConnections || !hasContacts}
          startIcon={sendMode === 'scheduled' ? <CalendarClock size={18} /> : <Send size={18} />}
        >
          {submitting ? 'Aguarde...' : sendMode === 'scheduled' ? 'Agendar mensagem' : 'Enviar mensagem'}
        </Button>
      </Stack>
    </Paper>
  );
};
