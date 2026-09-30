import { CircularProgress, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { theme } from './theme';
import { useAuth } from '../features/auth/infrastructure/hooks/useAuth';
import { LoginPage } from '../features/auth/presentation/LoginPage';
import { RegisterPage } from '../features/auth/presentation/RegisterPage';
import { AppShell } from '../features/app-shell/presentation/ui/AppShell';
import { BroadcastPage } from '../features/broadcast/presentation/BroadcastPage';
import { ConnectionsPage } from '../features/connections/presentation/ConnectionsPage';
import { ContactsPage } from '../features/contacts/presentation/ContactsPage';
import { MessagesPage } from '../features/messages/presentation/MessagesPage';

export const App = () => {
  const { user, loading } = useAuth();

  return <ThemeProvider theme={theme}>
    <CssBaseline />
    {loading ? <main className="grid min-h-screen place-items-center bg-slate-50">
      <CircularProgress />
    </main> : <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={<Navigate to={user ? '/app/connections' : '/auth/login'} replace />}
        />
        <Route
          path="/auth/login"
          element={user ? <Navigate to="/app/connections" replace /> : <LoginPage />}
        />
        <Route
          path="/auth/register"
          element={user ? <Navigate to="/app/connections" replace /> : <RegisterPage />}
        />
        <Route
          path="/app"
          element={
            user ? <AppShell email={user.email ?? 'cliente'} /> : <Navigate to="/auth" replace />
          }
        >
          <Route index element={<Navigate to="/app/connections" replace />} />
          <Route path="connections" element={<ConnectionsPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="broadcast" element={<BroadcastPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? '/app/connections' : '/auth/login'} replace />} />
      </Routes>
    </BrowserRouter>}
  </ThemeProvider>
};
