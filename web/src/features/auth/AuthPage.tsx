import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { LogIn, UserPlus } from 'lucide-react';
import { type FormEvent, useState } from 'react';

import { loginClient, registerClient } from './authService';

type AuthMode = 'login' | 'register';

const authErrorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'Este email ja esta cadastrado.',
  'auth/invalid-credential': 'Email ou senha invalidos.',
  'auth/invalid-email': 'Informe um email valido.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
};

const getAuthErrorMessage = (error: unknown) => {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  return authErrorMessages[code] ?? 'Nao foi possivel concluir a autenticacao.';
};

export const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isLogin) {
        await loginClient(email, password);
      } else {
        await registerClient(email, password);
      }
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
            <Typography color="text.secondary">
              {isLogin ? 'Entre para gerenciar seus broadcasts.' : 'Crie sua conta para comecar.'}
            </Typography>
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
              startIcon={isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            >
              {submitting ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
          </Stack>

          <Button variant="text" onClick={() => setMode(isLogin ? 'register' : 'login')}>
            {isLogin ? 'Criar uma nova conta' : 'Ja tenho uma conta'}
          </Button>
        </Stack>
      </Paper>
    </main>
  );
};
