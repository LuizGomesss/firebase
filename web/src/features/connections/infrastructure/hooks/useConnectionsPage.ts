import { type FormEvent, useState } from 'react';

import { useAuth } from '../../../auth/infrastructure/hooks/useAuth';
import type { Connection } from '../../../shared/domain';
import { createConnection } from '../services/createConnection';
import { deleteConnection } from '../services/deleteConnection';
import { updateConnection } from '../services/updateConnection';
import { useConnections } from './useConnections';

export const useConnectionsPage = () => {
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

  return {
    connections,
    loading,
    error,
    newConnectionName,
    setNewConnectionName,
    editingConnection,
    editingName,
    setEditingName,
    deletingConnection,
    setDeletingConnection,
    formError,
    submitting,
    handleCreate,
    openEditDialog,
    closeEditDialog,
    handleUpdate,
    handleDelete,
  };
};
