import { collection } from 'firebase/firestore';

import { db } from '../../../shared/infrastructure/firebase';

export const contactsCollection = collection(db, 'contacts');
