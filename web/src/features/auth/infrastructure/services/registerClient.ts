import { deleteApp, getApp, getApps, initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';

import { firebaseConfig } from '../../../shared/infrastructure/firebase';

export const registerClient = async (email: string, password: string) => {
  const secondaryAppName = 'registration';
  const existingApp = getApps().find((app) => app.name === secondaryAppName);
  const secondaryApp = existingApp ?? initializeApp(firebaseConfig, secondaryAppName);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    return credential.user;
  } finally {
    await signOut(secondaryAuth);
    await deleteApp(getApp(secondaryAppName));
  }
};
