import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { useAuth } from './context/AuthContext'

// Pages
import HomePage from './pages/HomePage'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import PatientDashboard from './components/Dashboard/PatientDashboard'
import DoctorDashboard from './components/Dashboard/DoctorDashboard' // ✅ AJOUTER CET IMPORT !
import AppointmentList from './components/Appointments/AppointmentList'
import BookAppointment from './components/Appointments/BookAppointment'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import NotFoundPage from './pages/NotFoundPage'

// ✅ COMPOSANT DE REDIRECTION SELON LE RÔLE
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // ✅ Redirection intelligente selon le rôle
  return user.role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />;
}

// Composant HomePage avec navigation (inchangé)
const HomePageWithNavigation: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
                    <DashboardRouter />
                  </ProtectedRoute>
                } 
              />
              
              {/* ✅ ROUTES PATIENT UNIQUEMENT */}
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
              
              {/* ✅ ROUTES MÉDECIN UNIQUEMENT */}
              <Route 
                path="/doctor/appointments" 
                element={
                  <ProtectedRoute>
                    <div>Page des rendez-vous médecin</div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/doctor/calendar" 
                element={
                  <ProtectedRoute>
                    <div>Gestion du calendrier</div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes protégées génériques */}
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
