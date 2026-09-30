import { create } from 'zustand';

import type { Contact } from '../../../shared/domain';

type ContactsPageState = {
  selectedConnectionId: string;
  newContactName: string;
  newContactPhone: string;
  editingContact: Contact | null;
  editingName: string;
  editingPhone: string;
  deletingContact: Contact | null;
  formError: string;
  submitting: boolean;
  setSelectedConnectionId: (selectedConnectionId: string) => void;
  setNewContactName: (newContactName: string) => void;
  setNewContactPhone: (newContactPhone: string) => void;
  setEditingName: (editingName: string) => void;
  setEditingPhone: (editingPhone: string) => void;
  setDeletingContact: (deletingContact: Contact | null) => void;
  setFormError: (formError: string) => void;
  setSubmitting: (submitting: boolean) => void;
  openEditDialog: (contact: Contact) => void;
  closeEditDialog: () => void;
  clearCreateForm: () => void;
};

export const useContactsPageStore = create<ContactsPageState>((set) => ({
  selectedConnectionId: '',
  newContactName: '',
  newContactPhone: '',
  editingContact: null,
  editingName: '',
  editingPhone: '',
  deletingContact: null,
  formError: '',
  submitting: false,
  setSelectedConnectionId: (selectedConnectionId) => set({ selectedConnectionId }),
  setNewContactName: (newContactName) => set({ newContactName }),
  setNewContactPhone: (newContactPhone) => set({ newContactPhone }),
  setEditingName: (editingName) => set({ editingName }),
  setEditingPhone: (editingPhone) => set({ editingPhone }),
  setDeletingContact: (deletingContact) => set({ deletingContact }),
  setFormError: (formError) => set({ formError }),
  setSubmitting: (submitting) => set({ submitting }),
  openEditDialog: (contact) =>
    set({
      editingContact: contact,
      editingName: contact.name,
      editingPhone: contact.phone,
      formError: '',
    }),
  closeEditDialog: () => set({ editingContact: null, editingName: '', editingPhone: '', formError: '' }),
  clearCreateForm: () => set({ newContactName: '', newContactPhone: '' }),
}));
