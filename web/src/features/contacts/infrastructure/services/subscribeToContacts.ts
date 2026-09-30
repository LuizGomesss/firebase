import { onSnapshot, query, where, type FirestoreError } from 'firebase/firestore';

import type { Contact } from '../../../shared/domain';
import { contactsCollection } from '../firebase/contactsCollection';
import { mapContactDocument } from '../mappers/mapContactDocument';

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
        .map(mapContactDocument)
        .sort((firstContact, secondContact) => secondContact.createdAt.getTime() - firstContact.createdAt.getTime());

      onNext(contacts);
    },
    onError,
  );
};
