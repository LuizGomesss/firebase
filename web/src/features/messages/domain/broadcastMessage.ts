import type { MessageStatus } from './messageStatus';

export type BroadcastMessage = {
  id: string;
  clientId: string;
  connectionId: string;
  contactIds: string[];
  text: string;
  status: MessageStatus;
  scheduledAt: Date | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
