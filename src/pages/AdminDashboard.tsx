import React, { useState, useEffect } from 'react';
import { Users, Calendar, CreditCard, Activity, BarChart3, Settings, LogOut, Bell, ChevronRight, TrendingUp, UserCheck, UserX, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { adminService, DashboardStats } from '../services/adminService';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserManagement from '../components/Admin/UserManagement';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'doctors' | 'patients' | 'appointments' | 'financial'>('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, doctors: 0, patients: 0, admins: 0, active: 0, inactive: 0 },
    appointments: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, today: 0, thisWeek: 0, thisMonth: 0 },
    financial: { totalRevenue: 0, totalCommission: 0, pendingPayments: 0, completedPayments: 0 },
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Erreur récupération stats:', error);
      showNotification('Erreur lors du chargement des statistiques', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      navigate('/login');
    }
  };

  const statCards = [
    {
      title: 'Utilisateurs totaux',
      value: stats.users.total,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      details: [
        { label: 'Médecins', value: stats.users.doctors, icon: UserCheck, color: 'text-green-600' },
        { label: 'Patients', value: stats.users.patients, icon: Users, color: 'text-purple-600' },
        { label: 'Actifs', value: stats.users.active, icon: Activity, color: 'text-green-600' },
        { label: 'Inactifs', value: stats.users.inactive, icon: UserX, color: 'text-red-600' }
      ]
    },
    {
      title: 'Rendez-vous',
      value: stats.appointments.total,
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      details: [
        { label: 'En attente', value: stats.appointments.pending, icon: Clock, color: 'text-yellow-600' },
        { label: 'Confirmés', value: stats.appointments.confirmed, icon: CheckCircle, color: 'text-green-600' },
        { label: 'Terminés', value: stats.appointments.completed, icon: Activity, color: 'text-blue-600' },
        { label: 'Annulés', value: stats.appointments.cancelled, icon: XCircle, color: 'text-red-600' }
      ]
    },
    {
      title: 'Finances',
      value: `${stats.financial.totalRevenue} €`,
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      details: [
        { label: 'Commission', value: `${stats.financial.totalCommission} €`, icon: TrendingUp, color: 'text-purple-600' },
        { label: 'En attente', value: `${stats.financial.pendingPayments} €`, icon: Clock, color: 'text-yellow-600' },
        { label: 'Terminés', value: `${stats.financial.completedPayments} €`, icon: CheckCircle, color: 'text-green-600' }
      ]
    },
    {
      title: 'Aujourd\'hui',
      value: stats.appointments.today,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      details: [
        { label: 'Cette semaine', value: stats.appointments.thisWeek, icon: Calendar, color: 'text-blue-600' },
        { label: 'Ce mois', value: stats.appointments.thisMonth, icon: Calendar, color: 'text-green-600' }
      ]
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
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
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
              { id: 'doctors', label: 'Médecins', icon: Users },
              { id: 'patients', label: 'Patients', icon: Users },
              { id: 'appointments', label: 'Rendez-vous', icon: Calendar },
              { id: 'financial', label: 'Finances', icon: CreditCard }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition ${
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
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{stat.title}</h3>
                      <div className="space-y-2">
                        {stat.details.map((detail, idx) => {
                          const DetailIcon = detail.icon;
                          return (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 flex items-center gap-1">
                                <DetailIcon className={`w-4 h-4 ${detail.color}`} />
                                {detail.label}
                              </span>
                              <span className="font-semibold text-gray-900">{detail.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                        Voir détails
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Graphiques et activités récentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des rendez-vous</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Graphique à venir</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
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
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Aucune activité récente</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des utilisateurs</h3>
                <div className="space-y-3">
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
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Revenus totaux</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.financial.totalRevenue} €</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Commission (10%)</p>
                    <p className="text-xl font-semibold text-purple-600">{stats.financial.totalCommission} €</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
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

        {activeTab === 'doctors' && <UserManagement userType="doctor" />}
        {activeTab === 'patients' && <UserManagement userType="patient" />}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
