import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { RadioTower } from 'lucide-react';

export const AppShell = () => (
  <main className="min-h-screen bg-slate-50">
    <Container maxWidth="lg" className="py-8">
      <Paper elevation={0} className="border border-slate-200 p-6">
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <RadioTower size={32} strokeWidth={1.8} />
            <div>
              <Typography variant="h5" component="h1" fontWeight={700}>
                Broadcast SaaS
              </Typography>
              <Typography color="text.secondary">
                Estrutura inicial pronta para Auth, conexoes, contatos e mensagens.
              </Typography>
            </div>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="contained">Entrar</Button>
            <Button variant="outlined">Criar conta</Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  </main>
);
