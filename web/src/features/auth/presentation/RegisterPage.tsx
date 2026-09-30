import { Alert, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useRegisterForm } from '../infrastructure/useRegisterForm';

export const RegisterPage = () => {
  const form = useRegisterForm();

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

          <Stack component="form" spacing={2} onSubmit={form.handleSubmit}>
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
              inputProps={{ minLength: 6 }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={form.submitting}
              startIcon={<UserPlus size={18} />}
            >
              {form.submitting ? 'Aguarde...' : 'Criar conta'}
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
