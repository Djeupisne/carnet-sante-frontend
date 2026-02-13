import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

// Pages
import HomePage from './pages/HomePage'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import PatientDashboard from './components/Dashboard/PatientDashboard'
import DoctorDashboard from './components/Dashboard/DoctorDashboard' // ✅ IMPORTANT !
import AppointmentList from './components/Appointments/AppointmentList'
import BookAppointment from './components/Appointments/BookAppointment'
import ProtectedRoute from './components/Auth/ProtectedRoute' // ✅ DÉJÀ CORRECT
import NotFoundPage from './pages/NotFoundPage'

// ✅ COMPOSANT DE REDIRECTION SELON LE RÔLE
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  console.log('🔐 DashboardRouter - User:', {
    id: user?.id,
    role: user?.role,
    name: `${user?.firstName || ''} ${user?.lastName || ''}`
  });
  
  if (!user) return null;
  
  // ✅ REDIRECTION INTELLIGENTE
  if (user.role === 'doctor' || user.role === 'admin' || user.role === 'hospital_admin') {
    console.log('👨‍⚕️ Affichage du DoctorDashboard');
    return <DoctorDashboard />;
  }
  
  console.log('👤 Affichage du PatientDashboard');
  return <PatientDashboard />;
}

// Composant HomePage avec navigation
const HomePageWithNavigation: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth();

  // ✅ Redirection si déjà connecté
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* VOTRE CODE HOMEPAGE ICI */}
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
        {/* ... */}
      </nav>
      {/* ... reste du code HomePage ... */}
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
              {/* Routes publiques */}
              <Route path="/" element={<HomePageWithNavigation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* ✅ ROUTE DASHBOARD - DYNAMIQUE SELON LE RÔLE */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardRouter /> {/* ← ICI LA MAGIE OPÈRE ! */}
                  </ProtectedRoute>
                } 
              />
              
              {/* ✅ ROUTES PATIENT */}
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
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Retour
                        </button>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* ✅ ROUTES MÉDECIN */}
              <Route 
                path="/doctor/appointments" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestion des rendez-vous</h1>
                        <p className="text-gray-600">Page réservée aux médecins</p>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/doctor/calendar" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestion du calendrier</h1>
                        <p className="text-gray-600">Page réservée aux médecins</p>
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
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
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Retour
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
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Retour
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
