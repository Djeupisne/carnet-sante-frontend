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
      
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      console.log(`📅 Âge calculé: ${age} ans (date: ${formData.dateOfBirth})`)
      
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
      
      if (!formData.specialty.trim()) {
        newErrors.specialty = 'La spécialité est requise'
      }

      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'Le numéro de licence est requis'
      } else if (formData.licenseNumber.trim().length < 3) {
        newErrors.licenseNumber = 'Le numéro de licence doit contenir au moins 3 caractères'
      }

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
      const submitData: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      }

      if (formData.phoneNumber.trim()) {
        submitData.phoneNumber = formData.phoneNumber.trim()
      }

      if (formData.bloodType) {
        submitData.bloodType = formData.bloodType
      }

      if (formData.role === 'doctor') {
        submitData.specialty = formData.specialty.trim()
        submitData.licenseNumber = formData.licenseNumber.trim()
        submitData.biography = formData.biography.trim()
        submitData.languages = formData.languages
        
        console.log('🔍 Validation finale des données médecin:')
        console.log('- Spécialité:', submitData.specialty, 'longueur:', submitData.specialty.length)
        console.log('- License:', submitData.licenseNumber, 'longueur:', submitData.licenseNumber.length)
        console.log('- Biographie longueur:', submitData.biography.length)
        console.log('- Languages:', submitData.languages)
      }

      console.log('🔍 Données envoyées à l\'API:', JSON.stringify(submitData, null, 2))
      
      await register(submitData)
      showNotification('Compte créé avec succès!', 'success')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'enregistrement:', error)
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors
        const fieldErrors: Record<string, string> = {}
        
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
    const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate())
    return maxDate.toISOString().split('T')[0]
  }

  const getMinBirthDate = () => {
    const today = new Date()
    const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate())
    return minDate.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center space-x-2 mb-6 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                <span className="text-2xl">⚕️</span>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NEXUS HEALTH
              </h1>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Créer un compte
            </h2>
            <p className="text-white/70 text-sm">
              Rejoignez notre plateforme de santé connectée
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Informations personnelles */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-white/90 mb-2">
                    Prénom *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all placeholder-white/40 ${
                      errors.firstName ? 'border-red-500/70 ring-2 ring-red-500/30' : 'border-white/20'
                    }`}
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && (
                    <p className="mt-1.5 text-xs text-red-300 flex items-center">
                      <span className="mr-1">⚠</span> {errors.firstName}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-white/90 mb-2">
                    Nom *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all placeholder-white/40 ${
                      errors.lastName ? 'border-red-500/70 ring-2 ring-red-500/30' : 'border-white/20'
                    }`}
                    placeholder="Votre nom"
                  />
                  {errors.lastName && (
                    <p className="mt-1.5 text-xs text-red-300 flex items-center">
                      <span className="mr-1">⚠</span> {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2">
                  Adresse email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all placeholder-white/40 ${
                    errors.email ? 'border-red-500/70 ring-2 ring-red-500/30' : 'border-white/20'
                  }`}
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-300 flex items-center">
                    <span className="mr-1">⚠</span> {errors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-white/90 mb-2">
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
                    className={`w-full px-4 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all ${
                      errors.dateOfBirth ? 'border-red-500/70 ring-2 ring-red-500/30' : 'border-white/20'
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1.5 text-xs text-red-300 flex items-center">
                      <span className="mr-1">⚠</span> {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-semibold text-white/90 mb-2">
                    Genre *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-white bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all"
                  >
                    <option value="male" className="bg-gray-800">Homme</option>
                    <option value="female" className="bg-gray-800">Femme</option>
                    <option value="other" className="bg-gray-800">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-white/90 mb-2">
                  Téléphone
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all placeholder-white/40 ${
                    errors.phoneNumber ? 'border-red-500/70 ring-2 ring-red-500/30' : 'border-white/20'
                  }`}
                  placeholder="+33 1 23 45 67 89"
                />
                {errors.phoneNumber && (
                  <p className="mt-1.5 text-xs text-red-300 flex items-center">
                    <span className="mr-1">⚠</span> {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-white/90 mb-2">
                  Je suis *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-white bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all"
                >
                  <option value="patient" className="bg-gray-800">Patient</option>
                  <option value="doctor" className="bg-gray-800">Médecin</option>
                </select>
              </div>
            </div>

            {/* Champs médecin */}
            {formData.role === 'doctor' && (
              <div className="space-y-5 pt-4 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white/90 flex items-center">
                  <span className="mr-2">👨‍⚕️</span>
                  Informations professionnelles
                </h3>

                <div>
                  <label htmlFor="specialty" className="block text-sm font-semibold text-white/90 mb-2">
                    Spécialité médicale *
                  </label>
                  <input
                    id="specialty"
                    name="specialty"
                    type="text"
                    required
                    value={formData.specialty}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all placeholder-white/40 ${
                      errors.specialty ? 'border-red-500/70 ring-2 ring-red-500/30' : 'border-white/20'
                    }`}
                    placeholder="Ex: Cardiologie, Pédiatrie..."
                  />
                  {errors.specialty && (
                    <p className="mt-1.5 text-xs text-red-300 flex items-center">
                      <span className="mr-1">⚠</span> {errors.specialty}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-semibold text-white/90 mb-2">
                    Numéro de licence médicale *
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all placeholder-white/40 ${
                      errors.licenseNumber ? 'border-red-500/70 ring-2 ring-red-500/30' : 'border-white/20'
                    }`}
                    placeholder="Votre numéro de licence"
                  />
                  {errors.licenseNumber && (
                    <p className="mt-1.5 text-xs text-red-300 flex items-center">
                      <span className="mr-1">⚠</span> {errors.licenseNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-2">
                    Langues parlées *
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={currentLanguage}
                      onChange={(e) => setCurrentLanguage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleLanguageAdd())}
                      className="flex-1 px-4 py-2.5 text-white bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all placeholder-white/40"
                      placeholder="Ex: Français, Anglais..."
                    />
                    <button
                      type="button"
                      onClick={handleLanguageAdd}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:scale-105"
                    >
                      +
                    </button>
                  </div>
                  
                  {formData.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.languages.map((language, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-400/30 text-purple-200 text-sm font-medium"
                        >
                          {language}
                          <button
                            type="button"
                            onClick={() => handleLanguageRemove(language)}
                            className="text-red-300 hover:text-red-200 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {errors.languages && (
                    <p className="mt-1.5 text-xs text-red-300 flex items-center">
                      <span className="mr-1">⚠</span> {errors.languages}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="biography" className="block text-sm font-semibold text-white/90 mb-2">
                    Biographie professionnelle *
                  </label>
                  <textarea
                    id="biography"
                    name="biography"
                    required
                    value={formData.biography}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all placeholder-white/40 resize-none ${
                      errors.biography ? 'border-red-500/70 ring-2 ring-red-500/30' : 'border-white/20'
                    }`}
                    placeholder="Décrivez votre parcours professionnel, vos compétences et votre expérience..."
                  />
                  {errors.biography && (
                    <p className="mt-1.5 text-xs text-red-300 flex items-center">
                      <span className="mr-1">⚠</span> {errors.biography}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-white/50">
                    {formData.biography.trim().length}/50 caractères minimum
                  </p>
                </div>
              </div>
            )}

            {/* Informations complémentaires */}
            <div className="space-y-5 pt-4 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white/90">
                Informations complémentaires
                <span className="text-sm font-normal text-white/50 ml-2">(optionnel)</span>
              </h3>
              
              <div>
                <label htmlFor="bloodType" className="block text-sm font-semibold text-white/90 mb-2">
                  Groupe sanguin
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all ${
                    errors.bloodType ? 'border-red-500/70 ring-2 ring-red-500/30' : 'border-white/20'
                  }`}
                >
                  <option value="" className="bg-gray-800">Sélectionnez votre groupe sanguin</option>
                  <option value="A+" className="bg-gray-800">A+</option>
                  <option value="A-" className="bg-gray-800">A-</option>
                  <option value="B+" className="bg-gray-800">B+</option>
                  <option value="B-" className="bg-gray-800">B-</option>
                  <option value="AB+" className="bg-gray-800">AB+</option>
                  <option value="AB-" className="bg-gray-800">AB-</option>
                  <option value="O+" className="bg-gray-800">O+</option>
                  <option value="O-" className="bg-gray-800">O-</option>
                </select>
                {errors.bloodType && (
                  <p className="mt-1.5 text-xs text-red-300 flex items-center">
                    <span className="mr-1">⚠</span> {errors.bloodType}
                  </p>
                )}
              </div>
            </div>

            {/* Mot de passe */}
            <div className="pt-4 border-t border-white/10">
              <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-2">
                Mot de passe *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 text-white bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all placeholder-white/40 ${
                  errors.password ? 'border-red-500/70 ring-2 ring-red-500/30' : 'border-white/20'
                }`}
                placeholder="Minimum 6 caractères"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-300 flex items-center">
                  <span className="mr-1">⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Boutons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold py-3.5 px-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    <span>Création du compte...</span>
                  </div>
                ) : (
                  'Créer mon compte'
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/60">Vous avez déjà un compte ?</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>

        {/* Back button */}
        <div className="mt-6">
          <button
            onClick={() => navigate('/')}
            className="w-full backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
