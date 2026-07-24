import React, { createContext, useContext } from 'react';
import { useApp } from './AppContext';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const app = useApp();
  
  const value = {
    token: app?.token || null,
    user: app?.user || null,
    loading: app?.loading || false,
    error: null,
    login: app?.handleLogin || (async (creds) => authService.login(creds)),
    register: app?.handleRegister || (async (data) => authService.register(data)),
    logout: app?.handleLogout || (async () => authService.logout()),
    setError: () => {}
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context) return context;
  
  // Safe fallback if AuthProvider is unmounted
  try {
    const app = useApp();
    if (app) {
      return {
        token: app.token,
        user: app.user,
        loading: app.loading,
        error: null,
        login: app.handleLogin,
        register: app.handleRegister,
        logout: app.handleLogout,
        setError: () => {}
      };
    }
  } catch (e) {
    // AppContext fallback catch
  }

  return {
    token: localStorage.getItem('eduhive_token') || null,
    user: null,
    loading: false,
    error: null,
    login: async (creds) => authService.login(creds),
    register: async (data) => authService.register(data),
    logout: async () => authService.logout(),
    setError: () => {}
  };
};
