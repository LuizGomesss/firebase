import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '../../../shared/infrastructure/firebase';

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
