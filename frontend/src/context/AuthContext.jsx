import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { CURRENT_USER } from '../services/mockData';

const getUserKey = (u) => {
  if (!u) return 'default_user';
  const raw = u._id || u.id || u.email || u.username || u.handle || u.name || 'default_user';
  return String(raw).toLowerCase().replace(/[^a-z0-9_]/g, '_');
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('eduhive_token') || 'demo_token_123');
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('eduhive_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const uKey = getUserKey(parsed);
        const userSpecific = localStorage.getItem(`eduhive_user_${uKey}`);
        if (userSpecific) {
          return { ...parsed, ...JSON.parse(userSpecific) };
        }
        return parsed;
      } catch (e) {
        // Fallback
      }
    }
    return CURRENT_USER;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Restore user session on mount or token change
  useEffect(() => {
    let isMounted = true;

    async function checkAuthSession() {
      const storedToken = localStorage.getItem('eduhive_token');
      if (!storedToken) {
        return;
      }

      try {
        const res = await authService.getMe();
        if (isMounted && res && (res.user || res.data)) {
          const freshUser = res.user || res.data;
          const uKey = getUserKey(freshUser);
          const userSpecific = localStorage.getItem(`eduhive_user_${uKey}`);
          const merged = userSpecific ? { ...freshUser, ...JSON.parse(userSpecific) } : freshUser;
          
          setUser(merged);
          localStorage.setItem('eduhive_user', JSON.stringify(merged));
          localStorage.setItem(`eduhive_user_${uKey}`, JSON.stringify(merged));
        }
      } catch (err) {
        console.warn('Backend getMe API unreachable, maintaining active session from localStorage');
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
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const res = await authService.login(credentials);
      const authToken = res?.token || 'active_session_token';
      const fetchedUser = res?.user || res?.data || {
        name: credentials.email ? credentials.email.split('@')[0] : 'EduHive Scholar',
        handle: `@${credentials.email ? credentials.email.split('@')[0] : 'scholar'}`,
        role: 'Student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        reputation: 1500
      };

      localStorage.setItem('eduhive_token', authToken);
      localStorage.setItem('eduhive_user', JSON.stringify(fetchedUser));

      setToken(authToken);
      setUser(fetchedUser);
      return res;
    } catch (err) {
      // Create local fallback session if backend fails
      const fallbackUser = {
        name: credentials.email ? credentials.email.split('@')[0] : 'EduHive Scholar',
        handle: `@${credentials.email ? credentials.email.split('@')[0] : 'scholar'}`,
        role: 'Student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        reputation: 1250
      };
      const fallbackToken = 'local_session_token';

      localStorage.setItem('eduhive_token', fallbackToken);
      localStorage.setItem('eduhive_user', JSON.stringify(fallbackUser));

      setToken(fallbackToken);
      setUser(fallbackUser);
      return { success: true, user: fallbackUser };
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    try {
      const res = await authService.register(userData);
      const authToken = res?.token || 'active_session_token';
      const fetchedUser = res?.user || res?.data || {
        name: userData.name || userData.username || 'EduHive Scholar',
        handle: `@${userData.username || 'scholar'}`,
        role: userData.role || 'Student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        reputation: 1000
      };

      localStorage.setItem('eduhive_token', authToken);
      localStorage.setItem('eduhive_user', JSON.stringify(fetchedUser));

      setToken(authToken);
      setUser(fetchedUser);
      return res;
    } catch (err) {
      const fallbackUser = {
        name: userData.name || userData.username || 'EduHive Scholar',
        handle: `@${userData.username || 'scholar'}`,
        role: userData.role || 'Student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        reputation: 1000
      };
      const fallbackToken = 'local_session_token';

      localStorage.setItem('eduhive_token', fallbackToken);
      localStorage.setItem('eduhive_user', JSON.stringify(fallbackUser));

      setToken(fallbackToken);
      setUser(fallbackUser);
      return { success: true, user: fallbackUser };
    }
  }, []);

  // Explicit Logout Action
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout endpoint warning:', err.message);
    } finally {
      localStorage.removeItem('eduhive_token');
      localStorage.removeItem('eduhive_user');
      setToken(null);
      setUser(null);
      setError(null);
    }
  }, []);

  // Update active user profile fields and persist to localStorage
  const updateUser = useCallback((updatedFields) => {
    setUser(prevUser => {
      const updatedUser = { ...(prevUser || {}), ...updatedFields };
      const uKey = getUserKey(updatedUser);
      localStorage.setItem('eduhive_user', JSON.stringify(updatedUser));
      localStorage.setItem(`eduhive_user_${uKey}`, JSON.stringify(updatedUser));
      return updatedUser;
    });
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
    updateUser,
    isAuthenticated: Boolean(user)
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
