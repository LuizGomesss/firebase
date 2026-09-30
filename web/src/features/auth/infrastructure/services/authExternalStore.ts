import { onAuthStateChanged, type User } from 'firebase/auth';

import { auth } from '../../../shared/infrastructure/firebase';

type AuthSnapshot = {
  user: User | null;
  loading: boolean;
};

let snapshot: AuthSnapshot = {
  user: auth.currentUser,
  loading: true,
};

const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

onAuthStateChanged(auth, (user) => {
  snapshot = {
    user,
    loading: false,
  };
  emit();
});

export const subscribeToAuthStore = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getAuthSnapshot = () => snapshot;
