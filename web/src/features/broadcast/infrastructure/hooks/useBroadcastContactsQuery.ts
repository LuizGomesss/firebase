import { useQuery } from '@tanstack/react-query';

import { fetchContacts } from '../../../contacts/infrastructure/services/fetchContacts';

export const useBroadcastContactsQuery = (clientId: string | undefined, connectionId: string) =>
  useQuery({
    queryKey: ['broadcast', 'contacts', clientId, connectionId],
    queryFn: () => fetchContacts(clientId ?? '', connectionId),
    enabled: Boolean(clientId && connectionId),
    initialData: [],
  });
