import { z } from 'zod'

export const emailSchema = z.string().email('Email invalide')

export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')

export const phoneSchema = z
  .string()
  .regex(/^[0-9+\-\s()]{10,}$/, 'Numéro de téléphone invalide')

export const nameSchema = z
  .string()
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(50, 'Le nom ne peut pas dépasser 50 caractères')

export const dateSchema = z.string().refine((date) => {
  const dateObj = new Date(date)
  return !isNaN(dateObj.getTime()) && dateObj < new Date()
}, 'Date invalide')

export const requiredString = z.string().min(1, 'Ce champ est requis')

export const positiveNumber = z.number().positive('Doit être un nombre positif')

export const appointmentSchema = z.object({
  doctorId: requiredString,
  date: requiredString,
  startTime: requiredString,
  endTime: requiredString,
  reason: requiredString.min(10, 'La raison doit contenir au moins 10 caractères'),
  type: requiredString,
})

export const medicalFileSchema = z.object({
  bloodType: z.string().optional(),
  height: positiveNumber.optional(),
  weight: positiveNumber.optional(),
  allergies: z.array(z.object({
    name: requiredString,
    severity: z.enum(['mild', 'moderate', 'severe']),
    symptoms: z.array(z.string()),
    onsetDate: requiredString,
    notes: z.string().optional(),
  })),
  medications: z.array(z.object({
    name: requiredString,
    dosage: requiredString,
    frequency: requiredString,
    startDate: requiredString,
    endDate: z.string().optional(),
    prescribedBy: requiredString,
    reason: requiredString,
    notes: z.string().optional(),
  })),
})