import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { db } from '../../../shared/infrastructure/firebase';

export const updateConnection = (connectionId: string, name: string) =>
  updateDoc(doc(db, 'connections', connectionId), {
    name,
    updatedAt: serverTimestamp(),
  });
