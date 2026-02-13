import api from './api'

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  appointmentDate: string
  duration: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  type: 'in_person' | 'teleconsultation' | 'home_visit'
  reason?: string
  notes?: string
}

export interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty: string
  isActive: boolean
  availableSlots?: string[]
  bookedSlots?: string[]
  consultationPrice?: number
}

export interface CreateAppointmentData {
  doctorId: string
  appointmentDate: string
  duration?: number
  type?: 'in_person' | 'teleconsultation' | 'home_visit'
  reason?: string
  notes?: string
}

export const appointmentService = {
  /**
   * ✅ Créer un nouveau rendez-vous
   */
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    try {
      console.log('📅 Création d\'un rendez-vous:', data)
      const response = await api.post('/appointments', data)
      
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Erreur lors de la création du rendez-vous')
      }
      
      console.log('✅ Rendez-vous créé:', response.data.data)
      return response.data.data.appointment
    } catch (error: any) {
      console.error('❌ Erreur création rendez-vous:', error)
      throw error
    }
  },

  /**
   * ✅ Récupérer tous les rendez-vous de l'utilisateur connecté
   */
  async getAppointments(): Promise<Appointment[]> {
    try {
      console.log('📋 Récupération des rendez-vous...')
      const response = await api.get('/appointments')
      
      if (!response.data?.success) {
        throw new Error('Erreur lors de la récupération des rendez-vous')
      }
      
      const appointments = response.data.data?.appointments || []
      console.log('✅ Rendez-vous récupérés:', appointments.length)
      return appointments
    } catch (error: any) {
      console.error('❌ Erreur récupération rendez-vous:', error)
      return []
    }
  },

  /**
   * ✅ Récupérer un rendez-vous par ID
   */
  async getAppointmentById(id: string): Promise<Appointment> {
    try {
      console.log('📋 Récupération du rendez-vous:', id)
      const response = await api.get(`/appointments/${id}`)
      
      if (!response.data?.success) {
        throw new Error('Rendez-vous introuvable')
      }
      
      return response.data.data.appointment
    } catch (error: any) {
      console.error('❌ Erreur récupération rendez-vous:', error)
      throw error
    }
  },

  /**
   * ✅ Récupérer les créneaux disponibles d'un médecin pour une date donnée
   * ✅ CORRIGÉ: Utilise /calendars/ au lieu de /appointments/
   */
  async getDoctorAvailableSlots(doctorId: string, date: string): Promise<string[]> {
    try {
      console.log('🕐 Récupération des créneaux disponibles:', { doctorId, date })
      
      // ✅ URL CORRECTE - Utilise le service Calendar
      const response = await api.get(`/calendars/available-slots/${doctorId}`, {
        params: { date }
      })
      
      if (!response.data?.success) {
        throw new Error('Erreur lors de la récupération des créneaux')
      }
      
      const availableSlots = response.data.data?.availableSlots || []
      console.log('✅ Créneaux disponibles:', availableSlots)
      return availableSlots
    } catch (error: any) {
      console.error('❌ Erreur récupération créneaux:', error)
      
      // ✅ Créneaux par défaut en cas d'erreur
      const defaultSlots = [
        '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
      ]
      console.log('⚠️ Utilisation des créneaux par défaut:', defaultSlots)
      return defaultSlots
    }
  },

  /**
   * ✅ Récupérer les créneaux occupés d'un médecin pour une date donnée
   * ✅ CORRIGÉ: Utilise /calendars/ au lieu de /appointments/
   */
  async getDoctorBookedSlots(doctorId: string, date: string): Promise<string[]> {
    try {
      console.log('🚫 Récupération des créneaux occupés:', { doctorId, date })
      
      // ✅ URL CORRECTE - Utilise le service Calendar
      const response = await api.get(`/calendars/booked-slots/${doctorId}`, {
        params: { date }
      })
      
      if (!response.data?.success) {
        throw new Error('Erreur lors de la récupération des créneaux occupés')
      }
      
      const bookedSlots = response.data.data?.bookedSlots || []
      console.log('✅ Créneaux occupés:', bookedSlots)
      return bookedSlots
    } catch (error: any) {
      console.error('❌ Erreur récupération créneaux occupés:', error)
      return []
    }
  },

  /**
   * ✅ Récupérer la liste des médecins
   */
  async getDoctors(): Promise<Doctor[]> {
    try {
      console.log('👨‍⚕️ Récupération des médecins...')
      const response = await api.get('/doctors')
      
      if (!response.data?.success) {
        throw new Error('Erreur lors de la récupération des médecins')
      }
      
      const doctors = response.data.data?.doctors || response.data.data || []
      console.log('✅ Médecins récupérés:', doctors.length)
      return doctors
    } catch (error: any) {
      console.error('❌ Erreur récupération médecins:', error)
      return []
    }
  },

  /**
   * ✅ Annuler un rendez-vous
   */
  async cancelAppointment(id: string, reason?: string): Promise<void> {
    try {
      console.log('🚫 Annulation du rendez-vous:', id)
      const response = await api.patch(`/appointments/${id}/cancel`, { reason })
      
      if (!response.data?.success) {
        throw new Error('Erreur lors de l\'annulation du rendez-vous')
      }
      
      console.log('✅ Rendez-vous annulé')
    } catch (error: any) {
      console.error('❌ Erreur annulation rendez-vous:', error)
      throw error
    }
  },

  /**
   * ✅ Confirmer un rendez-vous (pour les médecins)
   */
  async confirmAppointment(id: string): Promise<void> {
    try {
      console.log('✅ Confirmation du rendez-vous:', id)
      const response = await api.patch(`/appointments/${id}/confirm`)
      
      if (!response.data?.success) {
        throw new Error('Erreur lors de la confirmation du rendez-vous')
      }
      
      console.log('✅ Rendez-vous confirmé')
    } catch (error: any) {
      console.error('❌ Erreur confirmation rendez-vous:', error)
      throw error
    }
  },

  /**
   * ✅ Marquer un rendez-vous comme terminé
   */
  async completeAppointment(id: string, notes?: string): Promise<void> {
    try {
      console.log('✓ Marquage rendez-vous comme terminé:', id)
      const response = await api.patch(`/appointments/${id}/complete`, { notes })
      
      if (!response.data?.success) {
        throw new Error('Erreur lors de la finalisation du rendez-vous')
      }
      
      console.log('✅ Rendez-vous marqué comme terminé')
    } catch (error: any) {
      console.error('❌ Erreur finalisation rendez-vous:', error)
      throw error
    }
  }
}
