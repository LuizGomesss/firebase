import { useQueryClient } from '@tanstack/react-query';
import type { FormEvent } from 'react';

import { useAuth } from '../../../auth/infrastructure/hooks/useAuth';
import { createConnection } from '../services/createConnection';
import { deleteConnection } from '../services/deleteConnection';
import { updateConnection } from '../services/updateConnection';
import { useConnectionsPageStore } from '../stores/useConnectionsPageStore';
import { useConnections } from './useConnections';

export const useConnectionsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { connections, loading, error } = useConnections(user?.uid);
  const {
    newConnectionName,
    editingConnection,
    editingName,
    deletingConnection,
    formError,
    submitting,
    setNewConnectionName,
    setEditingName,
    setDeletingConnection,
    setFormError,
    setSubmitting,
    openEditDialog,
    closeEditDialog,
    clearCreateForm,
  } = useConnectionsPageStore();

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
      await queryClient.invalidateQueries({ queryKey: ['connections', user.uid] });
      clearCreateForm();
    } catch {
      setFormError('Nao foi possivel criar a conexao.');
    } finally {
      setSubmitting(false);
    }
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
      await queryClient.invalidateQueries({ queryKey: ['connections', user?.uid] });
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
      await queryClient.invalidateQueries({ queryKey: ['connections', user?.uid] });
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
