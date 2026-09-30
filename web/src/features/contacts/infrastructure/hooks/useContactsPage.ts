import { type FormEvent, useEffect, useState } from 'react';

import { useAuth } from '../../../auth/infrastructure/hooks/useAuth';
import { useConnections } from '../../../connections/infrastructure/hooks/useConnections';
import type { Contact } from '../../../shared/domain';
import { createContact } from '../services/createContact';
import { deleteContact } from '../services/deleteContact';
import { updateContact } from '../services/updateContact';
import { useContacts } from './useContacts';

export const useContactsPage = () => {
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
