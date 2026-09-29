import { CssBaseline, ThemeProvider } from '@mui/material';

import { theme } from './theme';
import { AppShell } from '../components/AppShell';

export const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AppShell />
  </ThemeProvider>
);
