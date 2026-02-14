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
  // Champs supplémentaires pour l'affichage détaillé
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  licenseNumber?: string;
  biography?: string;
  languages?: string[];
  consultationPrice?: number;
  address?: string;
  city?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  type: 'in_person' | 'teleconsultation' | 'home_visit';
  reason: string;
  symptoms?: any;
  notes?: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    specialty?: string;
  };
  payment?: {
    id: string;
    amount: number;
    status: string;
    paymentMethod?: string;
    transactionId?: string;
  };
}

export interface DashboardStats {
  users: {
    total: number;
    doctors: number;
    patients: number;
    admins: number;
    active: number;
    inactive: number;
    recent?: Array<{ 
      id: string; 
      firstName: string; 
      lastName: string; 
      email: string; 
      role: string; 
      createdAt: string 
    }>;
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

export interface FinancialSummary {
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  pendingPayments: number;
  completedPayments: number;
}

export interface DoctorFinancialStat {
  doctorId: string;
  doctorName: string;
  specialty: string;
  totalRevenue: number;
  commission: number;
  netRevenue: number;
  totalAppointments: number;
  completedAppointments: number;
  averagePerAppointment: number;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  appointment?: {
    id: string;
    appointmentDate: string;
    doctor?: {
      id: string;
      firstName: string;
      lastName: string;
    };
    patient?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userRole?: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  status: 'success' | 'failure';
  errorMessage?: string;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export const adminService = {
  /**
   * Connexion admin (route dédiée)
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
   */
  async getDashboardStats(): Promise<{ success: boolean; data: DashboardStats }> {
    try {
      console.log('📊 Récupération des statistiques dashboard admin...');
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
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
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
   * ✅ Mettre à jour le statut d'un rendez-vous
   */
  async updateAppointmentStatus(appointmentId: string, status: string): Promise<{ success: boolean; data: Appointment; message?: string }> {
    try {
      console.log(`🔄 Mise à jour du statut du rendez-vous ${appointmentId} vers ${status}...`);
      const response = await api.patch(`/admin/appointments/${appointmentId}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur mise à jour statut rendez-vous ${appointmentId}:`, error);
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
  async getDoctorFinancialStats(): Promise<{ success: boolean; data: DoctorFinancialStat[] }> {
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
  }): Promise<{ success: boolean; data: AuditLog[]; pagination?: any }> {
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
  async getUserAuditLogs(userId: string, params?: { page?: number; limit?: number }): Promise<{ success: boolean; data: AuditLog[]; pagination?: any }> {
    try {
      console.log(`📋 Récupération des logs d'audit pour l'utilisateur ${userId}...`);
      const response = await api.get(`/admin/audit-logs/user/${userId}`, { params });
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur récupération logs d'audit pour l'utilisateur ${userId}:`, error);
      throw error;
    }
  },

  /**
   * ✅ Récupérer les statistiques des calendriers
   */
  async getCalendarStats(): Promise<{ success: boolean; data: any }> {
    try {
      console.log('📅 Récupération des statistiques des calendriers...');
      const response = await api.get('/admin/calendars/stats');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur récupération stats calendriers:', error);
      throw error;
    }
  },

  /**
   * ✅ Exporter les données au format CSV
   */
  async exportData(type: 'users' | 'appointments' | 'financial', params?: any): Promise<Blob> {
    try {
      console.log(`📥 Export des données ${type}...`);
      const response = await api.get(`/admin/export/${type}`, { 
        params, 
        responseType: 'blob' 
      });
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur export ${type}:`, error);
      throw error;
    }
  }
};
