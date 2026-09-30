import { doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';

import { db } from '../../../shared/infrastructure/firebase';

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
