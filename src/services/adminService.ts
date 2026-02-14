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
  // Champs supplémentaires utiles pour l'affichage
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  licenseNumber?: string;
  biography?: string;
  languages?: string[];
  consultationPrice?: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  status: string;
  type: string;
  patient?: { firstName: string; lastName: string; id?: string };
  doctor?: { firstName: string; lastName: string; id?: string; specialty?: string };
}

export interface DashboardStats {
  users: {
    total: number;
    doctors: number;
    patients: number;
    admins: number;
    active: number;
    inactive: number;
    recent?: Array<{ id: string; firstName: string; lastName: string; email: string; role: string; createdAt: string }>;
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
    status?: string;
  }>;
}

export const adminService = {
  /**
   * Connexion admin (si vous avez une route dédiée)
   */
  async login(email: string, password: string): Promise<{ success: boolean; token?: string; user?: User; message?: string }> {
    try {
      const response = await api.post('/admin/login', { email, password });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur login admin:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  },

  /**
   * ✅ Récupérer les statistiques du dashboard admin
   * CORRECTION: Utilisation de '/admin/dashboard' au lieu de '/admin/dashboard/stats'
   */
  async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
    try {
      console.log('📊 Récupération des statistiques dashboard admin...');
      // ✅ URL corrigée
      const response = await api.get('/admin/dashboard');
      console.log('✅ Statistiques récupérées:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur récupération stats:', error);
      throw error;
    }
  },

  /**
   * ✅ Récupérer tous les utilisateurs (avec filtres optionnels)
   */
  async getAllUsers(params?: {
    role?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: User[]; pagination?: any }> {
    try {
      console.log('👥 Récupération des utilisateurs avec filtres:', params);
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur récupération utilisateurs:', error);
      throw error;
    }
  },

  /**
   * ✅ Récupérer tous les médecins
   */
  async getAllDoctors(params?: {
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: User[]; pagination?: any }> {
    return this.getAllUsers({ ...params, role: 'doctor' });
  },

  /**
   * ✅ Récupérer tous les patients
   */
  async getAllPatients(params?: {
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: User[]; pagination?: any }> {
    return this.getAllUsers({ ...params, role: 'patient' });
  },

  /**
   * ✅ Récupérer un utilisateur par son ID
   */
  async getUserById(userId: string): Promise<{ success: boolean; data: User }> {
    try {
      console.log(`👤 Récupération de l'utilisateur ${userId}...`);
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur récupération utilisateur ${userId}:`, error);
      throw error;
    }
  },

  /**
   * ✅ Créer un nouvel utilisateur
   */
  async createUser(userData: Partial<User> & { password: string }): Promise<{ success: boolean; data: User; message?: string }> {
    try {
      console.log('📝 Création d\'un nouvel utilisateur:', userData.email);
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur création utilisateur:', error);
      throw error;
    }
  },

  /**
   * ✅ Mettre à jour un utilisateur
   */
  async updateUser(userId: string, userData: Partial<User> & { password?: string }): Promise<{ success: boolean; data: User; message?: string }> {
    try {
      console.log(`📝 Mise à jour de l'utilisateur ${userId}...`);
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur mise à jour utilisateur ${userId}:`, error);
      throw error;
    }
  },

  /**
   * ✅ Supprimer un utilisateur
   */
  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🗑️ Suppression de l'utilisateur ${userId}...`);
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur suppression utilisateur ${userId}:`, error);
      throw error;
    }
  },

  /**
   * ✅ Activer/désactiver un utilisateur
   */
  async toggleUserStatus(userId: string): Promise<{ success: boolean; data: User; message: string }> {
    try {
      console.log(`🔄 Changement de statut de l'utilisateur ${userId}...`);
      const response = await api.patch(`/admin/users/${userId}/toggle-status`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur changement statut utilisateur ${userId}:`, error);
      throw error;
    }
  },

  /**
   * ✅ Récupérer tous les rendez-vous
   */
  async getAllAppointments(params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    doctorId?: string;
    patientId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: Appointment[]; pagination?: any }> {
    try {
      console.log('📋 Récupération de tous les rendez-vous...');
      const response = await api.get('/admin/appointments', { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur récupération rendez-vous:', error);
      throw error;
    }
  },

  /**
   * ✅ Récupérer un rendez-vous par son ID
   */
  async getAppointmentById(appointmentId: string): Promise<{ success: boolean; data: Appointment }> {
    try {
      console.log(`📋 Récupération du rendez-vous ${appointmentId}...`);
      const response = await api.get(`/admin/appointments/${appointmentId}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur récupération rendez-vous ${appointmentId}:`, error);
      throw error;
    }
  },

  /**
   * ✅ Supprimer un rendez-vous
   */
  async deleteAppointment(appointmentId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🗑️ Suppression du rendez-vous ${appointmentId}...`);
      const response = await api.delete(`/admin/appointments/${appointmentId}`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur suppression rendez-vous ${appointmentId}:`, error);
      throw error;
    }
  },

  /**
   * ✅ Récupérer les rapports financiers
   */
  async getFinancialReports(params?: {
    startDate?: string;
    endDate?: string;
    doctorId?: string;
  }): Promise<{ success: boolean; data: any }> {
    try {
      console.log('💰 Récupération des rapports financiers...');
      const response = await api.get('/admin/financial/reports', { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur récupération rapport financier:', error);
      throw error;
    }
  },

  /**
   * ✅ Récupérer les statistiques financières par médecin
   */
  async getDoctorFinancialStats(): Promise<{ success: boolean; data: any }> {
    try {
      console.log('📊 Récupération des statistiques financières par médecin...');
      const response = await api.get('/admin/financial/doctor-stats');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur récupération stats financières par médecin:', error);
      throw error;
    }
  },

  /**
   * ✅ Récupérer les logs d'audit
   */
  async getAuditLogs(params?: {
    action?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: any[]; pagination?: any }> {
    try {
      console.log('📋 Récupération des logs d\'audit...');
      const response = await api.get('/admin/audit-logs', { params });
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur récupération logs d\'audit:', error);
      throw error;
    }
  },

  /**
   * ✅ Récupérer les logs d'audit pour un utilisateur spécifique
   */
  async getUserAuditLogs(userId: string, params?: { page?: number; limit?: number }): Promise<{ success: boolean; data: any[]; pagination?: any }> {
    try {
      console.log(`📋 Récupération des logs d'audit pour l'utilisateur ${userId}...`);
      const response = await api.get(`/admin/audit-logs/user/${userId}`, { params });
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur récupération logs d'audit pour l'utilisateur ${userId}:`, error);
      throw error;
    }
  }
};
