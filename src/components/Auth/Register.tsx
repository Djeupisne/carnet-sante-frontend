import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'patient' as 'patient' | 'doctor',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    phoneNumber: '',
    specialty: '',
    licenseNumber: '',
    biography: '',
    languages: [] as string[],
    bloodType: '' as '' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const [currentLanguage, setCurrentLanguage] = useState('')

  const validateForm = () => {
    console.log('🔍 === VALIDATION DU FORMULAIRE ===')
    
    const newErrors: Record<string, string> = {}

    // Validation prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis'
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères'
    }

    // Validation nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis'
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Le nom doit contenir au moins 2 caractères'
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }

    // Validation date de naissance
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La date de naissance est requise'
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      
      // Ajuster l'âge si l'anniversaire n'est pas encore passé cette année
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      console.log(`📅 Âge calculé: ${age} ans (date: ${formData.dateOfBirth})`)
      
      // ✅ CORRIGÉ : 16 ans minimum (au lieu de 18) pour tests
      if (age < 16) {
        newErrors.dateOfBirth = `Vous devez avoir au moins 16 ans (actuellement: ${age} ans)`
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Date de naissance invalide'
      }
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }

    // Validation téléphone
    if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Format de téléphone invalide'
    }

    // Validation groupe sanguin
    if (formData.bloodType && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(formData.bloodType)) {
      newErrors.bloodType = 'Groupe sanguin invalide'
    }

    // Validation spécifique aux médecins
    if (formData.role === 'doctor') {
      console.log('🔍 Validation des champs médecin...')
      
      // Validation spécialité
      if (!formData.specialty.trim()) {
        newErrors.specialty = 'La spécialité est requise'
      }

      // Validation numéro de licence
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'Le numéro de licence est requis'
      } else if (formData.licenseNumber.trim().length < 3) {
        newErrors.licenseNumber = 'Le numéro de licence doit contenir au moins 3 caractères'
      }

      // ✅ CORRIGÉ : Validation améliorée de la biographie
      if (!formData.biography.trim()) {
        newErrors.biography = 'La biographie est requise'
      } else {
        const cleanBio = formData.biography.trim()
        const bioLength = cleanBio.length
        console.log(`📏 Longueur biographie nettoyée: ${bioLength} caractères`)
        
        if (bioLength < 50) {
          newErrors.biography = `La biographie doit contenir au moins 50 caractères (actuellement: ${bioLength})`
        }
      }

      // Validation langues
      if (formData.languages.length === 0) {
        newErrors.languages = 'Au moins une langue doit être spécifiée'
      }
      
      console.log('✅ Validation médecin terminée')
    }

    console.log('📊 Erreurs trouvées:', Object.keys(newErrors).length)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    console.log(`Champ: ${name}, Valeur: ${value}`)
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleLanguageAdd = () => {
    if (currentLanguage.trim() && !formData.languages.includes(currentLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, currentLanguage.trim()]
      }))
      setCurrentLanguage('')
      
      if (errors.languages) {
        setErrors(prev => ({
          ...prev,
          languages: ''
        }))
      }
    }
  }

  const handleLanguageRemove = (languageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== languageToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔍 === DÉBUT DE L\'ENVOI ===')
    console.log('📏 Vérification des longueurs:')
    console.log('- Biographie brute:', formData.biography.length, 'caractères')
    console.log('- Biographie nettoyée:', formData.biography.trim().length, 'caractères')
    console.log('- Languages:', formData.languages)
    console.log('- Languages est tableau?', Array.isArray(formData.languages))
    
    if (!validateForm()) {
      showNotification('Veuillez corriger les erreurs dans le formulaire', 'error')
      return
    }

    setIsLoading(true)
    
    try {
      // ✅ CORRIGÉ : Préparer les données pour l'API
      const submitData: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      }

      // ✅ CORRIGÉ : Ajouter les champs optionnels seulement s'ils ont une valeur
      if (formData.phoneNumber.trim()) {
        submitData.phoneNumber = formData.phoneNumber.trim()
      }

      if (formData.bloodType) {
        submitData.bloodType = formData.bloodType
      }

      // ✅ CORRIGÉ : Pour les médecins, envoyer les champs spécifiques
      if (formData.role === 'doctor') {
        submitData.specialty = formData.specialty.trim()
        submitData.licenseNumber = formData.licenseNumber.trim()
        submitData.biography = formData.biography.trim()
        submitData.languages = formData.languages
        
        // Logs détaillés pour débogage
        console.log('🔍 Validation finale des données médecin:')
        console.log('- Spécialité:', submitData.specialty, 'longueur:', submitData.specialty.length)
        console.log('- License:', submitData.licenseNumber, 'longueur:', submitData.licenseNumber.length)
        console.log('- Biographie longueur:', submitData.biography.length)
        console.log('- Languages:', submitData.languages)
      }

      console.log('🔍 Données envoyées à l\'API:', JSON.stringify(submitData, null, 2))
      console.log('🔍 Langues:', submitData.languages)
      console.log('🔍 Spécialité:', submitData.specialty)
      console.log('🔍 Groupe sanguin:', submitData.bloodType)
      
      await register(submitData)
      showNotification('Compte créé avec succès!', 'success')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'enregistrement:', error)
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors
        const fieldErrors: Record<string, string> = {}
        
        // ✅ CORRIGÉ : Gestion améliorée des erreurs
        if (Array.isArray(apiErrors)) {
          apiErrors.forEach((err: any) => {
            if (err.field) {
              fieldErrors[err.field] = err.message
            }
          })
        } else if (typeof apiErrors === 'object') {
          Object.keys(apiErrors).forEach(key => {
            fieldErrors[key] = apiErrors[key]
          })
        }
        
        setErrors(fieldErrors)
        showNotification('Erreur lors de la création du compte', 'error')
      } else {
        showNotification(error.response?.data?.message || 'Erreur lors de la création du compte', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getMaxBirthDate = () => {
    const today = new Date()
    // ✅ CORRIGÉ : 16 ans minimum (au lieu de 18) pour tests
    const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate())
    return maxDate.toISOString().split('T')[0]
  }

  const getMinBirthDate = () => {
    const today = new Date()
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
    return minDate.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div 
            className="flex items-center justify-center space-x-3 mb-8 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚕️</span>
            </div>
            <h1 className="text-3xl font-black gradient-text">
              NEXUS HEALTH
            </h1>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Créer un compte
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Ou{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-blue-400 hover:text-blue-300 transition"
            >
              connectez-vous à votre compte existant
            </button>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="futuristic-card p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-white/80 mb-2">
                  Prénom *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`futuristic-card w-full px-3 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.firstName ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="Votre prénom"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-white/80 mb-2">
                  Nom *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`futuristic-card w-full px-3 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.lastName ? 'border-red-500/50' : 'border-white/10'
                  }`}
                  placeholder="Votre nom"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`futuristic-card w-full px-3 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500/50' : 'border-white/10'
                }`}
                placeholder="adresse@exemple.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-white/80 mb-2">
                  Date de naissance *
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  min={getMinBirthDate()}
                  max={getMaxBirthDate()}
                  className={`futuristic-card w-full px-3 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.dateOfBirth ? 'border-red-500/50' : 'border-white/10'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-400">{errors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-white/80 mb-2">
                  Genre *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="futuristic-card w-full px-3 py-3 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-white/80 mb-2">
                Téléphone
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`futuristic-card w-full px-3 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phoneNumber ? 'border-red-500/50' : 'border-white/10'
                  }`}
                placeholder="+33 1 23 45 67 89"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white/80 mb-2">
                Je suis *
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="futuristic-card w-full px-3 py-3 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Médecin</option>
              </select>
            </div>

            {formData.role === 'doctor' && (
              <>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-white/80 mb-2">
                    Spécialité médicale *
                  </label>
                  <input
                    id="specialty"
                    name="specialty"
                    type="text"
                    required
                    value={formData.specialty}
                    onChange={handleChange}
                    className={`futuristic-card w-full px-3 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.specialty ? 'border-red-500/50' : 'border-white/10'
                    }`}
                    placeholder="Ex: Cardiologie, Pédiatrie, etc."
                  />
                  {errors.specialty && (
                    <p className="mt-1 text-sm text-red-400">{errors.specialty}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-white/80 mb-2">
                    Numéro de licence médicale *
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className={`futuristic-card w-full px-3 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.licenseNumber ? 'border-red-500/50' : 'border-white/10'
                    }`}
                    placeholder="Votre numéro de licence"
                  />
                  {errors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-400">{errors.licenseNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Langues parlées *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentLanguage}
                      onChange={(e) => setCurrentLanguage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleLanguageAdd())}
                      className="futuristic-card flex-1 px-3 py-2 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ajouter une langue (ex: Français)"
                    />
                    <button
                      type="button"
                      onClick={handleLanguageAdd}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                    >
                      Ajouter
                    </button>
                  </div>
                  
                  {formData.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.languages.map((language, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm"
                        >
                          {language}
                          <button
                            type="button"
                            onClick={() => handleLanguageRemove(language)}
                            className="ml-2 text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {errors.languages && (
                    <p className="mt-1 text-sm text-red-400">{errors.languages}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="biography" className="block text-sm font-medium text-white/80 mb-2">
                    Biographie professionnelle *
                  </label>
                  <textarea
                    id="biography"
                    name="biography"
                    required
                    value={formData.biography}
                    onChange={handleChange}
                    rows={4}
                    className={`futuristic-card w-full px-3 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.biography ? 'border-red-500/50' : 'border-white/10'
                    }`}
                    placeholder="Décrivez votre parcours professionnel, vos compétences et votre expérience..."
                  />
                  {errors.biography && (
                    <p className="mt-1 text-sm text-red-400">{errors.biography}</p>
                  )}
                  {/* ✅ CORRIGÉ : Afficher la longueur nettoyée */}
                  <p className="mt-1 text-sm text-white/60">
                    {formData.biography.trim().length}/50 caractères minimum
                  </p>
                </div>
              </>
            )}

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-medium text-white/80 mb-4">Informations complémentaires (optionnelles)</h3>
              
              <div className="mb-4">
                <label htmlFor="bloodType" className="block text-sm font-medium text-white/80 mb-2">
                  Groupe sanguin
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className={`futuristic-card w-full px-3 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.bloodType ? 'border-red-500/50' : 'border-white/10'
                  }`}
                >
                  <option value="">Sélectionnez votre groupe sanguin</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodType && (
                  <p className="mt-1 text-sm text-red-400">{errors.bloodType}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Mot de passe *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`futuristic-card w-full px-3 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'border-red-500/50' : 'border-white/10'
                }`}
                placeholder="Au moins 6 caractères"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="futuristic-btn w-full flex justify-center py-3 px-4 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Création du compte...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="futuristic-btn-secondary w-full py-3"
            >
              ← Retour à l'accueil
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
