import type { QueryDocumentSnapshot } from 'firebase/firestore';

import type { Connection } from '../../../shared/domain';
import { timestampToDate } from '../converters/timestampToDate';

export const mapConnectionDocument = (connectionDoc: QueryDocumentSnapshot): Connection => {
  const data = connectionDoc.data();

  return {
    id: connectionDoc.id,
    clientId: String(data.clientId),
    name: String(data.name),
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
};
