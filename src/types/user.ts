// Utilisateur générique
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'patient' | 'doctor' | 'admin'
  phoneNumber?: string
  dateOfBirth?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  profilePicture?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Médecin
export interface Doctor extends User {
  specialization: string
  licenseNumber: string
  experience: number
  qualifications: string[]
  consultationFee: number
  availability: DoctorAvailability[]
  rating?: number
  totalReviews?: number
}

// Disponibilité du médecin
export interface DoctorAvailability {
  dayOfWeek: number // 0 = dimanche, 6 = samedi
  startTime: string // ex: "09:00"
  endTime: string   // ex: "17:00"
  isAvailable: boolean
}

// Patient
export interface Patient extends User {
  bloodType?: string
  height?: number
  weight?: number
  emergencyContact?: EmergencyContact
}

// Contact d'urgence
export interface EmergencyContact {
  name: string
  phoneNumber: string
  relationship: string
}

// ✅ Corrigé : UserProfile est soit un Patient, soit un Doctor
export type UserProfile = Patient | Doctor