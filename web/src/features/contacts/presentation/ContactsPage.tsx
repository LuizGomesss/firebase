import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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

import { useContactsPage } from '../infrastructure/hooks/useContactsPage';
import { formatDate } from '../../shared';

export const ContactsPage = () => {
  const page = useContactsPage();

  return (
    <Stack spacing={3}>
      <Paper elevation={0} className="border border-slate-200 p-6">
        <Stack spacing={3}>
          <div>
            <Typography variant="h5" component="h2" fontWeight={700}>
              Contatos
            </Typography>
            <Typography color="text.secondary">
              Cadastre contatos dentro de uma conexao para usa-los nos broadcasts.
            </Typography>
          </div>

          {page.loadingConnections ? (
            <Stack direction="row" alignItems="center" spacing={2}>
              <CircularProgress size={22} />
              <Typography color="text.secondary">Carregando conexoes...</Typography>
            </Stack>
          ) : page.hasConnections ? (
            <>
              <FormControl fullWidth>
                <InputLabel id="connection-select-label">Conexao</InputLabel>
                <Select
                  labelId="connection-select-label"
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

              <Stack component="form" direction={{ xs: 'column', md: 'row' }} spacing={2} onSubmit={page.handleCreate}>
                <TextField
                  label="Nome"
                  value={page.newContactName}
                  onChange={(event) => page.setNewContactName(event.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Telefone"
                  value={page.newContactPhone}
                  onChange={(event) => page.setNewContactPhone(event.target.value)}
                  required
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={page.submitting}
                  startIcon={<Plus size={18} />}
                  className="md:w-44"
                >
                  Criar
                </Button>
              </Stack>
            </>
          ) : (
            <Alert severity="info">Crie uma conexao antes de cadastrar contatos.</Alert>
          )}

          {page.formError ? <Alert severity="error">{page.formError}</Alert> : null}
          {page.connectionsError ? <Alert severity="error">{page.connectionsError}</Alert> : null}
          {page.contactsError ? <Alert severity="error">{page.contactsError}</Alert> : null}
        </Stack>
      </Paper>

      <Paper elevation={0} className="border border-slate-200">
        {!page.hasConnections ? (
          <Stack spacing={1} className="p-6">
            <Typography fontWeight={700}>Nenhuma conexao selecionada</Typography>
            <Typography color="text.secondary">
              Os contatos sempre pertencem a uma conexao. Comece criando uma conexao.
            </Typography>
          </Stack>
        ) : page.loadingContacts ? (
          <div className="grid min-h-48 place-items-center p-6">
            <CircularProgress />
          </div>
        ) : page.contacts.length === 0 ? (
          <Stack spacing={1} className="p-6">
            <Typography fontWeight={700}>Nenhum contato cadastrado</Typography>
            <Typography color="text.secondary">
              {page.selectedConnection
                ? `Cadastre o primeiro contato em ${page.selectedConnection.name}.`
                : 'Cadastre o primeiro contato nesta conexao.'}
            </Typography>
          </Stack>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Criado em</TableCell>
                  <TableCell align="right">Acoes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {page.contacts.map((contact) => (
                  <TableRow key={contact.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{contact.name}</Typography>
                    </TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{formatDate(contact.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton aria-label="Editar contato" onClick={() => page.openEditDialog(contact)}>
                          <Edit2 size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          aria-label="Excluir contato"
                          color="error"
                          onClick={() => page.setDeletingContact(contact)}
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

      <Dialog open={Boolean(page.editingContact)} onClose={page.closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Editar contato</DialogTitle>
        <DialogContent>
          <Stack spacing={2} className="pt-2">
            <TextField
              label="Nome"
              value={page.editingName}
              onChange={(event) => page.setEditingName(event.target.value)}
              required
              autoFocus
              fullWidth
            />
            <TextField
              label="Telefone"
              value={page.editingPhone}
              onChange={(event) => page.setEditingPhone(event.target.value)}
              required
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

      <Dialog open={Boolean(page.deletingContact)} onClose={() => page.setDeletingContact(null)} fullWidth maxWidth="xs">
        <DialogTitle>Excluir contato</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir {page.deletingContact?.name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => page.setDeletingContact(null)} startIcon={<X size={18} />}>
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
