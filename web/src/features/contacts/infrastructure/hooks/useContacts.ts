import { useQuery } from '@tanstack/react-query';

import { fetchContacts } from '../services/fetchContacts';

export const useContacts = (clientId: string | undefined, connectionId: string) => {
  const query = useQuery({
    queryKey: ['contacts', clientId, connectionId],
    queryFn: () => fetchContacts(clientId ?? '', connectionId),
    enabled: Boolean(clientId && connectionId),
    initialData: [],
  });

  return {
    contacts: query.data,
    loading: query.isFetching,
    error: query.error ? 'Nao foi possivel carregar os contatos.' : '',
  };
};
