import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import theme from './theme';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import SearchPage from './pages/SearchPage/SearchPage';
import ItineraryDetailPage from './pages/ItineraryDetailPage/ItineraryDetailPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import CreateEditPage from './pages/CreateEditPage/CreateEditPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AuthPage from './pages/AuthPage/AuthPage';

import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppShell() {
  const { toastMessage } = useApp();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/"                element={<HomePage />} />
          <Route path="/search"          element={<SearchPage />} />
          <Route path="/itinerary/:id"   element={<ItineraryDetailPage />} />
          
          <Route path="/dashboard"       element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/:tab"  element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/create"          element={<ProtectedRoute><CreateEditPage /></ProtectedRoute>} />
          <Route path="/edit/:id"        element={<ProtectedRoute><CreateEditPage /></ProtectedRoute>} />
          <Route path="/profile"         element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          <Route path="/login"           element={<AuthPage />} />
          <Route path="/signup"          element={<AuthPage />} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Snackbar
        open={!!toastMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 2 }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8B4FE',
            color: '#2E1065',
            fontWeight: 500,
            '& .MuiAlert-icon': { color: '#22C55E' },
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AppShell />
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
