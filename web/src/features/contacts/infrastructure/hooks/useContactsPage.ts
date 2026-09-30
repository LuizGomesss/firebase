import { useQueryClient } from '@tanstack/react-query';
import type { FormEvent } from 'react';

import { useAuth } from '../../../auth/infrastructure/hooks/useAuth';
import { useConnections } from '../../../connections/infrastructure/hooks/useConnections';
import { createContact } from '../services/createContact';
import { deleteContact } from '../services/deleteContact';
import { updateContact } from '../services/updateContact';
import { useContactsPageStore } from '../stores/useContactsPageStore';
import { useContacts } from './useContacts';

export const useContactsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { connections, loading: loadingConnections, error: connectionsError } = useConnections(user?.uid);
  const {
    selectedConnectionId: storedSelectedConnectionId,
    newContactName,
    newContactPhone,
    editingContact,
    editingName,
    editingPhone,
    deletingContact,
    formError,
    submitting,
    setSelectedConnectionId,
    setNewContactName,
    setNewContactPhone,
    setEditingName,
    setEditingPhone,
    setDeletingContact,
    setFormError,
    setSubmitting,
    openEditDialog,
    closeEditDialog,
    clearCreateForm,
  } = useContactsPageStore();
  const selectedConnectionExists = connections.some((connection) => connection.id === storedSelectedConnectionId);
  const selectedConnectionId = selectedConnectionExists ? storedSelectedConnectionId : connections[0]?.id ?? '';
  const { contacts, loading: loadingContacts, error: contactsError } = useContacts(user?.uid, selectedConnectionId);

  const selectedConnection = connections.find((connection) => connection.id === selectedConnectionId);
  const hasConnections = connections.length > 0;

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
      await queryClient.invalidateQueries({ queryKey: ['contacts', user.uid, selectedConnectionId] });
      clearCreateForm();
    } catch {
      setFormError('Nao foi possivel criar o contato.');
    } finally {
      setSubmitting(false);
    }
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
      await queryClient.invalidateQueries({ queryKey: ['contacts', user?.uid, selectedConnectionId] });
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
      await queryClient.invalidateQueries({ queryKey: ['contacts', user?.uid, selectedConnectionId] });
      setDeletingContact(null);
    } catch {
      setFormError('Nao foi possivel excluir o contato.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    connections,
    contacts,
    loadingConnections,
    loadingContacts,
    connectionsError,
    contactsError,
    selectedConnectionId,
    setSelectedConnectionId,
    selectedConnection,
    hasConnections,
    newContactName,
    setNewContactName,
    newContactPhone,
    setNewContactPhone,
    editingContact,
    editingName,
    setEditingName,
    editingPhone,
    setEditingPhone,
    deletingContact,
    setDeletingContact,
    formError,
    submitting,
    handleCreate,
    openEditDialog,
    closeEditDialog,
    handleUpdate,
    handleDelete,
  };
};
