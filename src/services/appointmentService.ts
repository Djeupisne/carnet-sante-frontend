// src/services/appointmentService.ts - CORRIGÉ
import api from './api'
import { Appointment, CreateAppointmentData, Doctor, AppointmentSlot } from '../types/appointment'

export const appointmentService = {
  // Récupérer tous les rendez-vous de l'utilisateur
  async getAppointments(): Promise<Appointment[]> {
    try {
      console.log('📋 Appel API pour les rendez-vous...')
      const response = await api.get('/appointments')
      console.log('📋 Réponse complète des rendez-vous:', response)
      
      // Gestion flexible des différents formats de réponse
      let appointmentsData: any[] = []
      
      if (Array.isArray(response.data)) {
        // Format 1: Le tableau est directement dans response.data
        appointmentsData = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        // Format 2: Le tableau est dans response.data.data
        appointmentsData = response.data.data
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Format 3: Le tableau est dans response.data.data avec un flag success
        appointmentsData = response.data.data
      } else if (response.data && Array.isArray(response.data.appointments)) {
        // Format 4: Le tableau est dans response.data.appointments
        appointmentsData = response.data.appointments
      } else {
        console.warn('⚠️ Format de réponse inattendu pour les rendez-vous:', response.data)
        return []
      }
      
      console.log('✅ Rendez-vous extraits:', appointmentsData)
      return appointmentsData
    } catch (error) {
      console.error('❌ Erreur getAppointments:', error)
      return [] // Retourner un tableau vide en cas d'erreur
    }
  },

  // Récupérer un rendez-vous spécifique
  async getAppointment(id: string): Promise<Appointment> {
    try {
      const response = await api.get(`/appointments/${id}`)
      return response.data.data || response.data
    } catch (error) {
      console.error('Erreur getAppointment:', error)
      throw error
    }
  },

  // Créer un nouveau rendez-vous
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    try {
      const appointmentData = {
        doctorId: data.doctorId,
        appointmentDate: new Date(`${data.date}T${data.startTime}`).toISOString(),
        duration: 30,
        type: data.type === 'teleconsultation' ? 'teleconsultation' : 'in_person',
        reason: data.reason,
        status: 'pending'
      }

      const response = await api.post('/appointments', appointmentData)
      return response.data.data || response.data
    } catch (error) {
      console.error('Erreur createAppointment:', error)
      throw error
    }
  },

  // Annuler un rendez-vous
  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    try {
      const response = await api.patch(`/appointments/${id}/cancel`, { cancellationReason: reason })
      return response.data.data || response.data
    } catch (error) {
      console.error('Erreur cancelAppointment:', error)
      throw error
    }
  },

  // Confirmer un rendez-vous
  async confirmAppointment(id: string): Promise<Appointment> {
    try {
      const response = await api.patch(`/appointments/${id}/confirm`)
      return response.data.data || response.data
    } catch (error) {
      console.error('Erreur confirmAppointment:', error)
      throw error
    }
  },

  // Récupérer la liste des médecins
  async getDoctors(): Promise<Doctor[]> {
    try {
      console.log('👨‍⚕️ Appel API pour les médecins...')
      const response = await api.get('/doctors')
      console.log('👨‍⚕️ Réponse médecins:', response)
      
      // Même logique de gestion flexible
      let doctorsData: any[] = []
      
      if (Array.isArray(response.data)) {
        doctorsData = response.data
      } else if (response.data && Array.isArray(response.data.data)) {
        doctorsData = response.data.data
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        doctorsData = response.data.data
      } else {
        console.warn('⚠️ Format de réponse inattendu pour les médecins:', response.data)
        return []
      }
      
      console.log('✅ Médecins extraits:', doctorsData)
      return doctorsData
    } catch (error) {
      console.error('❌ Erreur getDoctors:', error)
      return [] // Retourner un tableau vide en cas d'erreur
    }
  },

  // Récupérer les créneaux disponibles d'un médecin
  async getDoctorAvailability(doctorId: string, date: string): Promise<AppointmentSlot[]> {
    try {
      const response = await api.get(`/doctors/${doctorId}/availability?date=${date}`)
      return response.data.data || response.data || []
    } catch (error) {
      console.error('Erreur getDoctorAvailability:', error)
      return []
    }
  },

  // Noter un rendez-vous
  async rateAppointment(id: string, rating: number, feedback?: string): Promise<Appointment> {
    try {
      const response = await api.patch(`/appointments/${id}/rate`, { rating, feedback })
      return response.data.data || response.data
    } catch (error) {
      console.error('Erreur rateAppointment:', error)
      throw error
    }
  }
}