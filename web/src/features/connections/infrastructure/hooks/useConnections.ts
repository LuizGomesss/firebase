import { useQuery } from '@tanstack/react-query';

import { fetchConnections } from '../services/fetchConnections';

export const useConnections = (clientId: string | undefined) => {
  const query = useQuery({
    queryKey: ['connections', clientId],
    queryFn: () => fetchConnections(clientId ?? ''),
    enabled: Boolean(clientId),
    initialData: [],
  });

  return {
    connections: query.data,
    loading: query.isFetching,
    error: query.error ? 'Nao foi possivel carregar as conexoes.' : '',
  };
};
