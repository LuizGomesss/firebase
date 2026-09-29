import { Paper, Stack, Typography } from '@mui/material';

export const ConnectionsPage = () => (
  <Paper elevation={0} className="border border-slate-200 p-6">
    <Stack spacing={1}>
      <Typography variant="h5" component="h2" fontWeight={700}>
        Conexoes
      </Typography>
      <Typography color="text.secondary">
        Aqui sera implementado o CRUD de conexoes do cliente autenticado.
      </Typography>
    </Stack>
  </Paper>
);
