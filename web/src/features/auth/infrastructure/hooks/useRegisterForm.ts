import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  accountCreatedMessage,
  accountCreatedMessageKey,
  getAuthErrorMessage,
} from '../../domain/authFeedback';
import { registerClient } from '../services/registerClient';

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
