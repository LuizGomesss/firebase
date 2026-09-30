import { useEffect, useState } from 'react';

import type { BroadcastMessage, MessageStatus } from '../../shared/domain';
import { subscribeToMessages } from './messagesService';

type MessagesState = {
  messages: BroadcastMessage[];
  loading: boolean;
  error: string;
};

export const useMessages = (clientId: string | undefined, status: MessageStatus | 'all'): MessagesState => {
  const [state, setState] = useState<MessagesState>({
    messages: [],
    loading: Boolean(clientId),
    error: '',
  });

  useEffect(() => {
    if (!clientId) {
      setState({ messages: [], loading: false, error: '' });
      return undefined;
    }

    setState((currentState) => ({ ...currentState, loading: true, error: '' }));

    const timeoutId = window.setTimeout(() => {
      setState((currentState) =>
        currentState.loading
          ? {
              messages: [],
              loading: false,
              error:
                'O Firestore demorou para responder. Verifique se o banco foi criado e se as regras foram publicadas.',
            }
          : currentState,
      );
    }, 8000);

    const unsubscribe = subscribeToMessages(
      clientId,
      status,
      (messages) => {
        window.clearTimeout(timeoutId);
        setState({ messages, loading: false, error: '' });
      },
      (error) => {
        window.clearTimeout(timeoutId);
        setState({
          messages: [],
          loading: false,
          error: `Nao foi possivel carregar as mensagens. ${error.message}`,
        });
      },
    );

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [clientId, status]);

  return state;
};
