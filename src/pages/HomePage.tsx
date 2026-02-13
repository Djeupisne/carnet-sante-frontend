import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Calendar, 
  Building2, 
  Bell, 
  Stethoscope, 
  Pill, 
  LineChart,
  Shield,
  ChevronRight,
  Sparkles,
  HeartPulse
} from 'lucide-react'

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()

  const features = [
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      title: 'Gestion des rendez-vous',
      description: 'Prenez, modifiez ou annulez vos rendez-vous en ligne facilement',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Building2 className="w-8 h-8 text-purple-600" />,
      title: 'Dossier médical numérique',
      description: 'Accédez à votre dossier médical complet en quelques clics',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Bell className="w-8 h-8 text-green-600" />,
      title: 'Rappels intelligents',
      description: 'Recevez des rappels pour vos rendez-vous et traitements',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-orange-600" />,
      title: 'Réseau de médecins',
      description: 'Trouvez et consultez des professionnels de santé qualifiés',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: <Pill className="w-8 h-8 text-indigo-600" />,
      title: 'Gestion des traitements',
      description: 'Suivez vos médicaments et traitements au quotidien',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <LineChart className="w-8 h-8 text-teal-600" />,
      title: 'Analyses et suivis',
      description: "Visualisez l'évolution de votre santé dans le temps",
      gradient: 'from-teal-500 to-cyan-500'
    }
  ]

  const stats = [
    { value: '10k+', label: 'Patients satisfaits', icon: '👥' },
    { value: '500+', label: 'Médecins partenaires', icon: '👨‍⚕️' },
    { value: '50k+', label: 'Rendez-vous par mois', icon: '📅' },
    { value: '4.9/5', label: 'Note moyenne', icon: '⭐' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation améliorée */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo avec icône */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-all"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Carnet de Santé
                </h1>
                <p className="text-xs text-gray-500">Votre santé, notre priorité</p>
              </div>
            </div>

            {/* Navigation desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Fonctionnalités
              </a>
              <a href="#stats" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Statistiques
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Contact
              </a>
            </div>

            {/* Boutons de connexion */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Bonjour, {user?.firstName}
                  </span>
                  <Link
                    to="/dashboard"
                    className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-600/25 transition-all hover:scale-105"
                  >
                    <span>Tableau de bord</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-blue-50"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-600/25 transition-all hover:scale-105"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section améliorée */}
      <div className="relative overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-blue-100/50 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100/50 to-transparent rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4" />
              <span>La plateforme de santé la plus fiable</span>
            </div>

            {/* Titre principal */}
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Votre santé,
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                simplifiée et connectée
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Gérez vos rendez-vous médicaux, consultez votre dossier de santé et 
              suivez votre parcours médical en toute simplicité, où que vous soyez.
            </p>

            {/* Boutons CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-lg font-semibold hover:shadow-2xl hover:shadow-blue-600/30 transition-all hover:scale-105"
                  >
                    <span>Commencer gratuitement</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-2xl text-lg font-semibold border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all hover:shadow-lg"
                  >
                    <span>Se connecter</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-lg font-semibold hover:shadow-2xl hover:shadow-blue-600/30 transition-all hover:scale-105"
                >
                  <span>Accéder au tableau de bord</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section améliorée */}
      <div id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète et intuitive pour gérer votre santé au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                {/* Gradient overlay au survol */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                
                {/* Icône avec effet */}
                <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} bg-opacity-10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl"></div>
                  <div className="relative">
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Lien subtil */}
                <div className="mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                  <span>En savoir plus</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section CTA */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Prêt à prendre soin de votre santé ?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers de patients et médecins qui utilisent déjà notre plateforme
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-2xl text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all"
          >
            <span>Créer un compte gratuitement</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Footer amélioré */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Colonne 1 - Logo */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-xl">
                  <HeartPulse className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Carnet de Santé</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Votre partenaire santé au quotidien. Une solution moderne et sécurisée 
                pour gérer votre santé.
              </p>
            </div>

            {/* Colonne 2 - Produit */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Produit</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Fonctionnalités</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Tarifs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
              </ul>
            </div>

            {/* Colonne 3 - Légal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Légal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Confidentialité</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Conditions d'utilisation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Mentions légales</a></li>
              </ul>
            </div>

            {/* Colonne 4 - Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="text-gray-400">support@carnetsante.fr</li>
                <li className="text-gray-400">01 23 45 67 89</li>
                <li className="text-gray-400">Paris, France</li>
              </ul>
            </div>
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-800 my-12"></div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>© 2024 Carnet de Santé. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Mentions légales</a>
              <a href="#" className="hover:text-white transition">CGU</a>
              <a href="#" className="hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
