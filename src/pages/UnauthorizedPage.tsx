import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Common/Button'

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-yellow-600">403</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Accès non autorisé
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button as={Link} to="/" className="w-full">
            Retour à l'accueil
          </Button>
          <Button as={Link} to="/dashboard" variant="outline" className="w-full">
            Tableau de bord
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage