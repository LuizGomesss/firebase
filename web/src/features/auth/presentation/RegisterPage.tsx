import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { UserPlus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  accountCreatedMessage,
  accountCreatedMessageKey,
  getAuthErrorMessage,
} from '../domain/authFeedback';
import { registerClient } from '../infrastructure/authService';

export const RegisterPage = () => {
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

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-8">
      <Paper elevation={0} className="w-full max-w-md border border-slate-200 p-6">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4" component="h1" fontWeight={700}>
              SendFlow
            </Typography>
            <Typography color="text.secondary">Crie sua conta para comecar.</Typography>
          </div>

          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
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
              inputProps={{ minLength: 6 }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              startIcon={<UserPlus size={18} />}
            >
              {submitting ? 'Aguarde...' : 'Criar conta'}
            </Button>
          </Stack>

          <Button component={Link} to="/auth/login" variant="text">
            Ja tenho uma conta
          </Button>
        </Stack>
      </Paper>
    </main>
  );
};
