import type { FormEvent } from 'react';

import { useAuth } from '../../../auth/infrastructure/hooks/useAuth';
import { createBroadcastMessage } from '../../../messages/infrastructure/services/createBroadcastMessage';
import { useBroadcastPageStore } from '../stores/useBroadcastPageStore';
import { useBroadcastConnectionsQuery } from './useBroadcastConnectionsQuery';
import { useBroadcastContactsQuery } from './useBroadcastContactsQuery';

export const useBroadcastPage = () => {
  const { user } = useAuth();
  const {
    selectedConnectionId: storedSelectedConnectionId,
    selectedContactIds,
    text,
    sendMode,
    scheduledAt,
    formError,
    successMessage,
    submitting,
    setSelectedConnectionId,
    setSelectedContactIds,
    setText,
    setSendMode,
    setScheduledAt,
    setFormError,
    setSuccessMessage,
    setSubmitting,
    resetForm,
  } = useBroadcastPageStore();

  const connectionsQuery = useBroadcastConnectionsQuery(user?.uid);
  const connections = connectionsQuery.data;
  const selectedConnectionExists = connections.some((connection) => connection.id === storedSelectedConnectionId);
  const selectedConnectionId = selectedConnectionExists ? storedSelectedConnectionId : connections[0]?.id ?? '';
  const contactsQuery = useBroadcastContactsQuery(user?.uid, selectedConnectionId);
  const contacts = contactsQuery.data;
  const validSelectedContactIds = selectedContactIds.filter((contactId) =>
    contacts.some((contact) => contact.id === contactId),
  );

  const toggleContact = (contactId: string) => {
    setSelectedContactIds(
      validSelectedContactIds.includes(contactId)
        ? validSelectedContactIds.filter((currentContactId) => currentContactId !== contactId)
        : [...validSelectedContactIds, contactId],
    );
  };

  const selectAllContacts = () => {
    setSelectedContactIds(contacts.map((contact) => contact.id));
  };

  const clearSelectedContacts = () => {
    setSelectedContactIds([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !selectedConnectionId) {
      return;
    }

    const messageText = text.trim();
    const scheduledDate = sendMode === 'scheduled' ? new Date(scheduledAt) : null;

    if (validSelectedContactIds.length === 0) {
      setFormError('Selecione pelo menos um contato.');
      return;
    }

    if (!messageText) {
      setFormError('Escreva a mensagem do broadcast.');
      return;
    }

    if (sendMode === 'scheduled' && (!scheduledAt || !scheduledDate || scheduledDate <= new Date())) {
      setFormError('Informe uma data futura para agendar a mensagem.');
      return;
    }

    setSubmitting(true);
    setFormError('');
    setSuccessMessage('');

    try {
      await createBroadcastMessage({
        clientId: user.uid,
        connectionId: selectedConnectionId,
        contactIds: validSelectedContactIds,
        text: messageText,
        scheduledAt: scheduledDate,
      });

      resetForm();
      setSuccessMessage(sendMode === 'scheduled' ? 'Mensagem agendada com sucesso.' : 'Mensagem enviada com sucesso.');
    } catch {
      setFormError('Nao foi possivel criar a mensagem.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    connections,
    contacts,
    loadingConnections: connectionsQuery.isFetching,
    loadingContacts: contactsQuery.isFetching,
    connectionsError: connectionsQuery.error ? 'Nao foi possivel carregar as conexoes.' : '',
    contactsError: contactsQuery.error ? 'Nao foi possivel carregar os contatos.' : '',
    selectedConnectionId,
    setSelectedConnectionId,
    selectedContactIds: validSelectedContactIds,
    text,
    setText,
    sendMode,
    setSendMode,
    scheduledAt,
    setScheduledAt,
    formError,
    successMessage,
    submitting,
    hasConnections: connections.length > 0,
    hasContacts: contacts.length > 0,
    toggleContact,
    selectAllContacts,
    clearSelectedContacts,
    handleSubmit,
  };
};
