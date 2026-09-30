import type { QueryDocumentSnapshot } from 'firebase/firestore';

import type { Contact } from '../../../shared/domain';
import { timestampToDate } from '../converters/timestampToDate';

export const mapContactDocument = (contactDoc: QueryDocumentSnapshot): Contact => {
  const data = contactDoc.data();

  return {
    id: contactDoc.id,
    clientId: String(data.clientId),
    connectionId: String(data.connectionId),
    name: String(data.name),
    phone: String(data.phone),
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
};
