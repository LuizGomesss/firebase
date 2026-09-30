import type { QueryDocumentSnapshot } from 'firebase/firestore';

import type { BroadcastMessage } from '../../domain/broadcastMessage';
import type { MessageStatus } from '../../domain/messageStatus';
import { nullableTimestampToDate } from '../converters/nullableTimestampToDate';
import { timestampToDate } from '../converters/timestampToDate';

export const mapMessageDocument = (messageDoc: QueryDocumentSnapshot): BroadcastMessage => {
  const data = messageDoc.data();
  const status: MessageStatus = data.status === 'scheduled' ? 'scheduled' : 'sent';

  return {
    id: messageDoc.id,
    clientId: String(data.clientId),
    connectionId: String(data.connectionId),
    contactIds: Array.isArray(data.contactIds) ? data.contactIds.map(String) : [],
    text: String(data.text),
    status,
    scheduledAt: nullableTimestampToDate(data.scheduledAt),
    sentAt: nullableTimestampToDate(data.sentAt),
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
};
