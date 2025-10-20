import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      showNotification('Veuillez remplir tous les champs', 'error')
      return
    }

    setIsLoading(true)
    
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (error) {
      // L'erreur est gérée dans le contexte
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
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
            Connexion
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Ou{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-blue-400 hover:text-blue-300 transition"
            >
              créez un nouveau compte
            </button>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="futuristic-card w-full px-3 py-3 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="adresse@exemple.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="futuristic-card w-full px-3 py-3 text-white bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre mot de passe"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="futuristic-btn w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="font-medium text-blue-400 hover:text-blue-300 transition text-sm"
            >
              Mot de passe oublié?
            </button>
          </div>
        </form>

        {/* Bouton retour */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="futuristic-btn-secondary w-full py-3"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login