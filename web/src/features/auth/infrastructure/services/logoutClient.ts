import { signOut } from 'firebase/auth';

import { auth } from '../../../shared/infrastructure/firebase';

export const logoutClient = () => signOut(auth);
