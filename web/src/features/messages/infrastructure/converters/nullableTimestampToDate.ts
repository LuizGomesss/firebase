import { timestampToDate } from './timestampToDate';

export const nullableTimestampToDate = (value: unknown) => {
  if (!value) {
    return null;
  }

  return timestampToDate(value);
};
