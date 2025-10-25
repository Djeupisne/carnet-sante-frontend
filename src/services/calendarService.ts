// ============================================
// 4. src/services/calendarService.ts - CORRIGÉ
// ============================================

import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

// Interface pour la structure d'un calendrier
interface Calendar {
  id: string
  date: string // Format ISO, ex: "2025-10-17"
  slots: string[] // Liste des créneaux horaires, ex: ["09:00", "10:00"]
  confirmed: boolean
  doctor?: { firstName: string; lastName: string; id: string }
}

// Configuration d'axios avec l'intercepteur pour ajouter le token d'authentification
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token d'authentification à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`📤 Calendar API: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Erreur intercepteur calendrier:', error)
    return Promise.reject(error)
  }
)

// Intercepteur de réponse
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ Erreur réponse calendrier:', error.message)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const calendarService = {
  // Récupérer les calendriers d'un médecin connecté
  getDoctorCalendars: async (): Promise<{ success: boolean; data: Calendar[] }> => {
    try {
      const response = await axiosInstance.get('/calendars')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des calendriers du médecin:', error)
      throw error
    }
  },

  // Récupérer tous les calendriers (pour l'administrateur)
  getAllCalendars: async (): Promise<{ success: boolean; data: Calendar[] }> => {
    try {
      const response = await axiosInstance.get('/calendars/all')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les calendriers:', error)
      throw error
    }
  },

  // Récupérer les calendriers des médecins associés à un patient
  getPatientCalendars: async (patientId: string): Promise<{ success: boolean; data: Calendar[] }> => {
    try {
      const response = await axiosInstance.get(`/calendars/patient/${patientId}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des calendriers du patient:', error)
      throw error
    }
  },

  // Créer un nouveau calendrier
  createCalendar: async (calendar: {
    date: string
    slots: string[]
  }): Promise<{ success: boolean; data: Calendar }> => {
    try {
      const response = await axiosInstance.post('/calendars', {
        ...calendar,
        confirmed: false,
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création du calendrier:', error)
      throw error
    }
  },

  // Mettre à jour un calendrier existant
  updateCalendar: async (
    calendarId: string,
    calendar: Calendar
  ): Promise<{ success: boolean; data: Calendar }> => {
    try {
      const response = await axiosInstance.put(`/calendars/${calendarId}`, calendar)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du calendrier:', error)
      throw error
    }
  },

  // Supprimer un calendrier
  deleteCalendar: async (calendarId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/calendars/${calendarId}`)
    } catch (error) {
      console.error('Erreur lors de la suppression du calendrier:', error)
      throw error
    }
  },

  // Confirmer un calendrier
  confirmCalendar: async (calendarId: string): Promise<void> => {
    try {
      await axiosInstance.post(`/calendars/${calendarId}/confirm`)
    } catch (error) {
      console.error('Erreur lors de la confirmation du calendrier:', error)
      throw error
    }
  },

  // Enregistrer une version du calendrier
  saveCalendarVersion: async (calendar: Calendar): Promise<void> => {
    try {
      await axiosInstance.post(`/calendars/${calendar.id}/version`, calendar)
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la version du calendrier:', error)
      throw error
    }
  },

  // Notifier les patients des modifications du calendrier
  notifyPatients: async (calendar: Calendar): Promise<void> => {
    try {
      await axiosInstance.post(`/calendars/${calendar.id}/notify`, calendar)
    } catch (error) {
      console.error('Erreur lors de la notification des patients:', error)
      throw error
    }
  },
}