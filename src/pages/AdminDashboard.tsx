import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Activity, 
  Trash, 
  Edit, 
  Eye, 
  UserPlus,
  Search,
  Filter,
  ChevronDown,
  Download,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Award,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { adminService, DashboardStats } from '../../services/adminService';
import { calendarService } from '../../services/calendarService';
import UserManagement from '../../components/Admin/UserManagement';
import AppointmentManagement from '../../components/Admin/AppointmentManagement';
import FinancialReports from '../../components/Admin/FinancialReports';

interface Calendar {
  id: string;
  date: string;
  slots: string[];
  confirmed: boolean;
  doctor?: { firstName: string; lastName: string; id: string };
}

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'doctors' | 'patients' | 'appointments' | 'financial' | 'calendars'>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, doctors: 0, patients: 0, admins: 0, active: 0, inactive: 0 },
    appointments: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, today: 0, thisWeek: 0, thisMonth: 0 },
    financial: { totalRevenue: 0, totalCommission: 0, pendingPayments: 0, completedPayments: 0 },
    recentActivities: []
  });
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const statsResponse = await adminService.getDashboardStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      const calendarsResponse = await calendarService.getAllCalendars();
      setCalendars(calendarsResponse.data || []);

    } catch (error) {
      console.error('❌ Erreur chargement données:', error);
      showNotification('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCalendar = async (calendarId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce calendrier ?')) return;
    
    try {
      await calendarService.deleteCalendar(calendarId);
      setCalendars(calendars.filter((c) => c.id !== calendarId));
      showNotification('✅ Calendrier supprimé avec succès', 'success');
    } catch (error) {
      console.error('❌ Erreur suppression calendrier:', error);
      showNotification('Erreur lors de la suppression', 'error');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      navigate('/login');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const statCards = [
    {
      title: 'Utilisateurs totaux',
      value: stats.users.total,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      details: [
        { label: 'Médecins', value: stats.users.doctors, icon: UserCheck, color: 'text-green-600' },
        { label: 'Patients', value: stats.users.patients, icon: Users, color: 'text-purple-600' },
        { label: 'Admins', value: stats.users.admins, icon: Settings, color: 'text-indigo-600' },
        { label: 'Actifs', value: stats.users.active, icon: CheckCircle, color: 'text-green-600' },
        { label: 'Inactifs', value: stats.users.inactive, icon: XCircle, color: 'text-red-600' }
      ]
    },
    {
      title: 'Rendez-vous',
      value: stats.appointments.total,
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      details: [
        { label: 'En attente', value: stats.appointments.pending, icon: Clock, color: 'text-yellow-600' },
        { label: 'Confirmés', value: stats.appointments.confirmed, icon: CheckCircle, color: 'text-green-600' },
        { label: 'Terminés', value: stats.appointments.completed, icon: Activity, color: 'text-blue-600' },
        { label: 'Annulés', value: stats.appointments.cancelled, icon: XCircle, color: 'text-red-600' },
        { label: "Aujourd'hui", value: stats.appointments.today, icon: Calendar, color: 'text-purple-600' }
      ]
    },
    {
      title: 'Finances',
      value: `${stats.financial.totalRevenue} €`,
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      details: [
        { label: 'Commission', value: `${stats.financial.totalCommission} €`, icon: TrendingUp, color: 'text-purple-600' },
        { label: 'En attente', value: `${stats.financial.pendingPayments} €`, icon: Clock, color: 'text-yellow-600' },
        { label: 'Terminés', value: `${stats.financial.completedPayments} €`, icon: CheckCircle, color: 'text-green-600' }
      ]
    },
    {
      title: 'Calendriers',
      value: calendars.length,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      details: [
        { label: 'Confirmés', value: calendars.filter(c => c.confirmed).length, icon: CheckCircle, color: 'text-green-600' },
        { label: 'En attente', value: calendars.filter(c => !c.confirmed).length, icon: Clock, color: 'text-yellow-600' }
      ]
    }
  ];

  const navigationTabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'doctors', label: 'Médecins', icon: Users },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Rendez-vous', icon: Calendar },
    { id: 'financial', label: 'Finances', icon: CreditCard },
    { id: 'calendars', label: 'Calendriers', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Administration
                </h1>
                <p className="text-sm text-gray-500">
                  Connecté en tant qu'Administrateur
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition relative group">
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2 shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto py-2">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-all rounded-t-lg ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{stat.title}</h3>
                      <div className="space-y-3">
                        {stat.details.map((detail, idx) => {
                          const DetailIcon = detail.icon;
                          return (
                            <div key={idx} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 transition">
                              <span className="text-gray-600 flex items-center gap-2">
                                <DetailIcon className={`w-4 h-4 ${detail.color}`} />
                                {detail.label}
                              </span>
                              <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                                {detail.value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Graphiques et activités récentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activité récente */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>Activité récente</span>
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((activity) => {
                      const { date, time } = formatDateTime(activity.timestamp);
                      return (
                        <div key={activity.id} className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition hover:border-blue-200">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                            <Activity className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs">
                              <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                {date}
                              </span>
                              <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                {time}
                              </span>
                              <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                                activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                activity.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {activity.status || 'Terminé'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Aucune activité récente</p>
                      <p className="text-sm text-gray-400 mt-1">Les dernières actions apparaîtront ici</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Derniers calendriers */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Derniers calendriers</span>
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {calendars.slice(0, 5).map((calendar) => (
                    <div key={calendar.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition hover:border-purple-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <p className="font-semibold text-gray-900">{formatDate(calendar.date)}</p>
                        </div>
                        <p className="text-sm text-gray-600 ml-6">
                          Dr. {calendar.doctor?.firstName} {calendar.doctor?.lastName}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2 ml-6">
                          {calendar.slots.slice(0, 3).map((slot, index) => (
                            <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                              {slot}
                            </span>
                          ))}
                          {calendar.slots.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                              +{calendar.slots.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          calendar.confirmed 
                            ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200' 
                            : 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}>
                          {calendar.confirmed ? '✓ Confirmé' : '⏳ En attente'}
                        </span>
                        <button
                          onClick={() => handleDeleteCalendar(calendar.id)}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all hover:scale-110 border border-red-200"
                          title="Supprimer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Répartition des utilisateurs */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Répartition des utilisateurs</span>
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Médecins</span>
                      <span className="font-bold text-gray-900 bg-white px-2 py-1 rounded-md shadow-sm">{stats.users.doctors}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500" 
                           style={{ width: `${stats.users.total ? (stats.users.doctors / stats.users.total) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Patients</span>
                      <span className="font-bold text-gray-900 bg-white px-2 py-1 rounded-md shadow-sm">{stats.users.patients}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500" 
                           style={{ width: `${stats.users.total ? (stats.users.patients / stats.users.total) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Admins</span>
                      <span className="font-bold text-gray-900 bg-white px-2 py-1 rounded-md shadow-sm">{stats.users.admins}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2.5 rounded-full transition-all duration-500" 
                           style={{ width: `${stats.users.total ? (stats.users.admins / stats.users.total) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statut des rendez-vous */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <span>Statut des rendez-vous</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-700 flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                      En attente
                    </span>
                    <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">{stats.appointments.pending}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-700 flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      Confirmés
                    </span>
                    <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">{stats.appointments.confirmed}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-700 flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      Terminés
                    </span>
                    <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">{stats.appointments.completed}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-gray-700 flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      Annulés
                    </span>
                    <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">{stats.appointments.cancelled}</span>
                  </div>
                </div>
              </div>

              {/* Performance financière */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Performance financière</span>
                </h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Revenus totaux</p>
                    <p className="text-3xl font-bold text-green-600">{stats.financial.totalRevenue} €</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Commission (10%)</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.financial.totalCommission} €</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg mb-2">
                      <span className="text-sm text-gray-600">En attente</span>
                      <span className="font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-md border border-yellow-200">
                        {stats.financial.pendingPayments} €
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Terminés</span>
                      <span className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-md border border-green-200">
                        {stats.financial.completedPayments} €
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <UserManagement userType="doctor" />
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <UserManagement userType="patient" />
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <AppointmentManagement />
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <FinancialReports />
          </div>
        )}

        {activeTab === 'calendars' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des calendriers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {calendars.map((calendar) => (
                <div key={calendar.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{formatDate(calendar.date)}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Award className="w-4 h-4 text-purple-500" />
                          Dr. {calendar.doctor?.firstName} {calendar.doctor?.lastName}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      calendar.confirmed 
                        ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200' 
                        : 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200'
                    }`}>
                      {calendar.confirmed ? '✓ Confirmé' : '⏳ En attente'}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      Créneaux disponibles ({calendar.slots.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {calendar.slots.map((slot, index) => (
                        <span key={index} className="px-3 py-1.5 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200 shadow-sm hover:shadow-md transition">
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                    <button
                      onClick={() => handleDeleteCalendar(calendar.id)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2 text-sm shadow-md"
                    >
                      <Trash className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
