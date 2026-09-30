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
