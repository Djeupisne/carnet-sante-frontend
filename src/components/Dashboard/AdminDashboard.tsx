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
import { adminService, User as UserType, DashboardStats } from '../../services/adminService';
import { calendarService } from '../../services/calendarService';
import UserManagement from '../../components/Admin/UserManagement';

interface Calendar {
  id: string;
  date: string;
  slots: string[];
  confirmed: boolean;
  doctor?: { firstName: string; lastName: string; id: string };
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'doctors' | 'patients' | 'appointments' | 'financial' | 'calendars'>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, doctors: 0, patients: 0, admins: 0, active: 0, inactive: 0 },
    appointments: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, today: 0, thisWeek: 0, thisMonth: 0 },
    financial: { totalRevenue: 0, totalCommission: 0, pendingPayments: 0, completedPayments: 0 },
    recentActivities: []
  });
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les statistiques
      const statsResponse = await adminService.getDashboardStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Récupérer les calendriers
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
                <p className="text-sm text-gray-500">
                  Connecté en tant que {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
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
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{stat.title}</h3>
                      <div className="space-y-3">
                        {stat.details.map((detail, idx) => {
                          const DetailIcon = detail.icon;
                          return (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 flex items-center gap-2">
                                <DetailIcon className={`w-4 h-4 ${detail.color}`} />
                                {detail.label}
                              </span>
                              <span className="font-semibold text-gray-900">{detail.value}</span>
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Activité récente
                </h3>
                <div className="space-y-4">
                  {stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Aucune activité récente</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Derniers calendriers
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {calendars.slice(0, 5).map((calendar) => (
                    <div key={calendar.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{formatDate(calendar.date)}</p>
                        <p className="text-sm text-gray-600">
                          Dr. {calendar.doctor?.firstName} {calendar.doctor?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {calendar.slots.length} créneaux
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        calendar.confirmed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {calendar.confirmed ? 'Confirmé' : 'En attente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des utilisateurs</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Médecins</span>
                      <span className="font-semibold text-gray-900">{stats.users.doctors}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.users.doctors / stats.users.total) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Patients</span>
                      <span className="font-semibold text-gray-900">{stats.users.patients}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.users.patients / stats.users.total) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Admins</span>
                      <span className="font-semibold text-gray-900">{stats.users.admins}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(stats.users.admins / stats.users.total) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des rendez-vous</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                      En attente
                    </span>
                    <span className="font-semibold text-gray-900">{stats.appointments.pending}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      Confirmés
                    </span>
                    <span className="font-semibold text-gray-900">{stats.appointments.confirmed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      Terminés
                    </span>
                    <span className="font-semibold text-gray-900">{stats.appointments.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      Annulés
                    </span>
                    <span className="font-semibold text-gray-900">{stats.appointments.cancelled}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance financière</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Revenus totaux</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.financial.totalRevenue} €</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Commission (10%)</p>
                    <p className="text-xl font-semibold text-purple-600">{stats.financial.totalCommission} €</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">En attente</span>
                      <span className="font-semibold text-yellow-600">{stats.financial.pendingPayments} €</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Terminés</span>
                      <span className="font-semibold text-green-600">{stats.financial.completedPayments} €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <UserManagement userType="doctor" />
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <UserManagement userType="patient" />
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des rendez-vous</h2>
            <p className="text-gray-600">Page en cours de développement...</p>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Rapports financiers</h2>
            <p className="text-gray-600">Page en cours de développement...</p>
          </div>
        )}

        {activeTab === 'calendars' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des calendriers</h2>
            <div className="space-y-4">
              {calendars.map((calendar) => (
                <div key={calendar.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{formatDate(calendar.date)}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Dr. {calendar.doctor?.firstName} {calendar.doctor?.lastName}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {calendar.slots.map((slot, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        calendar.confirmed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {calendar.confirmed ? 'Confirmé' : 'En attente'}
                      </span>
                      <button
                        onClick={() => handleDeleteCalendar(calendar.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Supprimer"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
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
