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

import { type SendMode, useBroadcastPage } from '../infrastructure/useBroadcastPage';

export const BroadcastPage = () => {
  const page = useBroadcastPage();

  return (
    <Paper elevation={0} className="border border-slate-200 p-6">
      <Stack component="form" spacing={3} onSubmit={page.handleSubmit}>
        <div>
          <Typography variant="h5" component="h2" fontWeight={700}>
            Broadcast
          </Typography>
          <Typography color="text.secondary">
            Envie agora ou agende uma mensagem para contatos de uma conexao.
          </Typography>
        </div>

        {page.loadingConnections ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            <CircularProgress size={22} />
            <Typography color="text.secondary">Carregando conexoes...</Typography>
          </Stack>
        ) : page.hasConnections ? (
          <FormControl fullWidth>
            <InputLabel id="broadcast-connection-label">Conexao</InputLabel>
            <Select
              labelId="broadcast-connection-label"
              label="Conexao"
              value={page.selectedConnectionId}
              onChange={(event) => page.setSelectedConnectionId(event.target.value)}
            >
              {page.connections.map((connection) => (
                <MenuItem key={connection.id} value={connection.id}>
                  {connection.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Alert severity="info">Crie uma conexao antes de enviar broadcasts.</Alert>
        )}

        {page.selectedConnectionId && (
          <Paper elevation={0} className="border border-slate-200 p-4">
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                <div>
                  <Typography fontWeight={700}>Contatos</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {page.selectedContactIds.length} selecionado(s)
                  </Typography>
                </div>
                <Stack direction="row" spacing={1}>
                  <Button type="button" size="small" onClick={page.selectAllContacts} disabled={!page.hasContacts}>
                    Selecionar todos
                  </Button>
                  <Button type="button" size="small" onClick={page.clearSelectedContacts} disabled={page.selectedContactIds.length === 0}>
                    Limpar
                  </Button>
                </Stack>
              </Stack>

              {page.loadingContacts ? (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <CircularProgress size={22} />
                  <Typography color="text.secondary">Carregando contatos...</Typography>
                </Stack>
              ) : page.hasContacts ? (
                <FormGroup className="grid gap-1 md:grid-cols-2">
                  {page.contacts.map((contact) => (
                    <FormControlLabel
                      key={contact.id}
                      control={
                        <Checkbox
                          checked={page.selectedContactIds.includes(contact.id)}
                          onChange={() => page.toggleContact(contact.id)}
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
          value={page.text}
          onChange={(event) => page.setText(event.target.value)}
          required
          multiline
          minRows={4}
          fullWidth
        />

        <RadioGroup row value={page.sendMode} onChange={(event) => page.setSendMode(event.target.value as SendMode)}>
          <FormControlLabel value="now" control={<Radio />} label="Enviar agora" />
          <FormControlLabel value="scheduled" control={<Radio />} label="Agendar" />
        </RadioGroup>

        {page.sendMode === 'scheduled' ? (
          <TextField
            label="Data e horario"
            type="datetime-local"
            value={page.scheduledAt}
            onChange={(event) => page.setScheduledAt(event.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />
        ) : null}

        {page.successMessage ? <Alert severity="success">{page.successMessage}</Alert> : null}
        {page.formError ? <Alert severity="error">{page.formError}</Alert> : null}
        {page.connectionsError ? <Alert severity="error">{page.connectionsError}</Alert> : null}
        {page.contactsError ? <Alert severity="error">{page.contactsError}</Alert> : null}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={page.submitting || !page.hasConnections || !page.hasContacts}
          startIcon={page.sendMode === 'scheduled' ? <CalendarClock size={18} /> : <Send size={18} />}
        >
          {page.submitting ? 'Aguarde...' : page.sendMode === 'scheduled' ? 'Agendar mensagem' : 'Enviar mensagem'}
        </Button>
      </Stack>
    </Paper>
  );
};
