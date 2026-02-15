import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import DoctorCalendarPage from './pages/DoctorCalendarPage';
import DoctorPatientsPage from './pages/DoctorPatientsPage';
import DoctorAppointmentsPage from './pages/DoctorAppointmentsPage';
import AdminDashboard from './pages/AdminDashboard';
import MedicalFilePage from './pages/MedicalFilePage';
import PatientProfilePage from './pages/PatientProfilePage';
// Pages
import HomePage from './pages/HomePage'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import PatientDashboard from './components/Dashboard/PatientDashboard'
import DoctorDashboard from './components/Dashboard/DoctorDashboard'
import AppointmentList from './components/Appointments/AppointmentList'
import BookAppointment from './components/Appointments/BookAppointment'
import AppointmentDetails from './pages/AppointmentDetails'
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

// ✅ COMPOSANT DE REDIRECTION SELON LE RÔLE - CORRIGÉ
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
  
  // ✅ REDIRECTION CORRECTE SELON LE RÔLE
  if (user.role === 'admin') {
    console.log('👑 Affichage du AdminDashboard');
    return <AdminDashboard />;
  }
  
  if (user.role === 'doctor' || user.role === 'hospital_admin') {
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
              
              {/* Routes admin */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes médecin */}
              <Route 
                path="/doctor/calendar" 
                element={
                  <ProtectedRoute>
                    <DoctorCalendarPage />
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
              
              {/* Routes patient - Dossier médical et Profil (NOUVELLES ROUTES) */}
              <Route 
                path="/medical-file" 
                element={
                  <ProtectedRoute>
                    <MedicalFilePage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <PatientProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes patient - Rendez-vous */}
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
                    <AppointmentDetails />
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
