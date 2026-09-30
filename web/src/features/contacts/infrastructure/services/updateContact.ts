import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { db } from '../../../shared/infrastructure/firebase';
import type { ContactInput } from './contactInput';

export const updateContact = (contactId: string, values: Pick<ContactInput, 'name' | 'phone'>) =>
  updateDoc(doc(db, 'contacts', contactId), {
    ...values,
    updatedAt: serverTimestamp(),
  });
