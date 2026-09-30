import { useSyncExternalStore } from 'react';

import { getAuthSnapshot, subscribeToAuthStore } from '../services/authExternalStore';

export const useAuth = () => useSyncExternalStore(subscribeToAuthStore, getAuthSnapshot);
