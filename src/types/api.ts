// ============================================
// 2. src/types/api.ts - CORRIGÉ
// ============================================

import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '../utils/constants'

// Exporter l'URL pour les autres fichiers qui en ont besoin
export { API_BASE_URL }

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  success?: boolean
  status?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages?: number
  }
}

// Instance axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const baseURL = config.baseURL || ''
    const url = config.url || ''
    console.log(`📤 Requête API: ${baseURL}${url}`, config.params || '')
    
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('❌ Erreur dans l\'intercepteur de requête:', error)
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ Erreur dans l\'intercepteur de réponse:', error.response?.data || error.message)
    
    if (error.response?.status === 401) {
      console.log('🔒 Non authentifié, redirection vers login...')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('🌐 Erreur réseau : Impossible de contacter le serveur')
      console.error(`URL tentée : ${error.config?.baseURL}${error.config?.url}`)
    }
    
    return Promise.reject(error)
  }
)

export default api


