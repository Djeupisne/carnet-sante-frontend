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
      
      // La réponse backend renvoie directement un tableau
      // Normaliser la réponse pour toujours avoir { success, data }
      if (Array.isArray(response.data)) {
        return { success: true, data: response.data }
      }
      
      // Si c'est déjà dans le bon format
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
      
      // La réponse backend renvoie directement un tableau
      // Normaliser la réponse pour toujours avoir { success, data }
      if (Array.isArray(response.data)) {
        return { success: true, data: response.data }
      }
      
      // Si c'est déjà dans le bon format
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
}
