import { addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

import { messagesCollection } from '../firebase/messagesCollection';

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
