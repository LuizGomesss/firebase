import { deleteDoc, doc } from 'firebase/firestore';

import { db } from '../../../shared/infrastructure/firebase';

export const deleteConnection = (connectionId: string) => deleteDoc(doc(db, 'connections', connectionId));
