import React from 'react'
import { Link } from 'react-router-dom'
import { Lock, AlertTriangle, Home, ArrowLeft } from 'lucide-react'
import Button from '../components/Common/Button'

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 relative overflow-hidden flex items-center justify-center px-4">
      {/* Fond animé */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-amber-500/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Icône */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-lg opacity-75"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <Lock className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-5xl font-black mb-4">
          <span className="bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent">
            403
          </span>
        </h1>

        {/* Message principal */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Accès refusé</h2>
        </div>

        {/* Description */}
        <p className="text-white/60 mb-10 text-lg">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page. Veuillez vérifier vos droits d'accès ou contacter l'administrateur.
        </p>

        {/* Boutons */}
        <div className="space-y-4">
          {/* Bouton Accueil - CORRECTION : envelopper le Button dans un Link */}
          <Link to="/" className="block">
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              <Home className="w-5 h-5 mr-2 inline" />
              Retour à l'accueil
            </Button>
          </Link>

          {/* Bouton Tableau de bord - CORRECTION : envelopper le Button dans un Link */}
          <Link to="/dashboard" className="block">
            <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
              <ArrowLeft className="w-5 h-5 mr-2 inline" />
              Aller au tableau de bord
            </Button>
          </Link>
        </div>

        {/* Texte d'aide */}
        <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-white/50 text-sm">
            Si vous pensez que c'est une erreur, <span className="text-cyan-400 cursor-pointer hover:text-cyan-300">contactez le support</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage