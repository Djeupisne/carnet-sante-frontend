import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Users, Clock, DollarSign, X, Check, Bell, ChevronRight } from 'lucide-react';
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

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface DoctorUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialty?: string;
}

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const doctorUser = user as DoctorUser;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'today' | 'pending' | 'upcoming'>('pending');
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
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
        apt.doctorId === user?.id && 
        apt.status !== 'completed' && 
        apt.status !== 'cancelled'
      );
      
      console.log(`✅ ${doctorAppointments.length} rendez-vous actifs trouvés`);
      setAppointments(doctorAppointments);
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
      setStats(statsResponse.data.stats);
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

  // ============================================
  // STATISTIQUES
  // ============================================

  const statCards: StatCard[] = [
    {
      title: "Rendez-vous aujourd'hui",
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Total rendez-vous',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'Patients totaux',
      value: stats.totalPatients,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'En attente',
      value: appointments.filter(a => a.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-500',
    },
  ];

  // ============================================
  // RENDU
  // ============================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dr. {doctorUser?.firstName} {doctorUser?.lastName}
          </h1>
          <p className="text-gray-600">
            Tableau de bord médical - {doctorUser?.specialty || 'Médecin'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {appointments.filter(a => a.status === 'pending').length}
          </span>
        </div>
      </div>

      {/* ERREUR */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DEMANDES DE RENDEZ-VOUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Demandes de rendez-vous
            </h3>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  filter === 'pending' 
                    ? 'bg-yellow-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                En attente ({appointments.filter(a => a.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('today')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  filter === 'today' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  filter === 'upcoming' 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                À venir
              </button>
            </div>
          </div>

          {appointmentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>Aucune demande de rendez-vous</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => {
                const { date, time, day } = formatDateTime(apt.appointmentDate);
                return (
                  <div
                    key={apt.id}
                    className={`border rounded-lg p-4 transition ${
                      apt.status === 'pending' 
                        ? 'border-yellow-200 bg-yellow-50' 
                        : apt.status === 'confirmed'
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {apt.patient?.firstName?.[0]}{apt.patient?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {apt.patient?.firstName} {apt.patient?.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {apt.patient?.phoneNumber || 'Tél. non renseigné'}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium capitalize">{day} {date}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Heure</p>
                            <p className="font-medium">{time}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500">Motif</p>
                            <p className="text-gray-700">{apt.reason}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            apt.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : apt.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {apt.status === 'pending' && '⏳ En attente de confirmation'}
                            {apt.status === 'confirmed' && '✅ Confirmé'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirmAppointment(apt.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" />
                              Confirmer
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Refuser
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <Link
                            to={`/appointments/${apt.id}`}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                          >
                            Voir détails
                            <ChevronRight className="w-4 h-4" />
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

        {/* ACTIONS RAPIDES */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actions rapides
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/doctor/calendar'}
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                <span>Gérer mes disponibilités</span>
              </div>
            </button>
            <Link
              to="/doctor/patients"
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center"
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-3" />
                <span>Voir mes patients</span>
              </div>
            </Link>
            <Link
              to="/doctor/appointments"
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center"
            >
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                <span>Tous les rendez-vous</span>
              </div>
            </Link>
          </div>

          {/* STATISTIQUES RAPIDES */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Statistiques du jour</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">En attente</span>
                <span className="font-semibold text-yellow-600">
                  {appointments.filter(a => a.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Confirmés aujourd'hui</span>
                <span className="font-semibold text-green-600">
                  {appointments.filter(a => 
                    a.status === 'confirmed' && 
                    new Date(a.appointmentDate).toDateString() === new Date().toDateString()
                  ).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taux de confirmation</span>
                <span className="font-semibold text-blue-600">
                  {appointments.length > 0 
                    ? Math.round((appointments.filter(a => a.status === 'confirmed').length / appointments.length) * 100) 
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GESTION DU CALENDRIER */}
      <CalendarManagement />
    </div>
  );
};

export default DoctorDashboard;
