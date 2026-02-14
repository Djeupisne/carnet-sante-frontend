import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import DoctorCalendarPage from './pages/DoctorCalendarPage';
import DoctorPatientsPage from './pages/DoctorPatientsPage';
import DoctorAppointmentsPage from './pages/DoctorAppointmentsPage';
// Pages
import HomePage from './pages/HomePage'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import PatientDashboard from './components/Dashboard/PatientDashboard'
import DoctorDashboard from './components/Dashboard/DoctorDashboard'
import AppointmentList from './components/Appointments/AppointmentList'
import BookAppointment from './components/Appointments/BookAppointment'
import AppointmentDetails from './pages/AppointmentDetails'  // ✅ NOUVEL IMPORT
import ProtectedRoute from './components/Auth/ProtectedRoute'
import NotFoundPage from './pages/NotFoundPage'

// ✅ COMPOSANT DE REDIRECTION RACINE
const RootRouter: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  console.log('🎯 RootRouter - isLoading:', isLoading, 'user:', user?.email);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ✅ Si connecté → dashboard, sinon → home
  return user ? <Navigate to="/dashboard" replace /> : <HomePage />;
}

// ✅ COMPOSANT DE REDIRECTION SELON LE RÔLE
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  console.log('🔐 DashboardRouter - User:', {
    id: user?.id,
    role: user?.role,
    name: `${user?.firstName || ''} ${user?.lastName || ''}`,
    email: user?.email
  });
  
  if (!user) {
    console.log('❌ Pas d\'utilisateur, redirection vers login');
    return <Navigate to="/login" replace />;
  }
  
  // ✅ REDIRECTION INTELLIGENTE
  if (user.role === 'doctor' || user.role === 'admin' || user.role === 'hospital_admin') {
    console.log('👨‍⚕️ Affichage du DoctorDashboard');
    return <DoctorDashboard />;
  }
  
  console.log('👤 Affichage du PatientDashboard');
  return <PatientDashboard />;
}

function App() {
  return (
    <Provider store={store}>
      <NotificationProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* ✅ ROUTE RACINE - Redirection intelligente */}
              <Route path="/" element={<RootRouter />} />
              
              {/* Routes publiques */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* ✅ ROUTE DASHBOARD - Dynamique selon le rôle */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } 
              />
              <Route 
  path="/doctor/calendar" 
  element={
    <ProtectedRoute>
      <DoctorCalendarPage />
    </ProtectedRoute>
  } 
/>
              {/* Routes patient */}
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
              
              {/* ✅ NOUVELLE ROUTE - Détails du rendez-vous */}
              <Route 
                path="/appointments/:id" 
                element={
                  <ProtectedRoute>
                    <AppointmentDetails />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes médecin */}
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
  path="/doctor/patients" 
  element={
    <ProtectedRoute>
      <DoctorPatientsPage />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/doctor/appointments" 
  element={
    <ProtectedRoute>
      <DoctorAppointmentsPage />
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
