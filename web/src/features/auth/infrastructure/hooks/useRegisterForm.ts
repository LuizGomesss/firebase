import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  accountCreatedMessage,
  accountCreatedMessageKey,
  getAuthErrorMessage,
} from '../../domain/authFeedback';
import { registerClient } from '../services/registerClient';
import { useRegisterFormStore } from '../stores/useRegisterFormStore';

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { email, password, error, submitting, setEmail, setPassword, setError, setSubmitting } = useRegisterFormStore();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await registerClient(email, password);
      window.sessionStorage.setItem(accountCreatedMessageKey, accountCreatedMessage);
      navigate('/auth/login', { replace: true });
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
    submitting,
    handleSubmit,
  };
};
