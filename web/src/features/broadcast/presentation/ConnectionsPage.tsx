import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
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
import { Edit2, Plus, Save, Trash2, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';

import { useAuth } from '../../auth/infrastructure/useAuth';
import type { Connection } from '../../shared/domain';
import { createConnection, deleteConnection, updateConnection } from '../infrastructure/connectionsService';
import { useConnections } from '../infrastructure/useConnections';

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);

export const ConnectionsPage = () => {
  const { user } = useAuth();
  const { connections, loading, error } = useConnections(user?.uid);
  const [newConnectionName, setNewConnectionName] = useState('');
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deletingConnection, setDeletingConnection] = useState<Connection | null>(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    const name = newConnectionName.trim();

    if (!name) {
      setFormError('Informe o nome da conexao.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await createConnection(user.uid, name);
      setNewConnectionName('');
    } catch {
      setFormError('Nao foi possivel criar a conexao.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (connection: Connection) => {
    setEditingConnection(connection);
    setEditingName(connection.name);
    setFormError('');
  };

  const closeEditDialog = () => {
    setEditingConnection(null);
    setEditingName('');
    setFormError('');
  };

  const handleUpdate = async () => {
    const name = editingName.trim();

    if (!editingConnection || !name) {
      setFormError('Informe o nome da conexao.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await updateConnection(editingConnection.id, name);
      closeEditDialog();
    } catch {
      setFormError('Nao foi possivel editar a conexao.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingConnection) {
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await deleteConnection(deletingConnection.id);
      setDeletingConnection(null);
    } catch {
      setFormError('Nao foi possivel excluir a conexao.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Paper elevation={0} className="border border-slate-200 p-6">
        <Stack spacing={3}>
          <div>
            <Typography variant="h5" component="h2" fontWeight={700}>
              Conexoes
            </Typography>
            <Typography color="text.secondary">
              Gerencie as conexoes do cliente autenticado em tempo real.
            </Typography>
          </div>

          <Stack component="form" direction={{ xs: 'column', sm: 'row' }} spacing={2} onSubmit={handleCreate}>
            <TextField
              label="Nome da conexao"
              value={newConnectionName}
              onChange={(event) => setNewConnectionName(event.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={<Plus size={18} />}
              className="sm:w-44"
            >
              Criar
            </Button>
          </Stack>

          {formError ? <Alert severity="error">{formError}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </Paper>

      <Paper elevation={0} className="border border-slate-200">
        {loading ? (
          <div className="grid min-h-48 place-items-center p-6">
            <CircularProgress />
          </div>
        ) : connections.length === 0 ? (
          <Stack spacing={1} className="p-6">
            <Typography fontWeight={700}>Nenhuma conexao cadastrada</Typography>
            <Typography color="text.secondary">
              Crie a primeira conexao para cadastrar contatos e preparar broadcasts.
            </Typography>
          </Stack>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Criada em</TableCell>
                  <TableCell>Atualizada em</TableCell>
                  <TableCell align="right">Acoes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {connections.map((connection) => (
                  <TableRow key={connection.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{connection.name}</Typography>
                    </TableCell>
                    <TableCell>{formatDate(connection.createdAt)}</TableCell>
                    <TableCell>{formatDate(connection.updatedAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton aria-label="Editar conexao" onClick={() => openEditDialog(connection)}>
                          <Edit2 size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          aria-label="Excluir conexao"
                          color="error"
                          onClick={() => setDeletingConnection(connection)}
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

      <Dialog open={Boolean(editingConnection)} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Editar conexao</DialogTitle>
        <DialogContent>
          <Stack spacing={2} className="pt-2">
            <TextField
              label="Nome da conexao"
              value={editingName}
              onChange={(event) => setEditingName(event.target.value)}
              required
              autoFocus
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

      <Dialog open={Boolean(deletingConnection)} onClose={() => setDeletingConnection(null)} fullWidth maxWidth="xs">
        <DialogTitle>Excluir conexao</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir {deletingConnection?.name}? Essa acao nao remove contatos ainda.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingConnection(null)} startIcon={<X size={18} />}>
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
