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
import { type FormEvent, useEffect, useState } from 'react';

import { useAuth } from '../../auth/infrastructure/useAuth';
import type { Contact } from '../../shared/domain';
import { createContact, deleteContact, updateContact } from '../infrastructure/contactsService';
import { useConnections } from '../infrastructure/useConnections';
import { useContacts } from '../infrastructure/useContacts';

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);

export const ContactsPage = () => {
  const { user } = useAuth();
  const { connections, loading: loadingConnections, error: connectionsError } = useConnections(user?.uid);
  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const { contacts, loading: loadingContacts, error: contactsError } = useContacts(user?.uid, selectedConnectionId);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingPhone, setEditingPhone] = useState('');
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedConnectionId && connections.length > 0) {
      setSelectedConnectionId(connections[0].id);
    }

    if (selectedConnectionId && connections.every((connection) => connection.id !== selectedConnectionId)) {
      setSelectedConnectionId(connections[0]?.id ?? '');
    }
  }, [connections, selectedConnectionId]);

  const selectedConnection = connections.find((connection) => connection.id === selectedConnectionId);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !selectedConnectionId) {
      return;
    }

    const name = newContactName.trim();
    const phone = newContactPhone.trim();

    if (!name || !phone) {
      setFormError('Informe nome e telefone do contato.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await createContact({
        clientId: user.uid,
        connectionId: selectedConnectionId,
        name,
        phone,
      });
      setNewContactName('');
      setNewContactPhone('');
    } catch {
      setFormError('Nao foi possivel criar o contato.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setEditingName(contact.name);
    setEditingPhone(contact.phone);
    setFormError('');
  };

  const closeEditDialog = () => {
    setEditingContact(null);
    setEditingName('');
    setEditingPhone('');
    setFormError('');
  };

  const handleUpdate = async () => {
    const name = editingName.trim();
    const phone = editingPhone.trim();

    if (!editingContact || !name || !phone) {
      setFormError('Informe nome e telefone do contato.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await updateContact(editingContact.id, { name, phone });
      closeEditDialog();
    } catch {
      setFormError('Nao foi possivel editar o contato.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingContact) {
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      await deleteContact(deletingContact.id);
      setDeletingContact(null);
    } catch {
      setFormError('Nao foi possivel excluir o contato.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasConnections = connections.length > 0;

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

          {loadingConnections ? (
            <Stack direction="row" alignItems="center" spacing={2}>
              <CircularProgress size={22} />
              <Typography color="text.secondary">Carregando conexoes...</Typography>
            </Stack>
          ) : hasConnections ? (
            <>
              <FormControl fullWidth>
                <InputLabel id="connection-select-label">Conexao</InputLabel>
                <Select
                  labelId="connection-select-label"
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

              <Stack component="form" direction={{ xs: 'column', md: 'row' }} spacing={2} onSubmit={handleCreate}>
                <TextField
                  label="Nome"
                  value={newContactName}
                  onChange={(event) => setNewContactName(event.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Telefone"
                  value={newContactPhone}
                  onChange={(event) => setNewContactPhone(event.target.value)}
                  required
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
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

          {formError ? <Alert severity="error">{formError}</Alert> : null}
          {connectionsError ? <Alert severity="error">{connectionsError}</Alert> : null}
          {contactsError ? <Alert severity="error">{contactsError}</Alert> : null}
        </Stack>
      </Paper>

      <Paper elevation={0} className="border border-slate-200">
        {!hasConnections ? (
          <Stack spacing={1} className="p-6">
            <Typography fontWeight={700}>Nenhuma conexao selecionada</Typography>
            <Typography color="text.secondary">
              Os contatos sempre pertencem a uma conexao. Comece criando uma conexao.
            </Typography>
          </Stack>
        ) : loadingContacts ? (
          <div className="grid min-h-48 place-items-center p-6">
            <CircularProgress />
          </div>
        ) : contacts.length === 0 ? (
          <Stack spacing={1} className="p-6">
            <Typography fontWeight={700}>Nenhum contato cadastrado</Typography>
            <Typography color="text.secondary">
              {selectedConnection
                ? `Cadastre o primeiro contato em ${selectedConnection.name}.`
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
                {contacts.map((contact) => (
                  <TableRow key={contact.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{contact.name}</Typography>
                    </TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{formatDate(contact.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton aria-label="Editar contato" onClick={() => openEditDialog(contact)}>
                          <Edit2 size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton
                          aria-label="Excluir contato"
                          color="error"
                          onClick={() => setDeletingContact(contact)}
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

      <Dialog open={Boolean(editingContact)} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Editar contato</DialogTitle>
        <DialogContent>
          <Stack spacing={2} className="pt-2">
            <TextField
              label="Nome"
              value={editingName}
              onChange={(event) => setEditingName(event.target.value)}
              required
              autoFocus
              fullWidth
            />
            <TextField
              label="Telefone"
              value={editingPhone}
              onChange={(event) => setEditingPhone(event.target.value)}
              required
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

      <Dialog open={Boolean(deletingContact)} onClose={() => setDeletingContact(null)} fullWidth maxWidth="xs">
        <DialogTitle>Excluir contato</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir {deletingContact?.name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingContact(null)} startIcon={<X size={18} />}>
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
