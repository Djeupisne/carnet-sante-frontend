// ============================================
// 3. src/services/api.ts - CORRIGÉ (Alternative)
// ============================================

import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

console.log('🔧 API Service configuré avec URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur de requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Erreur requête:', error)
    return Promise.reject(error)
  }
)

// Intercepteur de réponses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ Erreur API:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })

    if (error.response?.status === 401) {
      console.log('🔒 Session expirée, déconnexion...')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api


