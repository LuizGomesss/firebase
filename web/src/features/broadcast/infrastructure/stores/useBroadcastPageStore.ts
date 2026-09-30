import { create } from 'zustand';

import type { SendMode } from '../../domain/sendMode';

type BroadcastPageState = {
  selectedConnectionId: string;
  selectedContactIds: string[];
  text: string;
  sendMode: SendMode;
  scheduledAt: string;
  formError: string;
  successMessage: string;
  submitting: boolean;
  setSelectedConnectionId: (connectionId: string) => void;
  setSelectedContactIds: (contactIds: string[]) => void;
  setText: (text: string) => void;
  setSendMode: (sendMode: SendMode) => void;
  setScheduledAt: (scheduledAt: string) => void;
  setFormError: (formError: string) => void;
  setSuccessMessage: (successMessage: string) => void;
  setSubmitting: (submitting: boolean) => void;
  resetForm: () => void;
};

export const useBroadcastPageStore = create<BroadcastPageState>((set) => ({
  selectedConnectionId: '',
  selectedContactIds: [],
  text: '',
  sendMode: 'now',
  scheduledAt: '',
  formError: '',
  successMessage: '',
  submitting: false,
  setSelectedConnectionId: (selectedConnectionId) => set({ selectedConnectionId, selectedContactIds: [] }),
  setSelectedContactIds: (selectedContactIds) => set({ selectedContactIds }),
  setText: (text) => set({ text }),
  setSendMode: (sendMode) => set({ sendMode }),
  setScheduledAt: (scheduledAt) => set({ scheduledAt }),
  setFormError: (formError) => set({ formError }),
  setSuccessMessage: (successMessage) => set({ successMessage }),
  setSubmitting: (submitting) => set({ submitting }),
  resetForm: () =>
    set({
      selectedContactIds: [],
      text: '',
      sendMode: 'now',
      scheduledAt: '',
    }),
}));
