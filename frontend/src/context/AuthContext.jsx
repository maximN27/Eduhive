import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('eduhive_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore user session on mount or token change
  useEffect(() => {
    let isMounted = true;

    async function checkAuthSession() {
      const storedToken = localStorage.getItem('eduhive_token');
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await authService.getMe();
        if (isMounted) {
          if (res && (res.user || res.data)) {
            setUser(res.user || res.data);
          } else {
            // Invalid response structure, clear token
            localStorage.removeItem('eduhive_token');
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('Session restoration failed:', err.message);
        if (isMounted) {
          localStorage.removeItem('eduhive_token');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkAuthSession();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const res = await authService.login(credentials);
      if (res && res.token) {
        localStorage.setItem('eduhive_token', res.token);
        setToken(res.token);
      }
      const fetchedUser = res.user || res.data || null;
      if (fetchedUser) {
        setUser(fetchedUser);
      }
      return res;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    try {
      const res = await authService.register(userData);
      if (res && res.token) {
        localStorage.setItem('eduhive_token', res.token);
        setToken(res.token);
      }
      const fetchedUser = res.user || res.data || null;
      if (fetchedUser) {
        setUser(fetchedUser);
      }
      return res;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout endpoint warning:', err.message);
    } finally {
      localStorage.removeItem('eduhive_token');
      setToken(null);
      setUser(null);
      setError(null);
    }
  }, []);

  const value = {
    token,
    user,
    loading,
    error,
    setError,
    login,
    register,
    logout,
    isAuthenticated: Boolean(token && user)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
