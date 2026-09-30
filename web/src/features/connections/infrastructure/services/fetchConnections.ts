import { getDocs, query, where } from 'firebase/firestore';

import { connectionsCollection } from '../firebase/connectionsCollection';
import { mapConnectionDocument } from '../mappers/mapConnectionDocument';

export const fetchConnections = async (clientId: string) => {
  const snapshot = await getDocs(query(connectionsCollection, where('clientId', '==', clientId)));

  return snapshot.docs
    .map(mapConnectionDocument)
    .sort(
      (firstConnection, secondConnection) =>
        secondConnection.createdAt.getTime() - firstConnection.createdAt.getTime(),
    );
};
