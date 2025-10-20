export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  patient: {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string
    dateOfBirth?: string
    gender?: string
  }
  doctor: {
    id: string
    firstName: string
    lastName: string
    specialty: string
    email: string
    phoneNumber?: string
    licenseNumber?: string
    biography?: string
    consultationPrice: number
    languages: string[]
    rating?: number
  }
  appointmentDate: string
  duration: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  type: 'in_person' | 'teleconsultation' | 'home_visit'
  reason: string
  symptoms?: any
  meetingLink?: string
  meetingPassword?: string
  notes?: string
  cancellationReason?: string
  reminderSent: boolean
  rating?: number
  feedback?: string
  createdAt: string
  updatedAt: string
}

export interface AppointmentSlot {
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

export interface CreateAppointmentData {
  doctorId: string
  date: string
  startTime: string
  endTime: string
  reason: string
  type: string
}

export interface Doctor {
  id: string
  uniqueCode: string
  firstName: string
  lastName: string
  specialty: string
  email: string
  phoneNumber?: string
  dateOfBirth: string
  gender: string
  licenseNumber: string
  biography?: string
  languages: string[]
  consultationPrice: number
  availability: any
  rating?: number
  totalReviews?: number
  profilePicture?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}