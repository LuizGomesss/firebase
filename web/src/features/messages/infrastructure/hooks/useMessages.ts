import { useQuery } from '@tanstack/react-query';

import type { MessageStatus } from '../../domain/messageStatus';
import { fetchMessages } from '../services/fetchMessages';

export const useMessages = (clientId: string | undefined, status: MessageStatus | 'all') => {
  const query = useQuery({
    queryKey: ['messages', clientId, status],
    queryFn: () => fetchMessages(clientId ?? '', status),
    enabled: Boolean(clientId),
    initialData: [],
  });

  return {
    messages: query.data,
    loading: query.isFetching,
    error: query.error ? 'Nao foi possivel carregar as mensagens.' : '',
  };
};
