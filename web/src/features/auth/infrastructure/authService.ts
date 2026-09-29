import { deleteApp, getApp, getApps, initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db, firebaseConfig } from '../../shared/infrastructure/firebase';

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

export const loginClient = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const userRef = doc(db, 'clients', credential.user.uid);

  void setDoc(
    userRef,
    {
      email: credential.user.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return credential.user;
};

export const logoutClient = () => signOut(auth);
