import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';

initializeApp();

const db = getFirestore();

export const markScheduledMessagesAsSent = onSchedule('every 1 minutes', async () => {
  const now = Timestamp.now();
  const snapshot = await db
    .collection('messages')
    .where('status', '==', 'scheduled')
    .where('scheduledAt', '<=', now)
    .limit(500)
    .get();

  if (snapshot.empty) {
    logger.info('No scheduled messages to update.');
    return;
  }

  const batch = db.batch();

  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, {
      status: 'sent',
      sentAt: now,
      updatedAt: now,
    });
  });

  await batch.commit();
  logger.info('Scheduled messages marked as sent.', { count: snapshot.size });
});
