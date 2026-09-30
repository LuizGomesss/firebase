import { useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../../../auth/infrastructure/hooks/useAuth';
import { useConnections } from '../../../connections/infrastructure/hooks/useConnections';
import type { BroadcastMessage } from '../../domain/broadcastMessage';
import { deleteBroadcastMessage } from '../services/deleteBroadcastMessage';
import { updateBroadcastMessage } from '../services/updateBroadcastMessage';
import { useMessagesPageStore } from '../stores/useMessagesPageStore';
import { useMessages } from './useMessages';

const toDateTimeLocalValue = (date: Date | null) => {
  if (!date) {
    return '';
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

export const useMessagesPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    filter,
    editingMessage,
    editingText,
    editingScheduledAt,
    deletingMessage,
    formError,
    submitting,
    setFilter,
    setEditingText,
    setEditingScheduledAt,
    setDeletingMessage,
    setFormError,
    setSubmitting,
    openEditDialog: openEditDialogStore,
    closeEditDialog,
  } = useMessagesPageStore();
  const { messages, loading, error } = useMessages(user?.uid, filter);
  const { connections } = useConnections(user?.uid);

  const getConnectionName = (connectionId: string) =>
    connections.find((connection) => connection.id === connectionId)?.name ?? 'Conexao removida';

  const openEditDialog = (message: BroadcastMessage) => {
    openEditDialogStore(message, toDateTimeLocalValue(message.status === 'scheduled' ? message.scheduledAt : null));
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
      await queryClient.invalidateQueries({ queryKey: ['messages', user?.uid] });
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
      await queryClient.invalidateQueries({ queryKey: ['messages', user?.uid] });
      setDeletingMessage(null);
    } catch {
      setFormError('Nao foi possivel excluir a mensagem.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    filter,
    setFilter,
    messages,
    loading,
    error,
    editingMessage,
    editingText,
    setEditingText,
    editingScheduledAt,
    setEditingScheduledAt,
    deletingMessage,
    setDeletingMessage,
    formError,
    submitting,
    getConnectionName,
    openEditDialog,
    closeEditDialog,
    handleUpdate,
    handleDelete,
  };
};
