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
    try {
      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération notifications:', error);
      return { success: false, data: { notifications: [] } };
    }
  },
  async markAsRead(notificationId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur marquage notification:', error);
      return { success: false, message: 'Erreur lors du marquage' };
    }
  },
  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.patch('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur marquage toutes notifications:', error);
      return { success: false, message: 'Erreur lors du marquage' };
    }
  },
  async getUnreadCount(): Promise<{ success: boolean; data: { unreadCount: number } }> {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération nombre notifications:', error);
      return { success: false, data: { unreadCount: 0 } };
    }
  },
  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }): Promise<{ success: boolean; data: any }> {
    try {
      const response = await api.post('/notifications', data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur création notification:', error);
      return { success: false, data: null };
    }
  }
};
