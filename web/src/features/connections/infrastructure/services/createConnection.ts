import { addDoc, serverTimestamp } from 'firebase/firestore';

import { connectionsCollection } from '../firebase/connectionsCollection';

export const createConnection = (clientId: string, name: string) =>
  addDoc(connectionsCollection, {
    clientId,
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
