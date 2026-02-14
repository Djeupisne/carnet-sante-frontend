import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Users, Clock, DollarSign, X, Check, Bell, ChevronRight, LogOut } from 'lucide-react';
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
  const { user, logout } = useAuth();
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
  // GESTION DE LA DÉCONNEXION
  // ============================================

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      try {
        logout(); // La redirection vers "/" et la notification sont gérées automatiquement dans AuthContext
      } catch (error) {
        console.error('❌ Erreur lors de la déconnexion:', error);
        showNotification('❌ Erreur lors de la déconnexion', 'error');
      }
    }
  };

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
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total rendez-vous',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Patients totaux',
      value: stats.totalPatients,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'En attente',
      value: appointments.filter(a => a.status === 'pending').length,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  // ============================================
  // RENDU
  // ============================================

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* HEADER avec bouton de déconnexion */}
      <div className="futuristic-card p-6 animate-slide-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-2xl font-bold text-white">
                {doctorUser?.firstName?.[0]}{doctorUser?.lastName?.[0]}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Dr. {doctorUser?.firstName} {doctorUser?.lastName}
              </h1>
              <p className="text-gray-300 mt-1">
                {doctorUser?.specialty || 'Médecin'} • Tableau de bord médical
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Bell className="w-5 h-5 text-white" />
              </button>
              {appointments.filter(a => a.status === 'pending').length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg pulse-glow">
                  {appointments.filter(a => a.status === 'pending').length}
                </span>
              )}
            </div>
            
            {/* Bouton de déconnexion */}
            <button
              onClick={handleLogout}
              className="futuristic-btn-secondary flex items-center gap-2 hover:scale-105"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* ERREUR */}
      {error && (
        <div className="futuristic-card p-4 border-red-500/50 bg-red-500/10 animate-slide-in">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div>
              <strong className="font-bold text-red-400">Erreur: </strong>
              <span className="text-red-300">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="futuristic-card p-6 hover:scale-105 transition-transform duration-300 animate-slide-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DEMANDES DE RENDEZ-VOUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 futuristic-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              Demandes de rendez-vous
            </h3>
            <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'pending' 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                En attente ({appointments.filter(a => a.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('today')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'today' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === 'upcoming' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                À venir
              </button>
            </div>
          </div>

          {appointmentsLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-400 mt-4">Chargement des rendez-vous...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg">Aucune demande de rendez-vous</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => {
                const { date, time, day } = formatDateTime(apt.appointmentDate);
                return (
                  <div
                    key={apt.id}
                    className={`futuristic-card p-5 transition-all duration-300 hover:border-white/30 ${
                      apt.status === 'pending' 
                        ? 'border-yellow-500/50 bg-yellow-500/5' 
                        : apt.status === 'confirmed'
                        ? 'border-green-500/50 bg-green-500/5'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {apt.patient?.firstName?.[0]}{apt.patient?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-lg">
                              {apt.patient?.firstName} {apt.patient?.lastName}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {apt.patient?.phoneNumber || 'Tél. non renseigné'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Date</p>
                            <p className="font-semibold text-white capitalize">{day}</p>
                            <p className="text-sm text-gray-300">{date}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1">Heure</p>
                            <p className="font-semibold text-white text-lg">{time}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-lg p-3 mb-3">
                          <p className="text-xs text-gray-400 mb-1">Motif de consultation</p>
                          <p className="text-white">{apt.reason}</p>
                        </div>
                        
                        <div>
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            apt.status === 'pending'
                              ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30'
                              : apt.status === 'confirmed'
                              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30'
                              : 'bg-white/5 text-gray-300 border border-white/10'
                          }`}>
                            {apt.status === 'pending' && '⏳ En attente de confirmation'}
                            {apt.status === 'confirmed' && '✅ Confirmé'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 ml-6">
                        {apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirmAppointment(apt.id)}
                              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                              <Check className="w-4 h-4" />
                              Confirmer
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-red-400/50 text-red-300 hover:bg-red-500/20 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105"
                            >
                              <X className="w-4 h-4" />
                              Refuser
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <Link
                            to={`/appointments/${apt.id}`}
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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
        <div className="futuristic-card p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Actions rapides
          </h3>
          <div className="space-y-3">
           
<Link
  to="/doctor/calendar"
  className="w-full text-left p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
>
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div className="p-2 bg-blue-500/20 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
        <Calendar className="h-5 w-5 text-blue-400" />
      </div>
      <span className="text-white font-medium">Gérer mes disponibilités</span>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
  </div>
</Link>
            
            <Link
              to="/doctor/patients"
              className="w-full text-left p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-500/20 rounded-lg mr-3 group-hover:bg-purple-500/30 transition-colors">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-white font-medium">Voir mes patients</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>
            
            <Link
              to="/doctor/appointments"
              className="w-full text-left p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg mr-3 group-hover:bg-green-500/30 transition-colors">
                  <Calendar className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-white font-medium">Tous les rendez-vous</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>
          </div>

          {/* STATISTIQUES RAPIDES */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Statistiques du jour
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300 text-sm">En attente</span>
                <span className="font-bold text-yellow-400 text-lg">
                  {appointments.filter(a => a.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300 text-sm">Confirmés aujourd'hui</span>
                <span className="font-bold text-green-400 text-lg">
                  {appointments.filter(a => 
                    a.status === 'confirmed' && 
                    new Date(a.appointmentDate).toDateString() === new Date().toDateString()
                  ).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-gray-300 text-sm">Taux de confirmation</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${appointments.length > 0 
                          ? Math.round((appointments.filter(a => a.status === 'confirmed').length / appointments.length) * 100) 
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="font-bold text-blue-400 text-lg">
                    {appointments.length > 0 
                      ? Math.round((appointments.filter(a => a.status === 'confirmed').length / appointments.length) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GESTION DU CALENDRIER - Uniquement le bouton de création */}
<div className="futuristic-card p-6">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-bold text-white mb-2">Gestion des disponibilités</h3>
      <p className="text-gray-400 text-sm">Créez et gérez vos calendriers de disponibilités</p>
    </div>
    <Link
      to="/doctor/calendar"
      className="futuristic-btn flex items-center gap-2"
    >
      <Plus className="w-5 h-5" />
      Créer un nouveau calendrier
    </Link>
  </div>
</div>
    </div>
  );
};

export default DoctorDashboard;
