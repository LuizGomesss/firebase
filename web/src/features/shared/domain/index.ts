export type MessageStatus = 'scheduled' | 'sent';

export type Connection = {
  id: string;
  clientId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Contact = {
  id: string;
  clientId: string;
  connectionId: string;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
};

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
