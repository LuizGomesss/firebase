import { useEffect, useState } from 'react';

import type { Connection } from '../../../shared/domain';
import { subscribeToConnections } from '../services/subscribeToConnections';

type ConnectionsState = {
  connections: Connection[];
  loading: boolean;
  error: string;
};

export const useConnections = (clientId: string | undefined): ConnectionsState => {
  const [state, setState] = useState<ConnectionsState>({
    connections: [],
    loading: Boolean(clientId),
    error: '',
  });

  useEffect(() => {
    if (!clientId) {
      setState({ connections: [], loading: false, error: '' });
      return undefined;
    }

    setState((currentState) => ({ ...currentState, loading: true, error: '' }));

    const timeoutId = window.setTimeout(() => {
      setState((currentState) =>
        currentState.loading
          ? {
              connections: [],
              loading: false,
              error:
                'O Firestore demorou para responder. Verifique se o banco foi criado e se as regras foram publicadas.',
            }
          : currentState,
      );
    }, 8000);

    const unsubscribe = subscribeToConnections(
      clientId,
      (connections) => {
        window.clearTimeout(timeoutId);
        setState({ connections, loading: false, error: '' });
      },
      (error) => {
        window.clearTimeout(timeoutId);
        setState({
          connections: [],
          loading: false,
          error: `Nao foi possivel carregar as conexoes. ${error.message}`,
        });
      },
    );

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [clientId]);

  return state;
};
