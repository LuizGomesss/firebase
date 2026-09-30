import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { auth } from '../../../shared/infrastructure/firebase';

type AuthState = {
  user: User | null;
  loading: boolean;
};

export const useAuth = (): AuthState => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({ user, loading: false });
    });

    return unsubscribe;
  }, []);

  return state;
};
