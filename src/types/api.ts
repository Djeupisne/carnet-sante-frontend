import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

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

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // CORRECTION : Vérification avant d'utiliser baseURL et url
    const baseURL = config.baseURL || ''
    const url = config.url || ''
    console.log('Requête API:', baseURL + url, config.params)
    
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Erreur dans l\'intercepteur de requête:', error)
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('Erreur dans l\'intercepteur de réponse:', error.response?.data || error.message)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api