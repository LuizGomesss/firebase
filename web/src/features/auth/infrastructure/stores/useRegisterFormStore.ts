import { create } from 'zustand';

type RegisterFormState = {
  email: string;
  password: string;
  error: string;
  submitting: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  setSubmitting: (submitting: boolean) => void;
};

export const useRegisterFormStore = create<RegisterFormState>((set) => ({
  email: '',
  password: '',
  error: '',
  submitting: false,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setSubmitting: (submitting) => set({ submitting }),
}));
