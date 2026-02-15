import api from './api';

export interface MedicalFile {
  id: string;
  patientId: string;
  doctorId: string;
  recordType: 'consultation' | 'lab_result' | 'prescription' | 'vaccination' | 'allergy' | 'surgery' | 'hospitalization' | 'chronic_disease' | 'family_history';
  title: string;
  description?: string;
  diagnosis?: string;
  symptoms?: any;
  medications?: any;
  labResults?: any;
  vitalSigns?: any;
  attachments?: any;
  consultationDate: string;
  nextAppointment?: string;
  isCritical: boolean;
  isShared: boolean;
  accessLog: any[];
  createdAt: string;
  updatedAt: string;
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    specialty?: string;
  };
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'stopped';
  doctorName?: string;
}

export interface Allergy {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  diagnosedDate: string;
  notes?: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'ongoing';
  notes?: string;
}

export const medicalFileService = {
  /**
   * Récupérer tous les dossiers médicaux du patient connecté
   */
  async getPatientMedicalFiles(patientId: string): Promise<{ success: boolean; data: MedicalFile[] }> {
    try {
      console.log(`📁 Récupération des dossiers médicaux pour le patient ${patientId}...`);
      const response = await api.get(`/medical-files/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération dossiers médicaux:', error);
      throw error;
    }
  },

  /**
   * Récupérer un dossier médical par son ID
   */
  async getMedicalFileById(fileId: string): Promise<{ success: boolean; data: MedicalFile }> {
    try {
      console.log(`📁 Récupération du dossier médical ${fileId}...`);
      const response = await api.get(`/medical-files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération dossier médical:', error);
      throw error;
    }
  },

  /**
   * Récupérer les médicaments (extraits des prescriptions)
   */
  async getMedications(patientId: string): Promise<Medication[]> {
    try {
      const response = await this.getPatientMedicalFiles(patientId);
      const medications: Medication[] = [];
      
      if (response.success) {
        response.data
          .filter(file => file.recordType === 'prescription' && file.medications)
          .forEach(file => {
            if (Array.isArray(file.medications)) {
              file.medications.forEach((med: any) => {
                medications.push({
                  id: med.id || `med-${Date.now()}`,
                  name: med.name || 'Médicament',
                  dosage: med.dosage || '',
                  frequency: med.frequency || '',
                  startDate: med.startDate || file.consultationDate,
                  endDate: med.endDate,
                  prescribedBy: file.doctor ? `Dr. ${file.doctor.firstName} ${file.doctor.lastName}` : 'Médecin',
                  status: med.status || 'active',
                  doctorName: file.doctor ? `Dr. ${file.doctor.firstName} ${file.doctor.lastName}` : undefined
                });
              });
            }
          });
      }
      
      return medications;
    } catch (error) {
      console.error('❌ Erreur récupération médicaments:', error);
      return [];
    }
  },

  /**
   * Récupérer les allergies
   */
  async getAllergies(patientId: string): Promise<Allergy[]> {
    try {
      const response = await this.getPatientMedicalFiles(patientId);
      const allergies: Allergy[] = [];
      
      if (response.success) {
        response.data
          .filter(file => file.recordType === 'allergy')
          .forEach(file => {
            allergies.push({
              id: file.id,
              name: file.title,
              severity: file.isCritical ? 'severe' : 'moderate',
              reaction: file.description || '',
              diagnosedDate: file.consultationDate,
              notes: file.diagnosis
            });
          });
      }
      
      return allergies;
    } catch (error) {
      console.error('❌ Erreur récupération allergies:', error);
      return [];
    }
  },

  /**
   * Récupérer les conditions médicales chroniques
   */
  async getMedicalConditions(patientId: string): Promise<MedicalCondition[]> {
    try {
      const response = await this.getPatientMedicalFiles(patientId);
      const conditions: MedicalCondition[] = [];
      
      if (response.success) {
        response.data
          .filter(file => file.recordType === 'chronic_disease')
          .forEach(file => {
            conditions.push({
              id: file.id,
              name: file.title,
              diagnosedDate: file.consultationDate,
              status: file.isCritical ? 'active' : 'ongoing',
              notes: file.description
            });
          });
      }
      
      return conditions;
    } catch (error) {
      console.error('❌ Erreur récupération conditions:', error);
      return [];
    }
  }
};
