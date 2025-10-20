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

export interface DoctorAvailability {
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface Patient extends User {
  bloodType?: string
  height?: number
  weight?: number
  emergencyContact?: EmergencyContact
}

export interface EmergencyContact {
  name: string
  phoneNumber: string
  relationship: string
}

export interface UserProfile extends Patient, Doctor {}