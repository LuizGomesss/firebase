import { collection } from 'firebase/firestore';

import { db } from '../../../shared/infrastructure/firebase';

export const connectionsCollection = collection(db, 'connections');
