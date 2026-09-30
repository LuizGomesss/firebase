import { deleteDoc, doc } from 'firebase/firestore';

import { db } from '../../../shared/infrastructure/firebase';

export const deleteBroadcastMessage = (messageId: string) => deleteDoc(doc(db, 'messages', messageId));
