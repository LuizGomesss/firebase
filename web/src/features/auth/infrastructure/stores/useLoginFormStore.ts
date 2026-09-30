import { create } from 'zustand';

import { accountCreatedMessageKey } from '../../domain/authFeedback';

const consumePendingSuccessMessage = () => {
  const pendingMessage = window.sessionStorage.getItem(accountCreatedMessageKey) ?? '';

  if (pendingMessage) {
    window.sessionStorage.removeItem(accountCreatedMessageKey);
  }

  return pendingMessage;
};

type LoginFormState = {
  email: string;
  password: string;
  error: string;
  successMessage: string;
  submitting: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  setSuccessMessage: (successMessage: string) => void;
  setSubmitting: (submitting: boolean) => void;
};

export const useLoginFormStore = create<LoginFormState>((set) => ({
  email: '',
  password: '',
  error: '',
  successMessage: consumePendingSuccessMessage(),
  submitting: false,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setSuccessMessage: (successMessage) => set({ successMessage }),
  setSubmitting: (submitting) => set({ submitting }),
}));
