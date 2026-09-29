import { CircularProgress, CssBaseline, ThemeProvider } from '@mui/material';

import { theme } from './theme';
import { AppShell } from '../components/AppShell';
import { AuthPage } from '../features/auth/AuthPage';
import { useAuth } from '../features/auth/useAuth';

export const App = () => {
  const { user, loading } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {loading ? (
        <main className="grid min-h-screen place-items-center bg-slate-50">
          <CircularProgress />
        </main>
      ) : user ? (
        <AppShell email={user.email ?? 'cliente'} />
      ) : (
        <AuthPage />
      )}
    </ThemeProvider>
  );
};
