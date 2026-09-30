import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type FirestoreError,
  type Timestamp,
} from 'firebase/firestore';

import type { Connection } from '../../shared/domain';
import { db } from '../../shared/infrastructure/firebase';

const connectionsCollection = collection(db, 'connections');

const timestampToDate = (value: unknown) => {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as Timestamp).toDate();
  }

  return new Date();
};

export const subscribeToConnections = (
  clientId: string,
  onNext: (connections: Connection[]) => void,
  onError: (error: FirestoreError) => void,
) => {
  const connectionsQuery = query(connectionsCollection, where('clientId', '==', clientId));

  return onSnapshot(
    connectionsQuery,
    (snapshot) => {
      const connections = snapshot.docs
        .map((connectionDoc) => {
          const data = connectionDoc.data();

          return {
            id: connectionDoc.id,
            clientId: String(data.clientId),
            name: String(data.name),
            createdAt: timestampToDate(data.createdAt),
            updatedAt: timestampToDate(data.updatedAt),
          };
        })
        .sort((firstConnection, secondConnection) => secondConnection.createdAt.getTime() - firstConnection.createdAt.getTime());

      onNext(connections);
    },
    onError,
  );
};

export const createConnection = (clientId: string, name: string) =>
  addDoc(connectionsCollection, {
    clientId,
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

export const updateConnection = (connectionId: string, name: string) =>
  updateDoc(doc(db, 'connections', connectionId), {
    name,
    updatedAt: serverTimestamp(),
  });

export const deleteConnection = (connectionId: string) => deleteDoc(doc(db, 'connections', connectionId));
