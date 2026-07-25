import { authService } from '../services/authService';

export const registerApi = async (userData) => authService.register(userData);
export const loginApi = async (credentials) => authService.login(credentials);
export const getMeApi = async () => authService.getMe();
export const logoutApi = async () => authService.logout();
