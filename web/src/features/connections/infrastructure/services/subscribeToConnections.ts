import { onSnapshot, query, where, type FirestoreError } from 'firebase/firestore';

import type { Connection } from '../../../shared/domain';
import { connectionsCollection } from '../firebase/connectionsCollection';
import { mapConnectionDocument } from '../mappers/mapConnectionDocument';

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
        .map(mapConnectionDocument)
        .sort(
          (firstConnection, secondConnection) =>
            secondConnection.createdAt.getTime() - firstConnection.createdAt.getTime(),
        );

      onNext(connections);
    },
    onError,
  );
};
