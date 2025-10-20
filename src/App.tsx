import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

// Pages
import HomePage from './pages/HomePage'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import PatientDashboard from './components/Dashboard/PatientDashboard'
import AppointmentList from './components/Appointments/AppointmentList'
import BookAppointment from './components/Appointments/BookAppointment'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import NotFoundPage from './pages/NotFoundPage'

// Composant HomePage avec navigation
const HomePageWithNavigation: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Futuriste */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚕️</span>
              </div>
              <h1 className="text-2xl font-black gradient-text">
                NEXUS HEALTH
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="futuristic-btn"
              >
                Connexion
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="futuristic-btn"
              >
                Inscription
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-float">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              Votre Santé
              <br />
              <span className="gradient-text">Réinventée</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
            Découvrez l'avenir des soins médicaux avec notre plateforme intelligente. 
            <span className="text-blue-300 font-semibold"> IA, données en temps réel, et expérience immersive</span> au service de votre bien-être.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => navigate('/register')}
              className="futuristic-btn text-lg px-12 py-4 text-xl pulse-glow"
            >
              Commencer l'Expérience
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="futuristic-btn-secondary text-lg px-12 py-4 text-xl"
            >
              Accéder à mon compte
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Technologie <span className="gradient-text">Avancée</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Une suite complète d'outils médicaux intelligents pour une santé optimale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'IA Médicale',
                description: 'Diagnostics assistés par intelligence artificielle avec 99.8% de précision',
                features: ['Analyse prédictive', 'Recommandations personnalisées', 'Détection avancée']
              },
              {
                icon: '📊',
                title: 'Analytics Temps Réel',
                description: 'Surveillance continue de vos indicateurs de santé avec alertes intelligentes',
                features: ['Données en temps réel', 'Tableaux de bord interactifs', 'Tendances prédictives']
              },
              {
                icon: '🔒',
                title: 'Blockchain Health',
                description: 'Sécurité maximale grâce à la technologie blockchain pour vos données médicales',
                features: ['Chiffrement quantique', 'Accès décentralisé', 'Audit transparent']
              },
              {
                icon: '🏥',
                title: 'Télémédecine 4.0',
                description: 'Consultations holographiques et réalité augmentée pour des soins à distance',
                features: ['Réalité augmentée', 'Hologrammes 3D', 'Interface immersive']
              },
              {
                icon: '💊',
                title: 'Pharmacie Intelligente',
                description: 'Gestion automatisée des traitements avec rappels contextuels intelligents',
                features: ['Dosage adaptatif', 'Interactions détectées', 'Livraison drone']
              },
              {
                icon: '🧬',
                title: 'Génome Digital',
                description: 'Analyse ADN avancée et médecine personnalisée basée sur votre profil génétique',
                features: ['Séquençage complet', 'Risques prédictifs', 'Thérapies ciblées']
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="futuristic-card group p-8 holographic"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-white/60 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="futuristic-card p-12">
            <h2 className="text-4xl md:text-5xl font-black gradient-text mb-6">
              Prêt pour la Révolution ?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Rejoignez des milliers de patients qui ont déjà adopté l'avenir de la santé
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/register')}
                className="futuristic-btn text-lg px-12 py-4 text-xl pulse-glow"
              >
                Démarrer Maintenant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚕️</span>
            </div>
            <h2 className="text-2xl font-black gradient-text">NEXUS HEALTH</h2>
          </div>
          <p className="text-white/50 mb-8 max-w-2xl mx-auto">
            L'avenir des soins de santé, aujourd'hui. Technologie de pointe au service de l'humanité.
          </p>
          <div className="flex justify-center space-x-8 text-white/40">
            {['Confidentialité', 'Sécurité', 'Blockchain', 'IA'].map((item) => (
              <span key={item} className="hover:text-blue-300 transition cursor-pointer">
                {item}
              </span>
            ))}
          </div>
          <p className="text-white/30 text-sm mt-8">
            © 2024 Nexus Health Systems. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <NotificationProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/" element={<HomePageWithNavigation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <PatientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/appointments" 
                element={
                  <ProtectedRoute>
                    <AppointmentList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/appointments/book" 
                element={
                  <ProtectedRoute>
                    <BookAppointment />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/appointments/:id" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Détails du Rendez-vous</h1>
                        <p className="text-gray-600 mb-4">Page en cours de développement</p>
                        <button 
                          onClick={() => window.history.back()}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          Retour à la liste
                        </button>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes protégées - placeholders */}
              <Route 
                path="/medical-file" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dossier Médical</h1>
                        <p className="text-gray-600 mb-4">Page en cours de développement</p>
                        <button 
                          onClick={() => window.history.back()}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          Retour au tableau de bord
                        </button>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Mon Profil</h1>
                        <p className="text-gray-600 mb-4">Page en cours de développement</p>
                        <button 
                          onClick={() => window.history.back()}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          Retour au tableau de bord
                        </button>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </Provider>
  )
}

export default App