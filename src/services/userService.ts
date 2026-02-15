/** ============================================
 * src/services/userService.ts - CORRIGÉ COMPLET
 * ============================================ */
import api from '../types/api'
import { User } from '../types'

// Interface locale pour la réponse paginée
interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Interface pour les préférences utilisateur
export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export const userService = {
  async getProfile(): Promise<{ success: boolean; data: { user: User } }> {
    try {
      const response = await api.get('/profile')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      throw error
    }
  },

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; data: { user: User } }> {
    try {
      const response = await api.put('/profile', data)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      throw error
    }
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.patch('/profile/change-password', {
        currentPassword,
        newPassword,
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      throw error
    }
  },

  async getDashboardStats(): Promise<{ success: boolean; data: { stats: any } }> {
    try {
      const response = await api.get('/profile/dashboard')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  },

  async searchDoctors(params: {
    specialty?: string
    city?: string
    availability?: string
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: PaginatedResponse<User> }> {
    try {
      const response = await api.get('/search/doctors', { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la recherche de médecins:', error)
      throw error
    }
  },

  async getAllDoctors(): Promise<{ success: boolean; data: User[] }> {
    try {
      console.log('🔍 Appel à l\'API pour récupérer les médecins...')
      const response = await api.get('/users', { params: { role: 'doctor' } })
      console.log('✅ Réponse de l\'API pour les médecins:', response.data)
      
      if (Array.isArray(response.data)) {
        return { success: true, data: response.data }
      }
      
      return response.data
    } catch (error: any) {
      console.error('❌ Erreur dans getAllDoctors:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des médecins')
    }
  },

  async getAllPatients(): Promise<{ success: boolean; data: User[] }> {
    try {
      console.log('🔍 Appel à l\'API pour récupérer les patients...')
      const response = await api.get('/users', { params: { role: 'patient' } })
      console.log('✅ Réponse de l\'API pour les patients:', response.data)
      
      if (Array.isArray(response.data)) {
        return { success: true, data: response.data }
      }
      
      return response.data
    } catch (error: any) {
      console.error('❌ Erreur dans getAllPatients:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des patients')
    }
  },

  async updateUser(
    userId: string,
    data: { isActive?: boolean }
  ): Promise<{ success: boolean; data: User }> {
    try {
      console.log(`🔄 Mise à jour de l'utilisateur ${userId} avec:`, data)
      const response = await api.put(`/users/${userId}`, data)
      console.log('✅ Réponse de l\'API pour la mise à jour:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Erreur dans updateUser:', error.response?.data || error.message)
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur'
      )
    }
  },

  // ✅ Récupérer un utilisateur par son ID
  async getUserById(userId: string): Promise<User> {
    try {
      console.log(`👤 Récupération de l'utilisateur ${userId}...`);
      const response = await api.get(`/users/${userId}`);
      
      console.log('✅ Réponse getUserById:', response.data);
      
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      } else if (response.data && response.data.id) {
        return response.data;
      }
      
      throw new Error('Format de réponse invalide');
    } catch (error: any) {
      console.error(`❌ Erreur dans getUserById pour ${userId}:`, error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la récupération de l\'utilisateur'
      );
    }
  },

  // ✅ Récupérer plusieurs utilisateurs par leurs IDs
  async getUsersByIds(userIds: string[]): Promise<User[]> {
    try {
      console.log(`👥 Récupération de ${userIds.length} utilisateurs...`);
      
      const response = await api.post('/users/batch', { userIds });
      
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      
      const users: User[] = [];
      for (const id of userIds) {
        try {
          const user = await this.getUserById(id);
          users.push(user);
        } catch (error) {
          console.warn(`⚠️ Impossible de récupérer l'utilisateur ${id}`);
        }
      }
      
      return users;
    } catch (error: any) {
      console.error('❌ Erreur dans getUsersByIds:', error.response?.data || error.message);
      
      const users: User[] = [];
      for (const id of userIds) {
        try {
          const user = await this.getUserById(id);
          users.push(user);
        } catch (error) {
          // Ignorer les erreurs individuelles
        }
      }
      
      return users;
    }
  },

  // ✅ NOUVELLE MÉTHODE: Mettre à jour les préférences utilisateur
  async updatePreferences(preferences: UserPreferences): Promise<{ success: boolean; data: User }> {
    try {
      console.log('⚙️ Mise à jour des préférences utilisateur...');
      const response = await api.patch('/profile/preferences', { preferences });
      console.log('✅ Préférences mises à jour:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur dans updatePreferences:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la mise à jour des préférences'
      );
    }
  },

  // ✅ NOUVELLE MÉTHODE: Récupérer les préférences utilisateur
  async getPreferences(): Promise<{ success: boolean; data: UserPreferences }> {
    try {
      console.log('⚙️ Récupération des préférences utilisateur...');
      const response = await api.get('/profile/preferences');
      console.log('✅ Préférences récupérées:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur dans getPreferences:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la récupération des préférences'
      );
    }
  },

  // ✅ NOUVELLE MÉTHODE: Mettre à jour la photo de profil
  async updateProfilePicture(formData: FormData): Promise<{ success: boolean; data: { profilePicture: string } }> {
    try {
      console.log('📸 Mise à jour de la photo de profil...');
      const response = await api.post('/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Photo de profil mise à jour:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur dans updateProfilePicture:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la mise à jour de la photo'
      );
    }
  },

  // ✅ NOUVELLE MÉTHODE: Supprimer la photo de profil
  async deleteProfilePicture(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🗑️ Suppression de la photo de profil...');
      const response = await api.delete('/profile/picture');
      console.log('✅ Photo de profil supprimée:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur dans deleteProfilePicture:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la suppression de la photo'
      );
    }
  },

  // ✅ NOUVELLE MÉTHODE: Récupérer les informations de contact d'urgence
  async getEmergencyContact(): Promise<{ success: boolean; data: any }> {
    try {
      console.log('📞 Récupération du contact d\'urgence...');
      const response = await api.get('/profile/emergency-contact');
      console.log('✅ Contact d\'urgence récupéré:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur dans getEmergencyContact:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la récupération du contact d\'urgence'
      );
    }
  },

  // ✅ NOUVELLE MÉTHODE: Mettre à jour le contact d'urgence
  async updateEmergencyContact(data: {
    name: string;
    phone: string;
    relationship: string;
  }): Promise<{ success: boolean; data: User }> {
    try {
      console.log('📞 Mise à jour du contact d\'urgence...');
      const response = await api.put('/profile/emergency-contact', data);
      console.log('✅ Contact d\'urgence mis à jour:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur dans updateEmergencyContact:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la mise à jour du contact d\'urgence'
      );
    }
  },

  // ✅ NOUVELLE MÉTHODE: Récupérer l'historique des connexions
  async getLoginHistory(): Promise<{ success: boolean; data: any[] }> {
    try {
      console.log('📊 Récupération de l\'historique des connexions...');
      const response = await api.get('/profile/login-history');
      console.log('✅ Historique des connexions récupéré:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur dans getLoginHistory:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la récupération de l\'historique'
      );
    }
  },

  // ✅ NOUVELLE MÉTHODE: Désactiver le compte
  async deactivateAccount(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('⚠️ Désactivation du compte...');
      const response = await api.post('/profile/deactivate');
      console.log('✅ Compte désactivé:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur dans deactivateAccount:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la désactivation du compte'
      );
    }
  },

  // ✅ NOUVELLE MÉTHODE: Exporter les données personnelles
  async exportPersonalData(): Promise<Blob> {
    try {
      console.log('📦 Export des données personnelles...');
      const response = await api.get('/profile/export-data', {
        responseType: 'blob'
      });
      console.log('✅ Données exportées');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur dans exportPersonalData:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Erreur lors de l\'export des données'
      );
    }
  }
}
