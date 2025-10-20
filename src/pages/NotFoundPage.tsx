import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Page non trouvée
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Désolé, nous n'avons pas trouvé la page que vous recherchez.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 transition text-center"
          >
            Retour à l'accueil
          </Link>
          <Link
            to="/dashboard"
            className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition text-center"
          >
            Tableau de bord
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage