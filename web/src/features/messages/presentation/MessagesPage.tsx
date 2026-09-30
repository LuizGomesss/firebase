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

import { type MessageFilter, useMessagesPage } from '../infrastructure/useMessagesPage';

const formatDate = (date: Date | null) => {
  if (!date) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

export const MessagesPage = () => {
  const page = useMessagesPage();

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

          <Tabs value={page.filter} onChange={(_, value: MessageFilter) => page.setFilter(value)}>
            <Tab value="all" label="Todas" />
            <Tab value="sent" label="Enviadas" />
            <Tab value="scheduled" label="Agendadas" />
          </Tabs>

          {page.error ? <Alert severity="error">{page.error}</Alert> : null}
          {page.formError ? <Alert severity="error">{page.formError}</Alert> : null}
        </Stack>
      </Paper>

      <Paper elevation={0} className="border border-slate-200">
        {page.loading ? (
          <div className="grid min-h-48 place-items-center p-6">
            <CircularProgress />
          </div>
        ) : page.messages.length === 0 ? (
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
                {page.messages.map((message) => (
                  <TableRow key={message.id} hover>
                    <TableCell>
                      <Typography className="max-w-xs" noWrap>
                        {message.text}
                      </Typography>
                    </TableCell>
                    <TableCell>{page.getConnectionName(message.connectionId)}</TableCell>
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
                        <IconButton aria-label="Editar mensagem" onClick={() => page.openEditDialog(message)}>
                          <Edit2 size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          aria-label="Excluir mensagem"
                          color="error"
                          onClick={() => page.setDeletingMessage(message)}
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

      <Dialog open={Boolean(page.editingMessage)} onClose={page.closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Editar mensagem</DialogTitle>
        <DialogContent>
          <Stack spacing={2} className="pt-2">
            <TextField
              label="Mensagem"
              value={page.editingText}
              onChange={(event) => page.setEditingText(event.target.value)}
              multiline
              minRows={4}
              required
              autoFocus
              fullWidth
            />
            <TextField
              label="Data e horario para manter agendada"
              type="datetime-local"
              value={page.editingScheduledAt}
              onChange={(event) => page.setEditingScheduledAt(event.target.value)}
              InputLabelProps={{ shrink: true }}
              helperText="Deixe vazio para marcar como enviada imediatamente."
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={page.closeEditDialog} startIcon={<X size={18} />}>
            Cancelar
          </Button>
          <Button onClick={page.handleUpdate} variant="contained" disabled={page.submitting} startIcon={<Save size={18} />}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(page.deletingMessage)} onClose={() => page.setDeletingMessage(null)} fullWidth maxWidth="xs">
        <DialogTitle>Excluir mensagem</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir esta mensagem?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => page.setDeletingMessage(null)} startIcon={<X size={18} />}>
            Cancelar
          </Button>
          <Button onClick={page.handleDelete} color="error" variant="contained" disabled={page.submitting} startIcon={<Trash2 size={18} />}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
