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

import { useConnectionsPage } from '../infrastructure/useConnectionsPage';

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);

export const ConnectionsPage = () => {
  const page = useConnectionsPage();

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

          <Stack component="form" direction={{ xs: 'column', sm: 'row' }} spacing={2} onSubmit={page.handleCreate}>
            <TextField
              label="Nome da conexao"
              value={page.newConnectionName}
              onChange={(event) => page.setNewConnectionName(event.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              disabled={page.submitting}
              startIcon={<Plus size={18} />}
              className="sm:w-44"
            >
              Criar
            </Button>
          </Stack>

          {page.formError ? <Alert severity="error">{page.formError}</Alert> : null}
          {page.error ? <Alert severity="error">{page.error}</Alert> : null}
        </Stack>
      </Paper>

      <Paper elevation={0} className="border border-slate-200">
        {page.loading ? (
          <div className="grid min-h-48 place-items-center p-6">
            <CircularProgress />
          </div>
        ) : page.connections.length === 0 ? (
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
                {page.connections.map((connection) => (
                  <TableRow key={connection.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{connection.name}</Typography>
                    </TableCell>
                    <TableCell>{formatDate(connection.createdAt)}</TableCell>
                    <TableCell>{formatDate(connection.updatedAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton aria-label="Editar conexao" onClick={() => page.openEditDialog(connection)}>
                          <Edit2 size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          aria-label="Excluir conexao"
                          color="error"
                          onClick={() => page.setDeletingConnection(connection)}
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

      <Dialog open={Boolean(page.editingConnection)} onClose={page.closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Editar conexao</DialogTitle>
        <DialogContent>
          <Stack spacing={2} className="pt-2">
            <TextField
              label="Nome da conexao"
              value={page.editingName}
              onChange={(event) => page.setEditingName(event.target.value)}
              required
              autoFocus
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

      <Dialog open={Boolean(page.deletingConnection)} onClose={() => page.setDeletingConnection(null)} fullWidth maxWidth="xs">
        <DialogTitle>Excluir conexao</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir {page.deletingConnection?.name}? Essa acao nao remove contatos ainda.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => page.setDeletingConnection(null)} startIcon={<X size={18} />}>
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
