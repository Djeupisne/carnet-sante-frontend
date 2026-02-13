import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { calendarService } from '../../services/calendarService';
import { userService } from '../../services/userService';
import { appointmentService } from '../../services/appointmentService';
import { X, Check, CreditCard, Calendar, Clock, User, ChevronRight, ArrowLeft, Bell, DollarSign } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  available: boolean;
  availableSlots: string[];
  consultationPrice?: number;
}

interface Calendar {
  id: string;
  date: string;
  slots: string[];
  confirmed: boolean;
  doctor: { firstName: string; lastName: string };
}

interface Appointment {
  id: string;
  doctor: { firstName: string; lastName: string; specialty: string };
  appointmentDate: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  type: 'in_person' | 'teleconsultation' | 'home_visit';
  reason: string;
}

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    type: 'in_person' as 'in_person' | 'teleconsultation' | 'home_visit',
    symptoms: ''
  });
  const [cardInfo, setCardInfo] = useState({ 
    number: '', 
    date: '', 
    cvv: '' 
  });

  const medicalSummary = {
    allergies: 2,
    medications: 3,
    conditions: 1,
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const loadAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;
    setIsLoadingSlots(true);
    setAvailableSlots([]);
    setSelectedTime('');
    try {
      const slots = await appointmentService.getDoctorAvailableSlots(selectedDoctor.id, selectedDate);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Erreur chargement créneaux:', error);
      setAvailableSlots(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const fetchAppointments = async () => {
    if (!user?.id) {
      setAppointmentsLoading(false);
      return;
    }
    try {
      setAppointmentsLoading(true);
      console.log('🔄 Chargement des rendez-vous depuis le service...');
      const appointments = await appointmentService.getAppointments();
      console.log('📋 Rendez-vous reçus du service:', appointments);
      
      if (!appointments || !Array.isArray(appointments)) {
        console.warn('⚠️ Les rendez-vous ne sont pas un tableau:', appointments);
        setUpcomingAppointments([]);
        return;
      }
      if (appointments.length === 0) {
        console.log('ℹ️ Aucun rendez-vous trouvé');
        setUpcomingAppointments([]);
        return;
      }
      
      const transformedAppointments: Appointment[] = appointments.map((apt: any, index: number) => {
        return {
          id: apt.id || `temp-${index}`,
          doctor: {
            firstName: apt.doctor?.firstName || apt.doctorId || 'Docteur',
            lastName: apt.doctor?.lastName || '',
            specialty: apt.doctor?.specialty || 'Généraliste'
          },
          appointmentDate: apt.appointmentDate || new Date().toISOString(),
          duration: apt.duration || 30,
          status: apt.status || 'pending',
          type: apt.type || 'in_person',
          reason: apt.reason || 'Consultation médicale'
        };
      });
      
      console.log('🔄 Filtrage des rendez-vous à venir...');
      const now = new Date();
      const upcoming = transformedAppointments.filter(apt => {
        try {
          const appointmentDate = new Date(apt.appointmentDate);
          const isValidDate = !isNaN(appointmentDate.getTime());
          const isFuture = appointmentDate >= now;
          const isActive = apt.status !== 'cancelled' && apt.status !== 'completed';
          return isValidDate && isFuture && isActive;
        } catch (error) {
          console.warn('❌ Date de rendez-vous invalide:', apt.appointmentDate);
          return false;
        }
      });
      
      console.log('✅ Rendez-vous à venir filtrés:', upcoming);
      setUpcomingAppointments(upcoming);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des rendez-vous:', err);
      setUpcomingAppointments([]);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Chargement des médecins...');
        const doctorsData = await appointmentService.getDoctors();
        console.log('👨‍⚕️ Médecins reçus:', doctorsData);
        
        const fetchedDoctors: Doctor[] = doctorsData.map((d: any) => ({
          id: d.id,
          firstName: d.firstName,
          lastName: d.lastName,
          specialty: d.specialty || 'Non spécifié',
          available: d.isActive !== false,
          availableSlots: d.availableSlots || ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
          consultationPrice: d.consultationPrice || 50
        }));
        
        setDoctors(fetchedDoctors);
        setCalendars([]);
        await fetchAppointments();
      } catch (err) {
        console.error('❌ Erreur lors de la récupération des données:', err);
        setError('Impossible de charger les données. Utilisation des données de secours.');
        const mockDoctors: Doctor[] = [
          { 
            id: '1', 
            firstName: 'Marie', 
            lastName: 'Dubois', 
            specialty: 'Cardiologie', 
            available: true, 
            availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
            consultationPrice: 60
          },
          { 
            id: '2', 
            firstName: 'Pierre', 
            lastName: 'Martin', 
            specialty: 'Dermatologie', 
            available: true, 
            availableSlots: ['10:30', '14:00', '16:00'],
            consultationPrice: 55
          },
          { 
            id: '3', 
            firstName: 'Sophie', 
            lastName: 'Laurent', 
            specialty: 'Neurologie', 
            available: false, 
            availableSlots: [],
            consultationPrice: 70
          },
        ];
        setDoctors(mockDoctors);
        setCalendars([]);
        setUpcomingAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const formatAppointmentDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return 'Date invalide';
    }
  };

  const formatAppointmentTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Heure invalide';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      confirmed: '✓ Confirmé',
      pending: '⏳ En attente',
      scheduled: '📅 Planifié',
      completed: '✅ Terminé',
      cancelled: '✕ Annulé',
      no_show: '⚠️ Non honoré'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusClass = (status: string) => {
    const classMap = {
      confirmed: 'badge-success',
      pending: 'badge-warning',
      scheduled: 'badge-info',
      completed: 'badge-gray',
      cancelled: 'badge-danger',
      no_show: 'badge-danger'
    };
    return classMap[status as keyof typeof classMap] || 'badge-gray';
  };

  const handleBookingClick = (doctor: Doctor) => {
    if (!doctor.available) return;
    handleBookingModal(doctor);
  };

  const handleBookingModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
    setBookingStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setAvailableSlots([]);
    setBookingConfirmed(false);
    setCardInfo({ number: '', date: '', cvv: '' });
    setFormData({ reason: '', type: 'in_person', symptoms: '' });
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleConfirmDoctor = () => {
    if (formData.reason.trim().length < 5) {
      showNotification('Veuillez décrire le motif de votre consultation', 'error');
      return;
    }
    setBookingStep(2);
  };

  const handleConfirmTime = () => {
    if (selectedTime) setBookingStep(3);
  };

  const handlePayment = async () => {
    if (!cardInfo.number || !cardInfo.date || !cardInfo.cvv) {
      showNotification('Veuillez remplir tous les champs de paiement', 'error');
      return;
    }
    if (!selectedDoctor || !selectedDate || !selectedTime || !formData.reason) {
      showNotification('Informations de rendez-vous incomplètes', 'error');
      return;
    }
    try {
      const appointmentData = {
        doctorId: selectedDoctor.id,
        appointmentDate: `${selectedDate}T${selectedTime}:00`,
        duration: 30,
        type: formData.type,
        reason: formData.reason,
        notes: formData.symptoms || ''
      };
      await appointmentService.createAppointment(appointmentData);
      setBookingConfirmed(true);
      showNotification('✅ Rendez-vous confirmé ! Le médecin sera notifié.', 'success');
      setTimeout(() => {
        setShowBooking(false);
        setSelectedDoctor(null);
        setBookingStep(1);
        setSelectedDate('');
        setSelectedTime('');
        setCardInfo({ number: '', date: '', cvv: '' });
        setFormData({ reason: '', type: 'in_person', symptoms: '' });
        fetchAppointments();
      }, 2000);
    } catch (error) {
      console.error('❌ Erreur lors de la création du rendez-vous:', error);
      showNotification('Erreur lors de la réservation. Veuillez réessayer.', 'error');
    }
  };

  const closeBooking = () => {
    setShowBooking(false);
    setSelectedDoctor(null);
    setBookingStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setBookingConfirmed(false);
    setCardInfo({ number: '', date: '', cvv: '' });
    setFormData({ reason: '', type: 'in_person', symptoms: '' });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Modern Navigation */}
      <header className="modern-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">⚕️</span>
              </div>
              <div>
                <h1 className="text-2xl font-black gradient-text">NEXUS HEALTH</h1>
                <p className="text-xs text-gray-500">Espace Patient</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link to="/dashboard" className="nav-link active">
                📊 Tableau de bord
              </Link>
              <Link to="/appointments" className="nav-link">
                📅 Rendez-vous
              </Link>
              <Link to="/medical-file" className="nav-link">
                📋 Dossier médical
              </Link>
              <Link to="/profile" className="nav-link">
                👤 Profil
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="avatar">
                  <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Patient</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="btn btn-outline"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="glass-card p-8 mb-8 animate-slide-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                Bonjour, <span className="gradient-text">{user?.firstName}</span> 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Nous sommes heureux de vous retrouver. Comment allez-vous aujourd'hui ?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center animate-float">
                <span className="text-5xl">🏥</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 animate-slide-in">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Doctors Availability */}
        <div className="modern-card p-6 md:p-8 mb-8 animate-slide-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="section-title gradient-text">
                Médecins disponibles
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {doctors.length} praticiens disponibles pour vous recevoir
              </p>
            </div>
            <div className="bg-primary-50 rounded-full px-4 py-2 mt-4 md:mt-0">
              <span className="text-sm font-semibold text-primary-600 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Consultation à partir de 50€
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loader"></div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-gray-400">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun médecin disponible</h3>
              <p className="text-gray-500">Veuillez réessayer ultérieurement</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Médecin</th>
                    <th>Spécialité</th>
                    <th>Disponibilité</th>
                    <th>Créneaux</th>
                    <th>Prix</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="group">
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar avatar-sm bg-gradient-to-br from-blue-500 to-cyan-500">
                            <span className="text-xs">👨‍⚕️</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Dr. {doctor.firstName} {doctor.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">
                          {doctor.specialty}
                        </span>
                      </td>
                      <td>
                        {doctor.available ? (
                          <span className="badge badge-success">
                            <span className="status-dot success"></span>
                            Disponible
                          </span>
                        ) : (
                          <span className="badge badge-gray">
                            <span className="status-dot"></span>
                            Non disponible
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="font-medium text-gray-900">
                          {doctor.availableSlots?.length || 0} créneaux
                        </span>
                      </td>
                      <td>
                        <span className="text-lg font-bold text-gray-900">
                          {doctor.consultationPrice}€
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleBookingClick(doctor)}
                          disabled={!doctor.available}
                          className={`btn ${
                            doctor.available ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {doctor.available ? (
                            <>
                              Prendre RDV
                              <ChevronRight className="w-4 h-4" />
                            </>
                          ) : (
                            'Indisponible'
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Appointments & Medical Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 modern-card p-6 animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="section-title gradient-text">
                  Rendez-vous à venir
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Vos prochaines consultations
                </p>
              </div>
              <Link to="/appointments" className="btn btn-outline">
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {appointmentsLoading ? (
              <div className="flex justify-center py-12">
                <div className="loader"></div>
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-gray-400">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun rendez-vous
                </h3>
                <p className="text-gray-500 mb-6">
                  Prenez votre premier rendez-vous en ligne
                </p>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="btn btn-primary"
                >
                  Prendre rendez-vous
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="group bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="avatar avatar-sm bg-gradient-to-r from-primary-500 to-secondary-500">
                            👨‍⚕️
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {appointment.doctor.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                            {formatAppointmentDate(appointment.appointmentDate)}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-secondary-500" />
                            {formatAppointmentTime(appointment.appointmentDate)}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">⏱️</span>
                            {appointment.duration} min
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className={`badge ${getStatusClass(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/appointments/${appointment.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition group-hover:bg-white"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Summary */}
          <div className="modern-card p-6 animate-slide-in">
            <h2 className="section-title gradient-text mb-6">
              Résumé médical
            </h2>
            
            <div className="space-y-4">
              {[
                { 
                  label: 'Allergies', 
                  value: medicalSummary.allergies, 
                  icon: '🚫', 
                  color: 'from-red-400 to-pink-500',
                  bg: 'bg-red-50'
                },
                { 
                  label: 'Médicaments', 
                  value: medicalSummary.medications, 
                  icon: '💊', 
                  color: 'from-green-400 to-emerald-500',
                  bg: 'bg-green-50'
                },
                { 
                  label: 'Conditions', 
                  value: medicalSummary.conditions, 
                  icon: '⚕️', 
                  color: 'from-blue-400 to-cyan-500',
                  bg: 'bg-blue-50'
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`${item.bg} rounded-xl p-4 transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-md`}>
                        {item.icon}
                      </div>
                      <p className="font-medium text-gray-700">{item.label}</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                Dernière activité
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-sm text-gray-600">Dernière consultation</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {upcomingAppointments.length > 0 
                      ? formatAppointmentDate(upcomingAppointments[0].appointmentDate)
                      : 'Aucune'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-secondary-600" />
                    </div>
                    <span className="text-sm text-gray-600">Prochain RDV</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {upcomingAppointments.length > 0 
                      ? formatAppointmentTime(upcomingAppointments[0].appointmentDate)
                      : 'Aucun'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Bell className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-600">Rappels</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">3 actifs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal - Modern Design */}
      {showBooking && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Réserver un rendez-vous</h2>
                  <p className="text-sm text-gray-500">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                </div>
              </div>
              <button 
                onClick={closeBooking} 
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              {bookingConfirmed ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                      <Check size={40} className="text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Rendez-vous confirmé!</h3>
                  <p className="text-gray-600 mb-2">Votre paiement a été traité avec succès.</p>
                  <p className="text-gray-500 text-sm">Le médecin a été notifié de votre demande.</p>
                  <div className="mt-8 p-4 bg-primary-50 rounded-xl">
                    <p className="text-primary-700 font-medium">
                      📅 {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-primary-600">⏰ {selectedTime}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step 1: Doctor & Reason */}
                  {bookingStep === 1 && (
                    <div className="animate-fade-in">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold mr-3">1</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Motif de la consultation</h3>
                          <p className="text-sm text-gray-500">Décrivez brièvement votre besoin</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-6 mb-6 border border-primary-100">
                        <div className="flex items-center">
                          <div className="avatar avatar-lg bg-gradient-to-br from-primary-500 to-secondary-500 mr-4">
                            👨‍⚕️
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                            <p className="text-gray-600">{selectedDoctor.specialty}</p>
                            <div className="flex items-center mt-2">
                              <span className="badge badge-success">Disponible</span>
                              <span className="ml-3 text-lg font-bold text-primary-600">{selectedDoctor.consultationPrice || 50}€</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="modern-label">
                          Motif de la consultation <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.reason}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                          className="modern-input"
                          rows={4}
                          placeholder="Ex: Douleur thoracique, suivi régulier, consultation annuelle..."
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          {formData.reason.length}/500 caractères
                        </p>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button onClick={closeBooking} className="btn btn-outline">
                          Annuler
                        </button>
                        <button 
                          onClick={handleConfirmDoctor} 
                          disabled={!formData.reason || formData.reason.length < 5}
                          className={`btn ${formData.reason && formData.reason.length >= 5 ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'}`}
                        >
                          Continuer
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Date & Time */}
                  {bookingStep === 2 && (
                    <div className="animate-fade-in">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold mr-3">2</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Date et heure</h3>
                          <p className="text-sm text-gray-500">Choisissez votre créneau</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="modern-label">Date du rendez-vous</label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                          {generateDates().slice(0, 10).map((date) => {
                            const dateObj = new Date(date);
                            const isToday = date === new Date().toISOString().split('T')[0];
                            return (
                              <button
                                key={date}
                                onClick={() => handleDateSelect(date)}
                                className={`py-3 px-2 rounded-xl font-semibold transition-all ${
                                  selectedDate === date
                                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg scale-105'
                                    : isToday
                                    ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <div className="text-xs opacity-75">
                                  {dateObj.toLocaleDateString('fr-FR', { weekday: 'short' })}
                                </div>
                                <div className="text-lg font-black">
                                  {dateObj.getDate()}
                                </div>
                                <div className="text-xs opacity-75">
                                  {dateObj.toLocaleDateString('fr-FR', { month: 'short' })}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {selectedDate && (
                        <div className="mb-6">
                          <label className="modern-label">Heure du rendez-vous</label>
                          {isLoadingSlots ? (
                            <div className="flex justify-center py-8">
                              <div className="loader"></div>
                            </div>
                          ) : availableSlots.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-xl">
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-600 font-medium">Aucun créneau disponible</p>
                              <p className="text-gray-500 text-sm mt-1">Veuillez sélectionner une autre date</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                              {availableSlots.map((slot) => (
                                <button
                                  key={slot}
                                  onClick={() => setSelectedTime(slot)}
                                  className={`py-3 px-2 rounded-xl font-semibold transition-all ${
                                    selectedTime === slot
                                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg scale-105'
                                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => setBookingStep(1)} 
                          className="btn btn-outline"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Retour
                        </button>
                        <button 
                          onClick={handleConfirmTime} 
                          disabled={!selectedTime} 
                          className={`btn ${selectedTime ? 'btn-primary' : 'btn-outline opacity-50 cursor-not-allowed'}`}
                        >
                          Continuer
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {bookingStep === 3 && (
                    <div className="animate-fade-in">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold mr-3">3</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Paiement sécurisé</h3>
                          <p className="text-sm text-gray-500">Finalisez votre réservation</p>
                        </div>
                      </div>

                      {/* Summary Card */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 mb-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <span className="w-1.5 h-5 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full mr-2"></span>
                          Récapitulatif
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Médecin</span>
                            <span className="font-semibold text-gray-900">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Spécialité</span>
                            <span className="font-semibold text-gray-900">{selectedDoctor.specialty}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date</span>
                            <span className="font-semibold text-gray-900">
                              {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Heure</span>
                            <span className="font-semibold text-gray-900">{selectedTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Motif</span>
                            <span className="font-semibold text-gray-900 max-w-[200px] truncate">{formData.reason}</span>
                          </div>
                          <div className="border-t border-gray-200 my-3 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold text-gray-900">Total</span>
                              <span className="text-3xl font-black text-primary-600">{selectedDoctor.consultationPrice || 50} €</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Form */}
                      <div className="space-y-4">
                        <div>
                          <label className="modern-label">Numéro de carte</label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={cardInfo.number}
                              onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                              className="modern-input pl-10"
                              maxLength={19}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="modern-label">Date d'expiration</label>
                            <input
                              type="text"
                              placeholder="MM/AA"
                              value={cardInfo.date}
                              onChange={(e) => setCardInfo({ ...cardInfo, date: e.target.value })}
                              className="modern-input"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <label className="modern-label">CVV</label>
                            <input
                              type="password"
                              placeholder="123"
                              value={cardInfo.cvv}
                              onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                              className="modern-input"
                              maxLength={3}
                            />
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 mt-4">
                          <div className="flex items-start">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <p className="text-sm text-blue-800 ml-3">
                              Paiement sécurisé par chiffrement SSL 256-bit. Vos informations bancaires ne sont pas stockées.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-6">
                        <button 
                          onClick={() => setBookingStep(2)} 
                          className="btn btn-outline"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Retour
                        </button>
                        <button 
                          onClick={handlePayment} 
                          className="btn btn-success"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Payer {selectedDoctor.consultationPrice || 50} €
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
