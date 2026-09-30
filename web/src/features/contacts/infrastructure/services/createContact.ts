import { addDoc, serverTimestamp } from 'firebase/firestore';

import { contactsCollection } from '../firebase/contactsCollection';
import type { ContactInput } from './contactInput';

export const createContact = ({ clientId, connectionId, name, phone }: ContactInput) =>
  addDoc(contactsCollection, {
    clientId,
    connectionId,
    name,
    phone,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
