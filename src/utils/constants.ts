// CORRIGÉ : URL directe au lieu de import.meta.env
export const API_BASE_URL = 'http://localhost:3001/api'

export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
} as const

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const

export const APPOINTMENT_TYPES = {
  CONSULTATION: 'consultation',
  FOLLOW_UP: 'follow_up',
  EMERGENCY: 'emergency',
  ROUTINE: 'routine',
} as const

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

export const ALLERGY_SEVERITY = {
  MILD: 'mild',
  MODERATE: 'moderate',
  SEVERE: 'severe',
} as const

export const CONDITION_STATUS = {
  ACTIVE: 'active',
  RESOLVED: 'resolved',
  CHRONIC: 'chronic',
} as const

export const DAYS_OF_WEEK = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
] as const

export const SPECIALIZATIONS = [
  'Médecine générale',
  'Cardiologie',
  'Dermatologie',
  'Gynécologie',
  'Pédiatrie',
  'Psychiatrie',
  'Radiologie',
  'Chirurgie',
  'Ophtalmologie',
  'ORL',
  'Neurologie',
  'Orthopédie',
] as const