import { useQuery } from '@tanstack/react-query';

import { fetchConnections } from '../../../connections/infrastructure/services/fetchConnections';

export const useBroadcastConnectionsQuery = (clientId: string | undefined) =>
  useQuery({
    queryKey: ['broadcast', 'connections', clientId],
    queryFn: () => fetchConnections(clientId ?? ''),
    enabled: Boolean(clientId),
    initialData: [],
  });
