import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                Carnet de Santé
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">
                    Bonjour, {user?.firstName}
                  </span>
                  <Link
                    to="/dashboard"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition"
                  >
                    Tableau de bord
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Votre santé,
            <span className="text-primary-600"> simplifiée</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gérez vos rendez-vous médicaux, consultez votre dossier de santé et 
            suivez votre parcours médical en toute simplicité.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-primary-700 transition"
                >
                  Commencer gratuitement
                </Link>
                <Link
                  to="/login"
                  className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition"
                >
                  Se connecter
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-primary-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-primary-700 transition"
              >
                Accéder au tableau de bord
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600">
              Une plateforme complète pour gérer votre santé au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📅',
                title: 'Gestion des rendez-vous',
                description: 'Prenez, modifiez ou annulez vos rendez-vous en ligne facilement'
              },
              {
                icon: '🏥', 
                title: 'Dossier médical numérique',
                description: 'Accédez à votre dossier médical complet en quelques clics'
              },
              {
                icon: '🔔',
                title: 'Rappels intelligents',
                description: 'Recevez des rappels pour vos rendez-vous et traitements'
              },
              {
                icon: '👨‍⚕️',
                title: 'Réseau de médecins',
                description: 'Trouvez et consultez des professionnels de santé qualifiés'
              },
              {
                icon: '💊',
                title: 'Gestion des traitements',
                description: 'Suivez vos médicaments et traitements au quotidien'
              },
              {
                icon: '📊',
                title: 'Analyses et suivis',
                description: 'Visualisez l\'évolution de votre santé dans le temps'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Carnet de Santé</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Votre partenaire santé au quotidien. Une solution moderne et sécurisée 
              pour gérer votre santé et vos rendez-vous médicaux.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">
                Confidentialité
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Contact
              </a>
            </div>
            <p className="text-gray-500 text-sm mt-8">
              © 2024 Carnet de Santé. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage