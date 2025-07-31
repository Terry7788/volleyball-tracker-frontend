'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import { Person, PersonAdd, SportsVolleyball } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const { login, register, isGuest, guestSession } = useAuth();
  const [tab, setTab] = useState<number>(0); // 0 = login, 1 = register
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Register form state
  const [registerUsername, setRegisterUsername] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleClose = (): void => {
    setError(null);
    setLoginUsername('');
    setLoginPassword('');
    setRegisterUsername('');
    setRegisterEmail('');
    setRegisterPassword('');
    setConfirmPassword('');
    setTab(0);
    onClose();
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await login(loginUsername.trim(), loginPassword);
      handleClose();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!registerUsername.trim() || !registerEmail.trim() || !registerPassword.trim()) return;

    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register(registerUsername.trim(), registerEmail.trim(), registerPassword);
      handleClose();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isLoginValid = (): boolean => {
    return loginUsername.trim().length > 0 && loginPassword.trim().length > 0;
  };

  const isRegisterValid = (): boolean => {
    return (
      registerUsername.trim().length >= 3 &&
      registerEmail.trim().includes('@') &&
      registerPassword.length >= 6 &&
      registerPassword === confirmPassword
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: '1px solid #404040'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ p: 4, pb: 2, textAlign: 'center' }}>
          <SportsVolleyball sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 400 }}>
            {tab === 0 ? 'Welcome Back' : 'Create Account'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tab === 0 
              ? 'Sign in to save your matches permanently'
              : 'Join to save your matches and track your progress'
            }
          </Typography>
        </Box>

        {/* Guest Session Info */}
        {isGuest && guestSession && (
          <Box sx={{ px: 4, pb: 2 }}>
            <Alert 
              severity="info" 
              sx={{ 
                bgcolor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                color: 'text.secondary',
                '& .MuiAlert-icon': {
                  color: 'primary.main'
                }
              }}
            >
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                Currently using guest mode - your matches will be deleted after 24 hours
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Tabs */}
        <Box sx={{ px: 4 }}>
          <Tabs
            value={tab}
            onChange={(_, newValue) => {
              setTab(newValue);
              setError(null);
            }}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab 
              icon={<Person />} 
              label="Sign In" 
              sx={{ textTransform: 'none', fontWeight: 400 }}
            />
            <Tab 
              icon={<PersonAdd />} 
              label="Register" 
              sx={{ textTransform: 'none', fontWeight: 400 }}
            />
          </Tabs>
        </Box>

        {/* Error Alert */}
        {error && (
          <Box sx={{ px: 4, pb: 2 }}>
            <Alert severity="error" sx={{ fontSize: '0.875rem' }}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Login Form */}
        {tab === 0 && (
          <Box sx={{ px: 4, pb: 2 }}>
            <form onSubmit={handleLogin}>
              <Stack spacing={3}>
                <TextField
                  label="Username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  fullWidth
                  disabled={loading}
                  autoComplete="username"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  fullWidth
                  disabled={loading}
                  autoComplete="current-password"
                />
              </Stack>
            </form>
          </Box>
        )}

        {/* Register Form */}
        {tab === 1 && (
          <Box sx={{ px: 4, pb: 2 }}>
            <form onSubmit={handleRegister}>
              <Stack spacing={3}>
                <TextField
                  label="Username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  fullWidth
                  disabled={loading}
                  helperText="At least 3 characters"
                  autoComplete="username"
                />
                <TextField
                  label="Email"
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  fullWidth
                  disabled={loading}
                  autoComplete="email"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  fullWidth
                  disabled={loading}
                  helperText="At least 6 characters"
                  autoComplete="new-password"
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  disabled={loading}
                  error={confirmPassword.length > 0 && registerPassword !== confirmPassword}
                  helperText={
                    confirmPassword.length > 0 && registerPassword !== confirmPassword
                      ? 'Passwords do not match'
                      : ''
                  }
                  autoComplete="new-password"
                />
              </Stack>
            </form>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 2 }}>
        <Stack direction="row" spacing={2} width="100%">
          <Button
            onClick={handleClose}
            variant="outlined"
            fullWidth
            disabled={loading}
            sx={{
              textTransform: 'none',
              fontWeight: 400
            }}
          >
            Continue as Guest
          </Button>
          <Button
            onClick={tab === 0 ? handleLogin : handleRegister}
            variant="contained"
            fullWidth
            disabled={loading || (tab === 0 ? !isLoginValid() : !isRegisterValid())}
            sx={{
              textTransform: 'none',
              fontWeight: 400,
              bgcolor: (tab === 0 ? isLoginValid() : isRegisterValid()) ? '#ffffff' : '#404040',
              color: (tab === 0 ? isLoginValid() : isRegisterValid()) ? '#000000' : '#525252',
              '&:hover': {
                bgcolor: (tab === 0 ? isLoginValid() : isRegisterValid()) ? '#e5e5e5' : '#404040',
              },
              '&:disabled': {
                bgcolor: '#404040',
                color: '#525252',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              tab === 0 ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;