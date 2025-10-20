// Re-exports de tous les types
export type { Appointment, AppointmentSlot, CreateAppointmentData, Doctor } from './appointment'
export type { ApiResponse, PaginatedResponse } from './api'
export type { User, Doctor as UserDoctor, Patient } from './user'
export type { Payment, CreatePaymentData, ProcessPaymentData } from './payment'
export type { MedicalFile, Consultation, Prescription, Allergy, MedicalCondition } from './medicalFile'