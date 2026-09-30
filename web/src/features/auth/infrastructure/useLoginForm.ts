import { type FormEvent, useEffect, useState } from 'react';

import { accountCreatedMessageKey, getAuthErrorMessage } from '../domain/authFeedback';
import { loginClient } from './authService';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const pendingMessage = window.sessionStorage.getItem(accountCreatedMessageKey);

    if (pendingMessage) {
      setSuccessMessage(pendingMessage);
      window.sessionStorage.removeItem(accountCreatedMessageKey);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await loginClient(email, password);
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    successMessage,
    setSuccessMessage,
    submitting,
    handleSubmit,
  };
};
