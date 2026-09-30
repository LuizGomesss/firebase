import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type FirestoreError,
} from 'firebase/firestore';

import type { BroadcastMessage, MessageStatus } from '../../shared/domain';
import { db } from '../../shared/infrastructure/firebase';

const messagesCollection = collection(db, 'messages');

const timestampToDate = (value: unknown) => {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as Timestamp).toDate();
  }

  return new Date();
};

const nullableTimestampToDate = (value: unknown) => {
  if (!value) {
    return null;
  }

  return timestampToDate(value);
};

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
        .map((messageDoc) => {
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
        })
        .sort((firstMessage, secondMessage) => secondMessage.createdAt.getTime() - firstMessage.createdAt.getTime());

      onNext(messages);
    },
    onError,
  );
};

type MessageInput = {
  clientId: string;
  connectionId: string;
  contactIds: string[];
  text: string;
  scheduledAt: Date | null;
};

export const createBroadcastMessage = ({ clientId, connectionId, contactIds, text, scheduledAt }: MessageInput) => {
  const isScheduled = Boolean(scheduledAt);

  return addDoc(messagesCollection, {
    clientId,
    connectionId,
    contactIds,
    text,
    status: isScheduled ? 'scheduled' : 'sent',
    scheduledAt: scheduledAt ? Timestamp.fromDate(scheduledAt) : null,
    sentAt: isScheduled ? null : serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

type MessageUpdateInput = {
  text: string;
  scheduledAt: Date | null;
};

export const updateBroadcastMessage = (messageId: string, { text, scheduledAt }: MessageUpdateInput) => {
  const isScheduled = Boolean(scheduledAt);

  return updateDoc(doc(db, 'messages', messageId), {
    text,
    status: isScheduled ? 'scheduled' : 'sent',
    scheduledAt: scheduledAt ? Timestamp.fromDate(scheduledAt) : null,
    sentAt: isScheduled ? null : serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const deleteBroadcastMessage = (messageId: string) => deleteDoc(doc(db, 'messages', messageId));
