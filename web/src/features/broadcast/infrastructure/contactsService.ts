import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type FirestoreError,
  type Timestamp,
} from 'firebase/firestore';

import type { Contact } from '../../shared/domain';
import { db } from '../../shared/infrastructure/firebase';

const contactsCollection = collection(db, 'contacts');

const timestampToDate = (value: unknown) => {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as Timestamp).toDate();
  }

  return new Date();
};

export const subscribeToContacts = (
  clientId: string,
  connectionId: string,
  onNext: (contacts: Contact[]) => void,
  onError: (error: FirestoreError) => void,
) => {
  const contactsQuery = query(
    contactsCollection,
    where('clientId', '==', clientId),
    where('connectionId', '==', connectionId),
  );

  return onSnapshot(
    contactsQuery,
    (snapshot) => {
      const contacts = snapshot.docs
        .map((contactDoc) => {
          const data = contactDoc.data();

          return {
            id: contactDoc.id,
            clientId: String(data.clientId),
            connectionId: String(data.connectionId),
            name: String(data.name),
            phone: String(data.phone),
            createdAt: timestampToDate(data.createdAt),
            updatedAt: timestampToDate(data.updatedAt),
          };
        })
        .sort((firstContact, secondContact) => secondContact.createdAt.getTime() - firstContact.createdAt.getTime());

      onNext(contacts);
    },
    onError,
  );
};

type ContactInput = {
  clientId: string;
  connectionId: string;
  name: string;
  phone: string;
};

export const createContact = ({ clientId, connectionId, name, phone }: ContactInput) =>
  addDoc(contactsCollection, {
    clientId,
    connectionId,
    name,
    phone,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

export const updateContact = (contactId: string, values: Pick<ContactInput, 'name' | 'phone'>) =>
  updateDoc(doc(db, 'contacts', contactId), {
    ...values,
    updatedAt: serverTimestamp(),
  });

export const deleteContact = (contactId: string) => deleteDoc(doc(db, 'contacts', contactId));
