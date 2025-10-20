import api from './api'
import { MedicalFile, Consultation, ApiResponse } from '../types'

export const medicalFileService = {
  async getMedicalFile(): Promise<MedicalFile> {
    const response = await api.get<ApiResponse<MedicalFile>>('/medical-file')
    return response.data.data
  },

  async updateMedicalFile(data: Partial<MedicalFile>): Promise<MedicalFile> {
    const response = await api.put<ApiResponse<MedicalFile>>('/medical-file', data)
    return response.data.data
  },

  async addConsultation(data: Partial<Consultation>): Promise<Consultation> {
    const response = await api.post<ApiResponse<Consultation>>('/medical-file/consultations', data)
    return response.data.data
  },

  async getConsultations(): Promise<Consultation[]> {
    const response = await api.get<ApiResponse<Consultation[]>>('/medical-file/consultations')
    return response.data.data
  },

  async uploadDocument(file: File): Promise<any> {
    const formData = new FormData()
    formData.append('document', file)
    
    const response = await api.post<ApiResponse<any>>('/medical-file/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },
}