import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const guestSessionId = localStorage.getItem('guest_session');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (guestSessionId) {
    try {
      const guestData = JSON.parse(guestSessionId);
      config.headers['Guest-Session-Id'] = guestData.sessionId;
    } catch (error) {
      console.error('Invalid guest session data:', error);
    }
  }
  
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('guest_session');
      // Could redirect to login or refresh page
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth response interfaces
interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
}

interface GuestSessionResponse {
  sessionId: string;
  expiresAt: string;
}

interface ValidationResponse {
  valid: boolean;
}

// Authentication service
export const authService = {
  // Register new user
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  // Login user
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  // Validate token
  validateToken: async (): Promise<{ username: string; email: string }> => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await api.post<AuthResponse>('/auth/validate', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return {
      username: response.data.username,
      email: response.data.email,
    };
  },
};

// Guest service
export const guestService = {
  // Create guest session
  createSession: async (): Promise<GuestSessionResponse> => {
    const response = await api.post<GuestSessionResponse>('/guest/session');
    return response.data;
  },

  // Validate guest session
  validateSession: async (sessionId: string): Promise<boolean> => {
    try {
      const response = await api.get<ValidationResponse>(`/guest/session/${sessionId}/validate`);
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },
};

// Export the configured axios instance for use in other services
export { api };