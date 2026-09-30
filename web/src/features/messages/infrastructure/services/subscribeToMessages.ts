import { onSnapshot, query, where, type FirestoreError } from 'firebase/firestore';

import type { BroadcastMessage } from '../../domain/broadcastMessage';
import type { MessageStatus } from '../../domain/messageStatus';
import { messagesCollection } from '../firebase/messagesCollection';
import { mapMessageDocument } from '../mappers/mapMessageDocument';

export const subscribeToMessages = (
  clientId: string,
  status: MessageStatus | 'all',
  onNext: (messages: BroadcastMessage[]) => void,
  onError: (error: FirestoreError) => void,
) => {
  const constraints =
    status === 'all'
      ? [where('clientId', '==', clientId)]
      : [where('clientId', '==', clientId), where('status', '==', status)];

  return onSnapshot(
    query(messagesCollection, ...constraints),
    (snapshot) => {
      const messages = snapshot.docs
        .map(mapMessageDocument)
        .sort((firstMessage, secondMessage) => secondMessage.createdAt.getTime() - firstMessage.createdAt.getTime());

      onNext(messages);
    },
    onError,
  );
};
