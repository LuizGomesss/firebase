import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useLoginForm } from '../infrastructure/useLoginForm';

export const LoginPage = () => {
  const form = useLoginForm();

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

          <Stack component="form" spacing={2} onSubmit={form.handleSubmit}>
            {form.successMessage ? (
              <Alert severity="success" onClose={() => form.setSuccessMessage('')}>
                {form.successMessage}
              </Alert>
            ) : null}
            {form.error ? <Alert severity="error">{form.error}</Alert> : null}

            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => form.setEmail(event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Senha"
              type="password"
              value={form.password}
              onChange={(event) => form.setPassword(event.target.value)}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={form.submitting}
              startIcon={<LogIn size={18} />}
            >
              {form.submitting ? 'Aguarde...' : 'Entrar'}
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
