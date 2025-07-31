'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, guestService } from '@/services/AuthService';

interface User {
  username: string;
  email: string;
}

interface GuestSession {
  sessionId: string;
  expiresAt: string;
}

interface AuthContextType {
  // User state
  user: User | null;
  guestSession: GuestSession | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  loading: boolean;
  
  // Auth methods
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Guest methods
  createGuestSession: () => Promise<void>;
  clearGuestSession: () => void;
  
  // Utility
  getCurrentUserType: () => 'registered' | 'guest' | 'none';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async (): Promise<void> => {
    try {
      setLoading(true);

      // Check for existing JWT token
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await authService.validateToken();
          setUser(userData);
          setLoading(false);
          return;
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('auth_token');
          console.log('Invalid token removed');
        }
      }

      // Check for existing guest session
      const existingGuestSession = localStorage.getItem('guest_session');
      if (existingGuestSession) {
        try {
          const guestData: GuestSession = JSON.parse(existingGuestSession);
          
          // Validate guest session is still valid
          const isValid = await guestService.validateSession(guestData.sessionId);
          if (isValid) {
            setGuestSession(guestData);
            console.log('Restored existing guest session:', guestData.sessionId);
            setLoading(false);
            return;
          } else {
            // Session expired, remove it
            localStorage.removeItem('guest_session');
            console.log('Expired guest session removed');
          }
        } catch (error) {
          localStorage.removeItem('guest_session');
          console.log('Invalid guest session data removed');
        }
      }

      // No valid auth found, create new guest session
      console.log('Creating new guest session...');
      await createGuestSession();
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Fallback: create guest session
      await createGuestSession();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await authService.login(username, password);
      
      // Store token
      localStorage.setItem('auth_token', response.token);
      
      // Clear guest session if exists
      localStorage.removeItem('guest_session');
      setGuestSession(null);
      
      // Set user
      setUser({ username: response.username, email: response.email });
      
      console.log('User logged in successfully:', response.username);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      const response = await authService.register(username, email, password);
      
      // Store token
      localStorage.setItem('auth_token', response.token);
      
      // Clear guest session if exists
      localStorage.removeItem('guest_session');
      setGuestSession(null);
      
      // Set user
      setUser({ username: response.username, email: response.email });
      
      console.log('User registered successfully:', response.username);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = (): void => {
    console.log('Logging out user...');
    
    // Clear user data
    localStorage.removeItem('auth_token');
    setUser(null);
    
    // Clear guest session data as well (fresh start)
    localStorage.removeItem('guest_session');
    setGuestSession(null);
    
    // Refresh the page to reset the app state
    window.location.reload();
  };

  const createGuestSession = async (): Promise<void> => {
    try {
      const guestData = await guestService.createSession();
      setGuestSession(guestData);
      localStorage.setItem('guest_session', JSON.stringify(guestData));
      console.log('Guest session created:', guestData.sessionId);
    } catch (error) {
      console.error('Failed to create guest session:', error);
      throw error;
    }
  };

  const clearGuestSession = (): void => {
    localStorage.removeItem('guest_session');
    setGuestSession(null);
    console.log('Guest session cleared');
  };

  const getCurrentUserType = (): 'registered' | 'guest' | 'none' => {
    if (user) return 'registered';
    if (guestSession) return 'guest';
    return 'none';
  };

  const value: AuthContextType = {
    user,
    guestSession,
    isAuthenticated: !!user,
    isGuest: !!guestSession && !user,
    loading,
    login,
    register,
    logout,
    createGuestSession,
    clearGuestSession,
    getCurrentUserType,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};