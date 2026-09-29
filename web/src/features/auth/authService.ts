import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '../../lib/firebase';

export const registerClient = async (email: string, password: string) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const userRef = doc(db, 'clients', credential.user.uid);

  await setDoc(userRef, {
    email: credential.user.email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return credential.user;
};

export const loginClient = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const logoutClient = () => signOut(auth);
