import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { LogIn } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { accountCreatedMessageKey, getAuthErrorMessage } from '../domain/authFeedback';
import { loginClient } from '../infrastructure/authService';

export const LoginPage = () => {
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

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-8">
      <Paper elevation={0} className="w-full max-w-md border border-slate-200 p-6">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4" component="h1" fontWeight={700}>
              SendFlow
            </Typography>
            <Typography color="text.secondary">Entre para gerenciar seus broadcasts.</Typography>
          </div>

          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            {successMessage ? (
              <Alert severity="success" onClose={() => setSuccessMessage('')}>
                {successMessage}
              </Alert>
            ) : null}
            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Senha"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              startIcon={<LogIn size={18} />}
            >
              {submitting ? 'Aguarde...' : 'Entrar'}
            </Button>
          </Stack>

          <Button component={Link} to="/auth/register" variant="text">
            Criar uma nova conta
          </Button>
        </Stack>
      </Paper>
    </main>
  );
};
