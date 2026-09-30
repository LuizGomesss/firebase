import { getDocs, query, where } from 'firebase/firestore';

import type { MessageStatus } from '../../domain/messageStatus';
import { messagesCollection } from '../firebase/messagesCollection';
import { mapMessageDocument } from '../mappers/mapMessageDocument';

export const fetchMessages = async (clientId: string, status: MessageStatus | 'all') => {
  const constraints =
    status === 'all'
      ? [where('clientId', '==', clientId)]
      : [where('clientId', '==', clientId), where('status', '==', status)];
  const snapshot = await getDocs(query(messagesCollection, ...constraints));

  return snapshot.docs
    .map(mapMessageDocument)
    .sort((firstMessage, secondMessage) => secondMessage.createdAt.getTime() - firstMessage.createdAt.getTime());
};
