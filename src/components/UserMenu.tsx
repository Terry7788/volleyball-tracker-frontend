'use client';

import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Chip,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  Person,
  Logout,
  Login,
  PersonAdd,
  BarChart,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

const UserMenu: React.FC = () => {
  const { user, guestSession, isAuthenticated, isGuest, logout, getCurrentUserType } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleSignIn = (): void => {
    setAuthModalOpen(true);
    handleClose();
  };

  const handleLogout = (): void => {
    logout();
    handleClose();
  };

  const getUserDisplayName = (): string => {
    if (isAuthenticated && user) {
      return user.username;
    }
    if (isGuest && guestSession) {
      return 'Guest';
    }
    return 'User';
  };

  const getExpirationText = (): string => {
    if (isGuest && guestSession) {
      const expirationDate = new Date(guestSession.expiresAt);
      const now = new Date();
      const hoursLeft = Math.round((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60));
      
      if (hoursLeft <= 0) return 'Expired';
      if (hoursLeft < 1) return 'Expires soon';
      if (hoursLeft === 1) return '1 hour left';
      return `${hoursLeft} hours left`;
    }
    return '';
  };

  // Build menu items array to avoid fragments
  const getMenuItems = () => {
    const items = [];

    // User Info Header
    items.push(
      <Box key="user-info" sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: isAuthenticated ? 'primary.main' : '#404040',
              color: isAuthenticated ? '#000000' : '#ffffff',
              fontSize: '0.875rem'
            }}
          >
            {getUserDisplayName().charAt(0).toUpperCase()}
          </Avatar>
          <Box flex={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {getUserDisplayName()}
            </Typography>
            {isAuthenticated && user && (
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            )}
          </Box>
          <Chip
            label={getCurrentUserType()}
            size="small"
            color={isAuthenticated ? 'primary' : 'default'}
            variant="outlined"
            sx={{ 
              fontSize: '0.65rem',
              height: 20,
              textTransform: 'capitalize'
            }}
          />
        </Box>

        {/* Guest session expiration warning */}
        {isGuest && guestSession && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="warning.main" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              fontSize: '0.7rem'
            }}>
              <Schedule sx={{ fontSize: 12 }} />
              {getExpirationText()}
            </Typography>
          </Box>
        )}
      </Box>
    );

    items.push(<Divider key="divider-1" sx={{ borderColor: '#404040' }} />);

    if (isAuthenticated) {
      // Authenticated user menu items
      items.push(
        <MenuItem key="statistics" onClick={handleClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <BarChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">View Statistics</Typography>
          </ListItemText>
        </MenuItem>
      );
      
      items.push(<Divider key="divider-2" sx={{ borderColor: '#404040' }} />);
      
      items.push(
        <MenuItem key="logout" onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Sign Out</Typography>
          </ListItemText>
        </MenuItem>
      );
    } else {
      // Guest user menu items
      items.push(
        <MenuItem key="signin" onClick={handleSignIn} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Login fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Sign In</Typography>
          </ListItemText>
        </MenuItem>
      );
      
      items.push(
        <MenuItem key="register" onClick={handleSignIn} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Create Account</Typography>
          </ListItemText>
        </MenuItem>
      );
      
      if (isGuest) {
        items.push(<Divider key="divider-guest" sx={{ borderColor: '#404040' }} />);
        items.push(
          <Box key="guest-notice" sx={{ px: 3, py: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ 
              fontSize: '0.7rem',
              display: 'block',
              mb: 1
            }}>
              Guest Mode Notice
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ 
              fontSize: '0.65rem',
              lineHeight: 1.3
            }}>
              Your matches will be automatically deleted after 24 hours. 
              Create an account to save your matches permanently.
            </Typography>
          </Box>
        );
      }
    }

    return items;
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          bgcolor: isAuthenticated ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
          color: isAuthenticated ? '#000000' : '#ffffff',
          '&:hover': {
            bgcolor: isAuthenticated ? 'primary.light' : 'rgba(255, 255, 255, 0.2)',
          },
          width: 40,
          height: 40
        }}
      >
        {isAuthenticated ? (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'transparent', color: 'inherit', fontSize: '0.875rem' }}>
            {user?.username.charAt(0).toUpperCase()}
          </Avatar>
        ) : (
          <Person sx={{ fontSize: 20 }} />
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: '#262626',
            border: '1px solid #404040',
            borderRadius: 2,
            minWidth: 280,
            mt: 1
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {getMenuItems()}
      </Menu>

      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
};

export default UserMenu;