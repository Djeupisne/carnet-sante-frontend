import api from './api';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
}

export const notificationService = {
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<{ success: boolean; data: any }> {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  },

  async getUnreadCount(): Promise<{ success: boolean; data: { unreadCount: number } }> {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },
};