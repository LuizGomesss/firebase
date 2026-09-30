import { create } from 'zustand';

import type { BroadcastMessage } from '../../domain/broadcastMessage';
import type { MessageFilter } from '../hooks/messageFilter';

type MessagesPageState = {
  filter: MessageFilter;
  editingMessage: BroadcastMessage | null;
  editingText: string;
  editingScheduledAt: string;
  deletingMessage: BroadcastMessage | null;
  formError: string;
  submitting: boolean;
  setFilter: (filter: MessageFilter) => void;
  setEditingText: (editingText: string) => void;
  setEditingScheduledAt: (editingScheduledAt: string) => void;
  setDeletingMessage: (deletingMessage: BroadcastMessage | null) => void;
  setFormError: (formError: string) => void;
  setSubmitting: (submitting: boolean) => void;
  openEditDialog: (message: BroadcastMessage, editingScheduledAt: string) => void;
  closeEditDialog: () => void;
};

export const useMessagesPageStore = create<MessagesPageState>((set) => ({
  filter: 'all',
  editingMessage: null,
  editingText: '',
  editingScheduledAt: '',
  deletingMessage: null,
  formError: '',
  submitting: false,
  setFilter: (filter) => set({ filter }),
  setEditingText: (editingText) => set({ editingText }),
  setEditingScheduledAt: (editingScheduledAt) => set({ editingScheduledAt }),
  setDeletingMessage: (deletingMessage) => set({ deletingMessage }),
  setFormError: (formError) => set({ formError }),
  setSubmitting: (submitting) => set({ submitting }),
  openEditDialog: (message, editingScheduledAt) =>
    set({
      editingMessage: message,
      editingText: message.text,
      editingScheduledAt,
      formError: '',
    }),
  closeEditDialog: () => set({ editingMessage: null, editingText: '', editingScheduledAt: '', formError: '' }),
}));
