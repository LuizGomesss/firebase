import { Paper, Stack, Typography } from '@mui/material';

export const MessagesPage = () => (
  <Paper elevation={0} className="border border-slate-200 p-6">
    <Stack spacing={1}>
      <Typography variant="h5" component="h2" fontWeight={700}>
        Mensagens
      </Typography>
      <Typography color="text.secondary">
        Aqui sera implementada a listagem com filtros de enviadas e agendadas.
      </Typography>
    </Stack>
  </Paper>
);
