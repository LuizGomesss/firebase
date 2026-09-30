import type { FormEvent } from 'react';

import { getAuthErrorMessage } from '../../domain/authFeedback';
import { loginClient } from '../services/loginClient';
import { useLoginFormStore } from '../stores/useLoginFormStore';

export const useLoginForm = () => {
  const { email, password, error, successMessage, submitting, setEmail, setPassword, setError, setSuccessMessage, setSubmitting } =
    useLoginFormStore();

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
