import { apiRequest } from './api';

export const notificationService = {
  // Fetch user notifications
  getNotifications: async () => {
    return await apiRequest('/notifications', 'GET');
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    return await apiRequest(`/notifications/${id}/read`, 'PUT');
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return await apiRequest('/notifications/read-all', 'PUT');
  }
};
