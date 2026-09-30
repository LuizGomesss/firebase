import { getDocs, query, where } from 'firebase/firestore';

import { contactsCollection } from '../firebase/contactsCollection';
import { mapContactDocument } from '../mappers/mapContactDocument';

export const fetchContacts = async (clientId: string, connectionId: string) => {
  const snapshot = await getDocs(
    query(contactsCollection, where('clientId', '==', clientId), where('connectionId', '==', connectionId)),
  );

  return snapshot.docs
    .map(mapContactDocument)
    .sort((firstContact, secondContact) => secondContact.createdAt.getTime() - firstContact.createdAt.getTime());
};
