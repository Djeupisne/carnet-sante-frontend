/** ============================================
 * src/services/userService.ts - CORRIGÉ
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

  // ✅ NOUVELLE MÉTHODE: Récupérer un utilisateur par son ID
  async getUserById(userId: string): Promise<User> {
    try {
      console.log(`👤 Récupération de l'utilisateur ${userId}...`);
      const response = await api.get(`/users/${userId}`);
      
      console.log('✅ Réponse getUserById:', response.data);
      
      // La réponse peut être directement l'utilisateur ou { success, data }
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

  // ✅ OPTIONNEL: Récupérer plusieurs utilisateurs par leurs IDs
  async getUsersByIds(userIds: string[]): Promise<User[]> {
    try {
      console.log(`👥 Récupération de ${userIds.length} utilisateurs...`);
      
      // Si votre backend supporte une requête batch
      const response = await api.post('/users/batch', { userIds });
      
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      
      // Fallback: récupérer un par un (moins efficace)
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
      
      // Fallback en cas d'erreur
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
}
