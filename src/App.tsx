import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ThemeProvider } from './context/ThemeContext'
import ContactPage from './pages/ContactPage';
// Pages statiques
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LegalPage from './pages/LegalPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';
import DocumentationPage from './pages/DocumentationPage';

// Pages et composants...
import DoctorCalendarPage from './pages/DoctorCalendarPage';
import DoctorPatientsPage from './pages/DoctorPatientsPage';
import DoctorAppointmentsPage from './pages/DoctorAppointmentsPage';
import AdminDashboard from './pages/AdminDashboard';
import PatientMedicalFilePage from './pages/PatientMedicalFilePage';
import PatientProfilePage from './pages/PatientProfilePage';
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <HomePage />;
}

// ✅ COMPOSANT DE REDIRECTION SELON LE RÔLE
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }
  
  if (user.role === 'doctor' || user.role === 'hospital_admin') {
    return <DoctorDashboard />;
  }
  
  return <PatientDashboard />;
}

function App() {
  return (
    <Provider store={store}>
      <NotificationProvider>
        <AuthProvider>
          <ThemeProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<RootRouter />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* ✅ Routes statiques (pages publiques) */}
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/legal" element={<LegalPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/docs" element={<DocumentationPage />} />
                <Route path="/contact" element={<ContactPage />} />
                {/* Dashboard */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardRouter />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Médecin */}
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
                
                {/* Patient */}
                <Route 
                  path="/medical-file" 
                  element={
                    <ProtectedRoute>
                      <PatientMedicalFilePage />
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

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </NotificationProvider>
    </Provider>
  )
}

export default App
