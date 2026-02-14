import api from './api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'doctor' | 'patient' | 'admin';
  phoneNumber?: string;
  specialty?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  status: string;
  type: string;
  patient?: { firstName: string; lastName: string };
  doctor?: { firstName: string; lastName: string };
}

export interface DashboardStats {
  users: {
    total: number;
    doctors: number;
    patients: number;
    admins: number;
    active: number;
    inactive: number;
  };
  appointments: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  financial: {
    totalRevenue: number;
    totalCommission: number;
    pendingPayments: number;
    completedPayments: number;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user?: string;
  }>;
}

export const adminService = {
  async login(email: string, password: string): Promise<{ success: boolean; token?: string; user?: User; message?: string }> {
    try {
      const response = await api.post('/admin/login', { email, password });
      return response.data;
    } catch (error: any) {
      console.error('Erreur login admin:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  },

  async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération stats:', error);
      throw error;
    }
  },

  async getAllUsers(): Promise<{ success: boolean; data: User[] }> {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error);
      throw error;
    }
  },

  async getUserById(userId: string): Promise<{ success: boolean; data: User }> {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      throw error;
    }
  },

  async createUser(userData: Partial<User>): Promise<{ success: boolean; data: User }> {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<{ success: boolean; data: User }> {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
      throw error;
    }
  },

  async toggleUserStatus(userId: string): Promise<{ success: boolean; data: User }> {
    try {
      const response = await api.patch(`/admin/users/${userId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Erreur changement statut:', error);
      throw error;
    }
  },

  async getAllAppointments(): Promise<{ success: boolean; data: Appointment[] }> {
    try {
      const response = await api.get('/admin/appointments');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération rendez-vous:', error);
      throw error;
    }
  },

  async getFinancialReport(startDate?: string, endDate?: string): Promise<{ success: boolean; data: any }> {
    try {
      const response = await api.get('/admin/financial-report', { params: { startDate, endDate } });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération rapport financier:', error);
      throw error;
    }
  }
};
