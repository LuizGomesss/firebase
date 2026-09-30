import { create } from 'zustand';

import type { Connection } from '../../../shared/domain';

type ConnectionsPageState = {
  newConnectionName: string;
  editingConnection: Connection | null;
  editingName: string;
  deletingConnection: Connection | null;
  formError: string;
  submitting: boolean;
  setNewConnectionName: (newConnectionName: string) => void;
  setEditingName: (editingName: string) => void;
  setDeletingConnection: (deletingConnection: Connection | null) => void;
  setFormError: (formError: string) => void;
  setSubmitting: (submitting: boolean) => void;
  openEditDialog: (connection: Connection) => void;
  closeEditDialog: () => void;
  clearCreateForm: () => void;
};

export const useConnectionsPageStore = create<ConnectionsPageState>((set) => ({
  newConnectionName: '',
  editingConnection: null,
  editingName: '',
  deletingConnection: null,
  formError: '',
  submitting: false,
  setNewConnectionName: (newConnectionName) => set({ newConnectionName }),
  setEditingName: (editingName) => set({ editingName }),
  setDeletingConnection: (deletingConnection) => set({ deletingConnection }),
  setFormError: (formError) => set({ formError }),
  setSubmitting: (submitting) => set({ submitting }),
  openEditDialog: (connection) =>
    set({
      editingConnection: connection,
      editingName: connection.name,
      formError: '',
    }),
  closeEditDialog: () => set({ editingConnection: null, editingName: '', formError: '' }),
  clearCreateForm: () => set({ newConnectionName: '' }),
}));
