export interface MedicalFile {
  id: string
  patientId: string
  bloodType?: string
  height?: number
  weight?: number
  allergies: Allergy[]
  medications: Medication[]
  conditions: MedicalCondition[]
  surgeries: Surgery[]
  familyHistory: FamilyHistory[]
  consultations: Consultation[]
  createdAt: string
  updatedAt: string
}

export interface Allergy {
  id: string
  name: string
  severity: 'mild' | 'moderate' | 'severe'
  symptoms: string[]
  onsetDate: string
  notes?: string
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  prescribedBy: string
  reason: string
  notes?: string
}

export interface MedicalCondition {
  id: string
  name: string
  diagnosisDate: string
  status: 'active' | 'resolved' | 'chronic'
  symptoms: string[]
  treatment?: string
  notes?: string
}

export interface Surgery {
  id: string
  name: string
  date: string
  hospital: string
  surgeon: string
  notes?: string
}

export interface FamilyHistory {
  id: string
  condition: string
  relation: string
  ageAtDiagnosis?: number
  notes?: string
}

export interface Consultation {
  id: string
  date: string
  doctorId: string
  doctorName: string
  reason: string
  diagnosis?: string
  treatment?: string
  prescriptions: Prescription[]
  notes?: string
  followUpDate?: string
}

export interface Prescription {
  id: string
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions?: string
}