import { Timestamp } from 'firebase/firestore';

export const timestampToDate = (value: unknown) => {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as Timestamp).toDate();
  }

  return new Date();
};
