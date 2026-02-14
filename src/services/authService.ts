import api from './api'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'patient' | 'doctor'
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  phoneNumber?: string
  bloodType?: string
  // ✅ Champs spécifiques aux médecins
  specialty?: string
  licenseNumber?: string
  biography?: string
  languages?: string[]
}

export interface User {
  id: string
  uniqueCode: string
  email: string
  firstName: string
  lastName: string
  role: 'patient' | 'doctor' | 'admin' | 'hospital_admin'
  gender: string
  dateOfBirth: string
  phoneNumber?: string
  bloodType?: string
  // ✅ Champs spécifiques aux médecins
  specialty?: string
  licenseNumber?: string
  biography?: string
  languages?: string[]
  isActive: boolean
  isVerified: boolean
  profileCompleted: boolean
  profilePicture?: string
}

export interface AuthResponse {
  user: User
  token: string
  message?: string
}

export interface AdminLoginResponse {
  success: boolean
  token: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: 'admin'
  }
}

export const authService = {
  /**
   * ✅ Connexion unifiée (admin + patients + médecins)
   */
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔐 authService.login - Envoi des identifiants...')
      console.log('Email:', credentials.email)

      const response = await api.post('/auth/login', credentials)

      console.log('✓ Réponse complète du serveur:', response.data)

      // Vérifier que la réponse a la bonne structure
      if (!response.data) {
        console.error('Aucune donnée reçue')
        throw new Error('Aucune donnée reçue du serveur')
      }

      if (!response.data.success) {
        console.error('Réponse non-succès:', response.data)
        throw new Error(response.data.message || 'Erreur de connexion')
      }

      // Vérifier que data contient user et token
      if (!response.data.data) {
        console.error('Pas de data dans la réponse:', response.data)
        throw new Error('Structure de réponse invalide')
      }

      const { user, token } = response.data.data

      console.log('✓ User reçu:', { 
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      })
      console.log('✓ Token reçu:', token ? 'Oui' : 'Non')

      if (!user || !token) {
        console.error('User ou token manquant:', { user, token })
        throw new Error('User ou token manquant dans la réponse')
      }

      return {
        user,
        token,
        message: response.data.message,
      }
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error)

      // Gestion des erreurs HTTP
      if (error.response?.status === 401) {
        console.error('401 - Identifiants invalides')
        throw new Error('Email ou mot de passe incorrect')
      }

      if (error.response?.status === 403) {
        console.error('403 - Accès refusé')
        throw new Error('Accès non autorisé')
      }

      if (error.response?.status === 423) {
        console.error('423 - Compte verrouillé')
        throw new Error('Compte temporairement verrouillé. Réessayez dans 15 minutes.')
      }

      if (error.response?.data?.message) {
        console.error('Erreur du serveur:', error.response.data.message)
        throw new Error(error.response.data.message)
      }

      console.error('Erreur brute:', error.message)
      throw error
    }
  },

  /**
   * ✅ Connexion dédiée pour les admins (optionnelle)
   */
  async adminLogin(credentials: LoginData): Promise<AdminLoginResponse> {
    try {
      console.log('👑 authService.adminLogin - Tentative de connexion admin...')
      console.log('Email:', credentials.email)

      const response = await api.post('/auth/admin/login', credentials)

      console.log('✓ Réponse admin:', response.data)

      if (!response.data.success) {
        throw new Error(response.data.message || 'Erreur de connexion admin')
      }

      return response.data
    } catch (error: any) {
      console.error('❌ Erreur connexion admin:', error)
      
      if (error.response?.status === 401) {
        throw new Error('Identifiants admin incorrects')
      }
      
      throw error
    }
  },

  /**
   * ✅ Inscription (patients et médecins uniquement)
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('📝 authService.register - Envoi des données...')
      console.log('Email:', userData.email)
      console.log('Rôle:', userData.role)

      // Vérifier que l'email n'est pas un email admin
      const adminEmails = ['admin@carnetsante.com', 'superadmin@carnetsante.com']
      if (adminEmails.includes(userData.email.toLowerCase())) {
        throw new Error('Cet email ne peut pas être utilisé pour créer un compte')
      }

      // ✅ Adaptation des données pour correspondre au modèle User
      const registerData: any = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'patient',
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        phoneNumber: userData.phoneNumber || null,
        bloodType: userData.bloodType || null,
      }

      // ✅ Ajouter les champs spécifiques aux médecins
      if (userData.role === 'doctor') {
        console.log('🏥 Ajout des données médecin...')
        registerData.specialty = userData.specialty || null
        registerData.licenseNumber = userData.licenseNumber || null
        registerData.biography = userData.biography || null
        registerData.languages = userData.languages || []
        
        console.log('Données médecin:', {
          specialty: registerData.specialty,
          licenseNumber: registerData.licenseNumber,
          biographyLength: registerData.biography ? registerData.biography.length : 0,
          languages: registerData.languages
        })
      }

      console.log('Données à envoyer:', registerData)

      const response = await api.post('/auth/register', registerData)

      console.log('✓ Réponse complète du serveur:', response.data)

      if (!response.data) {
        console.error('Aucune donnée reçue')
        throw new Error('Aucune donnée reçue du serveur')
      }

      if (!response.data.success) {
        console.error('Réponse non-succès:', response.data)
        throw new Error(response.data.message || 'Erreur d\'enregistrement')
      }

      if (!response.data.data) {
        console.error('Pas de data dans la réponse:', response.data)
        throw new Error('Structure de réponse invalide')
      }

      const { user, token } = response.data.data

      console.log('✓ User reçu:', { 
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      })
      console.log('✓ Token reçu:', token ? 'Oui' : 'Non')

      if (!user || !token) {
        console.error('User ou token manquant:', { user, token })
        throw new Error('User ou token manquant dans la réponse')
      }

      return {
        user,
        token,
        message: response.data.message,
      }
    } catch (error: any) {
      console.error('❌ Erreur d\'enregistrement:', error)

      if (error.response?.status === 409) {
        console.error('409 - Email déjà utilisé')
        throw new Error('Cet email est déjà utilisé')
      }

      if (error.response?.status === 403) {
        console.error('403 - Email non autorisé')
        throw new Error('Cet email ne peut pas être utilisé pour créer un compte')
      }

      if (error.response?.data?.message) {
        console.error('Erreur du serveur:', error.response.data.message)
        throw new Error(error.response.data.message)
      }

      if (error.response?.data?.errors) {
        console.error('Erreurs de validation:', error.response.data.errors)
        const errorMessages = error.response.data.errors
          .map((e: any) => `${e.field}: ${e.message}`)
          .join(', ')
        throw new Error(errorMessages)
      }

      console.error('Erreur brute:', error.message)
      throw error
    }
  },

  /**
   * ✅ Déconnexion
   */
  async logout(): Promise<void> {
    try {
      console.log('🚪 authService.logout')
      await api.post('/auth/logout')
      console.log('✓ Déconnexion réussie')
    } catch (error: any) {
      console.error('⚠️ Erreur logout:', error)
      // Ne pas relancer l'erreur - la déconnexion locale doit continuer
    }
  },

  /**
   * ✅ Récupérer l'utilisateur actuel
   */
  async getCurrentUser(): Promise<User> {
    try {
      console.log('👤 authService.getCurrentUser')
      const response = await api.get('/auth/me')

      if (!response.data?.success) {
        throw new Error('Impossible de récupérer l\'utilisateur')
      }

      const user = response.data.data.user
      console.log('✓ User actuel:', { 
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      })
      return user
    } catch (error: any) {
      console.error('❌ Erreur getCurrentUser:', error)
      throw error
    }
  },

  /**
   * ✅ Rafraîchir le token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      console.log('🔄 authService.refreshToken')
      const response = await api.post('/auth/refresh')
      
      if (!response.data?.success) {
        throw new Error('Impossible de rafraîchir le token')
      }

      const { token, user } = response.data.data
      console.log('✓ Token rafraîchi')
      
      return {
        user,
        token,
        message: response.data.message,
      }
    } catch (error: any) {
      console.error('❌ Erreur refreshToken:', error)
      throw error
    }
  },

  /**
   * ✅ Demander la réinitialisation du mot de passe
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('📧 authService.forgotPassword')
      const response = await api.post('/auth/forgot-password', { email })
      console.log('✓ Demande de réinitialisation envoyée')
      return response.data
    } catch (error: any) {
      console.error('❌ Erreur forgotPassword:', error)
      throw error
    }
  },

  /**
   * ✅ Réinitialiser le mot de passe
   */
  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔑 authService.resetPassword')
      const response = await api.post('/auth/reset-password', { token, password })
      console.log('✓ Mot de passe réinitialisé')
      return response.data
    } catch (error: any) {
      console.error('❌ Erreur resetPassword:', error)
      throw error
    }
  },

  /**
   * ✅ Vérifier si l'email est un email admin
   */
  isAdminEmail(email: string): boolean {
    const adminEmails = ['admin@carnetsante.com', 'superadmin@carnetsante.com']
    return adminEmails.includes(email.toLowerCase())
  }
}
