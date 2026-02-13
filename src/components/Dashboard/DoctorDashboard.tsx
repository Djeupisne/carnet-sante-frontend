import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { appointmentService } from '../../services/appointmentService';
import { 
  Calendar, 
  Users, 
  Clock, 
  DollarSign, 
  X, 
  Check, 
  Bell, 
  ChevronRight,
  Activity,
  TrendingUp,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import CalendarManagement from './CalendarManagement';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  type: 'in_person' | 'teleconsultation' | 'home_visit';
  reason: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
}

interface DoctorUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialty?: string;
  consultationPrice?: number;
}

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const doctorUser = user as DoctorUser;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'today' | 'pending' | 'upcoming' | 'all'>('pending');
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    completedAppointments: 0,
    revenue: 0
  });

  // ============================================
  // RÉCUPÉRATION DES DONNÉES
  // ============================================

  const fetchAppointments = async () => {
    if (!user?.id) return;
    try {
      setAppointmentsLoading(true);
      console.log('🔄 Chargement des rendez-vous pour le médecin...');
      const data = await appointmentService.getAppointments();
      
      if (!data || !Array.isArray(data)) {
        console.warn('⚠️ Format de données invalide');
        setAppointments([]);
        return;
      }

      const doctorAppointments = data.filter(apt => 
        apt.doctorId === user?.id
      );
      
      console.log(`✅ ${doctorAppointments.length} rendez-vous trouvés`);
      setAppointments(doctorAppointments);
      
      // Calculer les statistiques avancées
      const completed = doctorAppointments.filter(a => a.status === 'completed').length;
      const revenue = completed * (doctorUser?.consultationPrice || 50);
      
      setStats(prev => ({
        ...prev,
        completedAppointments: completed,
        revenue: revenue
      }));
      
    } catch (error) {
      console.error('❌ Erreur chargement rendez-vous:', error);
      showNotification('Erreur lors du chargement des rendez-vous', 'error');
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsResponse = await userService.getDashboardStats();
      setStats(prev => ({ ...prev, ...statsResponse.data.stats }));
    } catch (error) {
      console.error('❌ Erreur chargement statistiques:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchStats();
        await fetchAppointments();
      } catch (error: any) {
        console.error('❌ Erreur lors de la récupération des données:', error);
        setError(error.message || 'Impossible de charger les données.');
        
        // Données simulées en cas d'erreur
        setStats({
          totalAppointments: 24,
          todayAppointments: 5,
          totalPatients: 12,
          completedAppointments: 18,
          revenue: 900
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // ============================================
  // GESTION DES RENDEZ-VOUS
  // ============================================

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.confirmAppointment(appointmentId);
      showNotification('✅ Rendez-vous confirmé ! Le patient a été notifié.', 'success');
      await fetchAppointments();
      await fetchStats();
    } catch (error) {
      console.error('❌ Erreur confirmation:', error);
      showNotification('❌ Erreur lors de la confirmation', 'error');
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;
    try {
      await appointmentService.cancelAppointment(appointmentId, 'Annulé par le médecin');
      showNotification('✅ Rendez-vous annulé', 'success');
      await fetchAppointments();
      await fetchStats();
    } catch (error) {
      console.error('❌ Erreur annulation:', error);
      showNotification('❌ Erreur lors de l\'annulation', 'error');
    }
  };

  // ============================================
  // FILTRES ET FORMATAGE
  // ============================================

  const filteredAppointments = appointments.filter(apt => {
    const now = new Date();
    const aptDate = new Date(apt.appointmentDate);
    
    switch(filter) {
      case 'today':
        return aptDate.toDateString() === now.toDateString();
      case 'pending':
        return apt.status === 'pending';
      case 'upcoming':
        return aptDate > now && apt.status === 'confirmed';
      case 'all':
      default:
        return true;
    }
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      day: date.toLocaleDateString('fr-FR', { weekday: 'long' })
    };
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { class: 'badge-warning', text: '⏳ En attente', icon: Clock },
      confirmed: { class: 'badge-success', text: '✅ Confirmé', icon: Check },
      completed: { class: 'badge-info', text: '✓ Terminé', icon: Check },
      cancelled: { class: 'badge-danger', text: '✕ Annulé', icon: X },
      no_show: { class: 'badge-danger', text: '⚠️ Non honoré', icon: AlertCircle }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  // ============================================
  // RENDU
  // ============================================

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
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">🏥</span>
              </div>
              <div>
                <h1 className="text-2xl font-black gradient-text">NEXUS HEALTH</h1>
                <p className="text-xs text-gray-500">Espace Médecin</p>
              </div>
            </div>

            {/* Stats Badge */}
            <div className="flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
              <span className="text-sm font-semibold text-primary-700">
                {appointments.filter(a => a.status === 'pending').length} en attente
              </span>
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
                Dr. {doctorUser?.firstName} {doctorUser?.lastName} 👨‍⚕️
              </h1>
              <p className="text-gray-600 text-lg flex items-center">
                <span className="badge badge-primary mr-3">{doctorUser?.specialty || 'Médecin généraliste'}</span>
                <span className="flex items-center text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {stats.totalPatients} patients
                </span>
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Consultation</p>
                <p className="text-3xl font-bold text-gray-900">{doctorUser?.consultationPrice || 50}€</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center animate-float">
                <span className="text-3xl">👨‍⚕️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 animate-slide-in">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Aujourd'hui</p>
            <p className="text-xs text-gray-500 mt-1">Rendez-vous du jour</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-3xl font-bold text-yellow-600">
                {appointments.filter(a => a.status === 'pending').length}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700">En attente</p>
            <p className="text-xs text-gray-500 mt-1">À confirmer</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-green-600">{stats.totalPatients}</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Patients</p>
            <p className="text-xs text-gray-500 mt-1">Depuis le début</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-purple-600">{stats.revenue}€</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Revenus</p>
            <p className="text-xs text-gray-500 mt-1">Consultations terminées</p>
          </div>
        </div>

        {/* Appointments Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 modern-card p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="section-title gradient-text">
                  Demandes de rendez-vous
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  Gérez les demandes de vos patients
                </p>
              </div>
              
              {/* Filters */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mt-4 md:mt-0">
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === 'pending' 
                      ? 'bg-white text-yellow-700 shadow-md' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ⏳ En attente ({appointments.filter(a => a.status === 'pending').length})
                </button>
                <button
                  onClick={() => setFilter('today')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === 'today' 
                      ? 'bg-white text-blue-700 shadow-md' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📅 Aujourd'hui
                </button>
                <button
                  onClick={() => setFilter('upcoming')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === 'upcoming' 
                      ? 'bg-white text-green-700 shadow-md' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📆 À venir
                </button>
              </div>
            </div>

            {appointmentsLoading ? (
              <div className="flex justify-center py-12">
                <div className="loader"></div>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Aucune demande en attente
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Vous n'avez pas de nouvelles demandes de rendez-vous pour le moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => {
                  const { date, time, day } = formatDateTime(apt.appointmentDate);
                  const statusBadge = getStatusBadge(apt.status);
                  const StatusIcon = statusBadge.icon;
                  
                  return (
                    <div
                      key={apt.id}
                      className="group bg-gradient-to-r from-white to-gray-50/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            {/* Patient Avatar */}
                            <div className="relative">
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {apt.patient?.firstName?.[0]}{apt.patient?.lastName?.[0]}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full"></div>
                            </div>

                            {/* Patient Info */}
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-3">
                                <h3 className="text-lg font-bold text-gray-900">
                                  {apt.patient?.firstName} {apt.patient?.lastName}
                                </h3>
                                <span className={`badge ${statusBadge.class} flex items-center`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusBadge.text}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Date</p>
                                    <p className="text-sm font-semibold text-gray-900 capitalize">{day} {date}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Heure</p>
                                    <p className="text-sm font-semibold text-gray-900">{time}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Activity className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Motif</p>
                                    <p className="text-sm font-semibold text-gray-900">{apt.reason}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {apt.patient?.phoneNumber && (
                                <div className="mt-3 text-sm text-gray-500 flex items-center">
                                  <span className="mr-2">📞</span>
                                  {apt.patient.phoneNumber}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row lg:flex-col gap-2 lg:ml-4">
                          {apt.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleConfirmAppointment(apt.id)}
                                className="btn btn-success flex-1 lg:flex-none"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Confirmer
                              </button>
                              <button
                                onClick={() => handleCancelAppointment(apt.id)}
                                className="btn btn-outline flex-1 lg:flex-none border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Refuser
                              </button>
                            </>
                          )}
                          {apt.status === 'confirmed' && (
                            <Link
                              to={`/appointments/${apt.id}`}
                              className="btn btn-primary flex-1 lg:flex-none"
                            >
                              Voir détails
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="modern-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full mr-3"></span>
                Actions rapides
              </h3>
              <div className="space-y-3">
                <Link
                  to="/doctor/calendar"
                  className="group w-full p-4 bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Gérer mes disponibilités</p>
                      <p className="text-xs text-gray-500">Définir vos créneaux</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  to="/doctor/patients"
                  className="group w-full p-4 bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Voir mes patients</p>
                      <p className="text-xs text-gray-500">Liste et historique</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  to="/doctor/appointments"
                  className="group w-full p-4 bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition">
                      <Activity className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Tous les rendez-vous</p>
                      <p className="text-xs text-gray-500">Historique complet</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>

            {/* Daily Statistics */}
            <div className="modern-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-1.5 h-6 bg-gradient-to-b from-secondary-500 to-primary-500 rounded-full mr-3"></span>
                Statistiques du jour
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">En attente</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-600">
                    {appointments.filter(a => a.status === 'pending').length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Confirmés aujourd'hui</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    {appointments.filter(a => 
                      a.status === 'confirmed' && 
                      new Date(a.appointmentDate).toDateString() === new Date().toDateString()
                    ).length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Taux de confirmation</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    {appointments.length > 0 
                      ? Math.round((appointments.filter(a => a.status === 'confirmed').length / appointments.length) * 100) 
                      : 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Revenus du jour</span>
                  </div>
                  <span className="text-xl font-bold text-purple-600">
                    {appointments
                      .filter(a => a.status === 'completed' && new Date(a.appointmentDate).toDateString() === new Date().toDateString())
                      .length * (doctorUser?.consultationPrice || 50)}€
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Consultation</span>
                  <span className="text-lg font-bold text-gray-900">{doctorUser?.consultationPrice || 50}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Management */}
        <div className="mt-8">
          <CalendarManagement />
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
