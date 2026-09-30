import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { RadioTower } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import { logoutClient } from '../../../auth/infrastructure/services/logoutClient';

type AppShellProps = {
  email: string;
};

export const AppShell = ({ email }: AppShellProps) => (
  <main className="min-h-screen bg-slate-50">
    <Container maxWidth="lg" className="py-8">
      <Stack spacing={3}>
        <Paper elevation={0} className="border border-slate-200 p-6">
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <RadioTower size={32} strokeWidth={1.8} />
              <div>
                <Typography variant="h5" component="h1" fontWeight={700}>
                  SendFlow
                </Typography>
                <Typography color="text.secondary">Conectado como {email}</Typography>
              </div>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button component={NavLink} to="/app/connections" variant="contained">
                Conexoes
              </Button>
              <Button component={NavLink} to="/app/contacts" variant="outlined">
                Contatos
              </Button>
              <Button component={NavLink} to="/app/broadcast" variant="outlined">
                Broadcast
              </Button>
              <Button component={NavLink} to="/app/messages" variant="outlined">
                Mensagens
              </Button>
              <Button variant="text" color="inherit" onClick={logoutClient}>
                Sair
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Outlet />
      </Stack>
    </Container>
  </main>
);
