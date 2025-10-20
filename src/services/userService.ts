import api from './api';
import { User, PaginatedResponse } from '../types';

export const userService = {
  async getProfile(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.get('/profile');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; data: { user: User } }> {
    const response = await api.put('/profile', data);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await api.patch('/profile/change-password', { currentPassword, newPassword });
    return response.data;
  },

  async getDashboardStats(): Promise<{ success: boolean; data: { stats: any } }> {
    const response = await api.get('/profile/dashboard');
    return response.data;
  },

  async searchDoctors(params: {
    specialty?: string;
    city?: string;
    availability?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: PaginatedResponse<User> }> {
    const response = await api.get('/search/doctors', { params });
    return response.data;
  },

  async getAllDoctors(): Promise<{ success: boolean; data: User[] }> {
    try {
      console.log('Appel à l\'API pour récupérer les médecins...');
      const response = await api.get('/users', { params: { role: 'doctor' } });
      console.log('Réponse de l\'API pour les médecins:', response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Erreur dans getAllDoctors:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des médecins');
    }
  },

  async getAllPatients(): Promise<{ success: boolean; data: User[] }> {
    try {
      console.log('Appel à l\'API pour récupérer les patients...');
      const response = await api.get('/users', { params: { role: 'patient' } });
      console.log('Réponse de l\'API pour les patients:', response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Erreur dans getAllPatients:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des patients');
    }
  },

  async updateUser(userId: string, data: { isActive?: boolean }): Promise<{ success: boolean; data: User }> {
    try {
      console.log(`Mise à jour de l'utilisateur ${userId} avec:`, data);
      const response = await api.put(`/users/${userId}`, data);
      console.log('Réponse de l\'API pour la mise à jour:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur dans updateUser:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
    }
  },
};