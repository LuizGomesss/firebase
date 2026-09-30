import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Edit2, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '../../auth/infrastructure/useAuth';
import type { BroadcastMessage, MessageStatus } from '../../shared/domain';
import { deleteBroadcastMessage, updateBroadcastMessage } from '../infrastructure/messagesService';
import { useConnections } from '../infrastructure/useConnections';
import { useMessages } from '../infrastructure/useMessages';

type MessageFilter = MessageStatus | 'all';

const formatDate = (date: Date | null) => {
  if (!date) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const toDateTimeLocalValue = (date: Date | null) => {
  if (!date) {
    return '';
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

export const MessagesPage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<MessageFilter>('all');
  const { messages, loading, error } = useMessages(user?.uid, filter);
  const { connections } = useConnections(user?.uid);
  const [editingMessage, setEditingMessage] = useState<BroadcastMessage | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingScheduledAt, setEditingScheduledAt] = useState('');
  const [deletingMessage, setDeletingMessage] = useState<BroadcastMessage | null>(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getConnectionName = (connectionId: string) =>
    connections.find((connection) => connection.id === connectionId)?.name ?? 'Conexao removida';

  const openEditDialog = (message: BroadcastMessage) => {
    setEditingMessage(message);
    setEditingText(message.text);
    setEditingScheduledAt(toDateTimeLocalValue(message.status === 'scheduled' ? message.scheduledAt : null));
    setFormError('');
  };

  const closeEditDialog = () => {
    setEditingMessage(null);
    setEditingText('');
    setEditingScheduledAt('');
    setFormError('');
  };

  const handleUpdate = async () => {
    const text = editingText.trim();
    const scheduledAt = editingScheduledAt ? new Date(editingScheduledAt) : null;

    if (!editingMessage || !text) {
      setFormError('Escreva a mensagem.');
      return;
    }

    if (editingScheduledAt && scheduledAt && scheduledAt <= new Date()) {
      setFormError('Informe uma data futura para manter a mensagem agendada.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await updateBroadcastMessage(editingMessage.id, { text, scheduledAt });
      closeEditDialog();
    } catch {
      setFormError('Nao foi possivel editar a mensagem.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMessage) {
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await deleteBroadcastMessage(deletingMessage.id);
      setDeletingMessage(null);
    } catch {
      setFormError('Nao foi possivel excluir a mensagem.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Paper elevation={0} className="border border-slate-200 p-6">
        <Stack spacing={2}>
          <div>
            <Typography variant="h5" component="h2" fontWeight={700}>
              Mensagens
            </Typography>
            <Typography color="text.secondary">
              Visualize, filtre, edite e exclua mensagens enviadas ou agendadas.
            </Typography>
          </div>

          <Tabs value={filter} onChange={(_, value: MessageFilter) => setFilter(value)}>
            <Tab value="all" label="Todas" />
            <Tab value="sent" label="Enviadas" />
            <Tab value="scheduled" label="Agendadas" />
          </Tabs>

          {error ? <Alert severity="error">{error}</Alert> : null}
          {formError ? <Alert severity="error">{formError}</Alert> : null}
        </Stack>
      </Paper>

      <Paper elevation={0} className="border border-slate-200">
        {loading ? (
          <div className="grid min-h-48 place-items-center p-6">
            <CircularProgress />
          </div>
        ) : messages.length === 0 ? (
          <Stack spacing={1} className="p-6">
            <Typography fontWeight={700}>Nenhuma mensagem encontrada</Typography>
            <Typography color="text.secondary">Crie uma mensagem na tela de Broadcast.</Typography>
          </Stack>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mensagem</TableCell>
                  <TableCell>Conexao</TableCell>
                  <TableCell>Contatos</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Agendada para</TableCell>
                  <TableCell>Enviada em</TableCell>
                  <TableCell align="right">Acoes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id} hover>
                    <TableCell>
                      <Typography className="max-w-xs" noWrap>
                        {message.text}
                      </Typography>
                    </TableCell>
                    <TableCell>{getConnectionName(message.connectionId)}</TableCell>
                    <TableCell>{message.contactIds.length}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={message.status === 'sent' ? 'success' : 'warning'}
                        label={message.status === 'sent' ? 'Enviada' : 'Agendada'}
                      />
                    </TableCell>
                    <TableCell>{formatDate(message.scheduledAt)}</TableCell>
                    <TableCell>{formatDate(message.sentAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton aria-label="Editar mensagem" onClick={() => openEditDialog(message)}>
                          <Edit2 size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          aria-label="Excluir mensagem"
                          color="error"
                          onClick={() => setDeletingMessage(message)}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={Boolean(editingMessage)} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Editar mensagem</DialogTitle>
        <DialogContent>
          <Stack spacing={2} className="pt-2">
            <TextField
              label="Mensagem"
              value={editingText}
              onChange={(event) => setEditingText(event.target.value)}
              multiline
              minRows={4}
              required
              autoFocus
              fullWidth
            />
            <TextField
              label="Data e horario para manter agendada"
              type="datetime-local"
              value={editingScheduledAt}
              onChange={(event) => setEditingScheduledAt(event.target.value)}
              InputLabelProps={{ shrink: true }}
              helperText="Deixe vazio para marcar como enviada imediatamente."
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} startIcon={<X size={18} />}>
            Cancelar
          </Button>
          <Button onClick={handleUpdate} variant="contained" disabled={submitting} startIcon={<Save size={18} />}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deletingMessage)} onClose={() => setDeletingMessage(null)} fullWidth maxWidth="xs">
        <DialogTitle>Excluir mensagem</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir esta mensagem?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingMessage(null)} startIcon={<X size={18} />}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={submitting} startIcon={<Trash2 size={18} />}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
