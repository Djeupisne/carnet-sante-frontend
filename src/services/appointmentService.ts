import api from './api'
import { Appointment, CreateAppointmentData, Doctor, AppointmentSlot } from '../types/appointment'

export const appointmentService = {
  // Récupérer tous les rendez-vous de l'utilisateur
  async getAppointments(): Promise<Appointment[]> {
    try {
      console.log('📋 Appel API pour les rendez-vous...')
      const response = await api.get('/appointments')
      console.log('📋 Réponse complète des rendez-vous:', response)
      
      // Votre API retourne { success: true, data: [], count: number }
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const appointments = response.data.data
        console.log('✅ Rendez-vous extraits:', appointments.length)
        return appointments
      } else {
        console.warn('⚠️ Format de réponse inattendu pour les rendez-vous:', response.data)
        return []
      }
    } catch (error) {
      console.error('❌ Erreur getAppointments:', error)
      return []
    }
  },

  // Récupérer la liste des médecins
  async getDoctors(): Promise<Doctor[]> {
    try {
      console.log('👨‍⚕️ Appel API pour les médecins...')
      const response = await api.get('/doctors')
      console.log('👨‍⚕️ Réponse médecins:', response)
      
      // Votre API retourne { success: true, data: [], count: number }
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const doctors = response.data.data
        console.log('✅ Médecins extraits:', doctors.length)
        return doctors
      } else {
        console.warn('⚠️ Format de réponse inattendu pour les médecins:', response.data)
        return []
      }
    } catch (error) {
      console.error('❌ Erreur getDoctors:', error)
      return []
    }
  },

  // ... autres méthodes restent inchangées
  async getAppointment(id: string): Promise<Appointment> {
    try {
      const response = await api.get(`/appointments/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Erreur getAppointment:', error)
      throw error
    }
  },

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
      return response.data.data
    } catch (error) {
      console.error('Erreur createAppointment:', error)
      throw error
    }
  },

  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    try {
      const response = await api.patch(`/appointments/${id}/cancel`, { cancellationReason: reason })
      return response.data.data
    } catch (error) {
      console.error('Erreur cancelAppointment:', error)
      throw error
    }
  },

  async confirmAppointment(id: string): Promise<Appointment> {
    try {
      const response = await api.patch(`/appointments/${id}/confirm`)
      return response.data.data
    } catch (error) {
      console.error('Erreur confirmAppointment:', error)
      throw error
    }
  },

  async getDoctorAvailability(doctorId: string, date: string): Promise<AppointmentSlot[]> {
    try {
      const response = await api.get(`/doctors/${doctorId}/availability?date=${date}`)
      return response.data.data || []
    } catch (error) {
      console.error('Erreur getDoctorAvailability:', error)
      return []
    }
  },

  async rateAppointment(id: string, rating: number, feedback?: string): Promise<Appointment> {
    try {
      const response = await api.patch(`/appointments/${id}/rate`, { rating, feedback })
      return response.data.data
    } catch (error) {
      console.error('Erreur rateAppointment:', error)
      throw error
    }
  }
}