import { type FormEvent, useEffect, useState } from 'react';

import { useAuth } from '../../../auth/infrastructure/hooks/useAuth';
import { useConnections } from '../../../connections/infrastructure/hooks/useConnections';
import { useContacts } from '../../../contacts/infrastructure/hooks/useContacts';
import { createBroadcastMessage } from '../../../messages/infrastructure/services/createBroadcastMessage';
import type { SendMode } from '../../domain/sendMode';

export const useBroadcastPage = () => {
  const { user } = useAuth();
  const { connections, loading: loadingConnections, error: connectionsError } = useConnections(user?.uid);
  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const { contacts, loading: loadingContacts, error: contactsError } = useContacts(user?.uid, selectedConnectionId);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [sendMode, setSendMode] = useState<SendMode>('now');
  const [scheduledAt, setScheduledAt] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedConnectionId && connections.length > 0) {
      setSelectedConnectionId(connections[0].id);
    }

    if (selectedConnectionId && connections.every((connection) => connection.id !== selectedConnectionId)) {
      setSelectedConnectionId(connections[0]?.id ?? '');
    }
  }, [connections, selectedConnectionId]);

  useEffect(() => {
    setSelectedContactIds((currentIds) =>
      currentIds.filter((contactId) => contacts.some((contact) => contact.id === contactId)),
    );
  }, [contacts]);

  const toggleContact = (contactId: string) => {
    setSelectedContactIds((currentIds) =>
      currentIds.includes(contactId)
        ? currentIds.filter((currentContactId) => currentContactId !== contactId)
        : [...currentIds, contactId],
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

    if (selectedContactIds.length === 0) {
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
        contactIds: selectedContactIds,
        text: messageText,
        scheduledAt: scheduledDate,
      });

      setText('');
      setScheduledAt('');
      setSelectedContactIds([]);
      setSendMode('now');
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
    loadingConnections,
    loadingContacts,
    connectionsError,
    contactsError,
    selectedConnectionId,
    setSelectedConnectionId,
    selectedContactIds,
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
