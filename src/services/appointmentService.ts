import api from './api'
import { Appointment, CreateAppointmentData, Doctor, AppointmentSlot } from '../types/appointment'

export const appointmentService = {
  // Récupérer tous les rendez-vous de l'utilisateur
  async getAppointments(): Promise<Appointment[]> {
    const response = await api.get('/appointments')
    return response.data.data
  },

  // Récupérer un rendez-vous spécifique
  async getAppointment(id: string): Promise<Appointment> {
    const response = await api.get(`/appointments/${id}`)
    return response.data.data
  },

  // Créer un nouveau rendez-vous
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    // Adapter les données au format de votre base
    const appointmentData = {
      doctorId: data.doctorId,
      appointmentDate: new Date(`${data.date}T${data.startTime}`).toISOString(),
      duration: 30, // 30 minutes par défaut
      type: data.type === 'teleconsultation' ? 'teleconsultation' : 'in_person',
      reason: data.reason,
      status: 'pending'
    }

    const response = await api.post('/appointments', appointmentData)
    return response.data.data
  },

  // Annuler un rendez-vous
  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    const response = await api.patch(`/appointments/${id}/cancel`, { cancellationReason: reason })
    return response.data.data
  },

  // Confirmer un rendez-vous
  async confirmAppointment(id: string): Promise<Appointment> {
    const response = await api.patch(`/appointments/${id}/confirm`)
    return response.data.data
  },

  // Récupérer la liste des médecins
  async getDoctors(): Promise<Doctor[]> {
    const response = await api.get('/doctors')
    return response.data.data
  },

  // Récupérer les créneaux disponibles d'un médecin
  async getDoctorAvailability(doctorId: string, date: string): Promise<AppointmentSlot[]> {
    const response = await api.get(`/doctors/${doctorId}/availability?date=${date}`)
    return response.data.data
  },

  // Noter un rendez-vous
  async rateAppointment(id: string, rating: number, feedback?: string): Promise<Appointment> {
    const response = await api.patch(`/appointments/${id}/rate`, { rating, feedback })
    return response.data.data
  }
}