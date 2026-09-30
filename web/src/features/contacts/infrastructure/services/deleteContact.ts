import { deleteDoc, doc } from 'firebase/firestore';

import { db } from '../../../shared/infrastructure/firebase';

export const deleteContact = (contactId: string) => deleteDoc(doc(db, 'contacts', contactId));
