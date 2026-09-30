import { useEffect, useState } from 'react';

import type { Contact } from '../../shared/domain';
import { subscribeToContacts } from './contactsService';

type ContactsState = {
  contacts: Contact[];
  loading: boolean;
  error: string;
};

export const useContacts = (clientId: string | undefined, connectionId: string): ContactsState => {
  const [state, setState] = useState<ContactsState>({
    contacts: [],
    loading: Boolean(clientId && connectionId),
    error: '',
  });

  useEffect(() => {
    if (!clientId || !connectionId) {
      setState({ contacts: [], loading: false, error: '' });
      return undefined;
    }

    setState((currentState) => ({ ...currentState, loading: true, error: '' }));

    const timeoutId = window.setTimeout(() => {
      setState((currentState) =>
        currentState.loading
          ? {
              contacts: [],
              loading: false,
              error:
                'O Firestore demorou para responder. Verifique se o banco foi criado e se as regras foram publicadas.',
            }
          : currentState,
      );
    }, 8000);

    const unsubscribe = subscribeToContacts(
      clientId,
      connectionId,
      (contacts) => {
        window.clearTimeout(timeoutId);
        setState({ contacts, loading: false, error: '' });
      },
      (error) => {
        window.clearTimeout(timeoutId);
        setState({
          contacts: [],
          loading: false,
          error: `Nao foi possivel carregar os contatos. ${error.message}`,
        });
      },
    );

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [clientId, connectionId]);

  return state;
};
