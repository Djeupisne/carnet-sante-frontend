import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { appointmentService } from '../services/appointmentService';
import { 
  Calendar, 
  Users, 
  Clock, 
  Check,
  X,
  Bell, 
  ChevronRight, 
  LogOut,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Calendar as CalendarIcon,
  User,
  Phone,
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Hourglass,
  ChevronDown,
  PieChart
} from 'lucide-react';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  type: 'in_person' | 'teleconsultation' | 'home_visit';
  reason: string;
  notes?: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  createdAt?: string;
  confirmedAt?: string;
}

interface DoctorUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialty?: string;
}

const DoctorAppointmentsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const doctorUser = user as DoctorUser;
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
    calculateStats();
  }, [appointments, searchTerm, statusFilter, dateFilter, typeFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('📋 Récupération de tous les rendez-vous...');
      
      const data = await appointmentService.getAppointments();
      
      if (!data || !Array.isArray(data)) {
        setAppointments([]);
        return;
      }

      // Filtrer les rendez-vous du médecin connecté
      const doctorAppointments = data.filter(apt => apt.doctorId === doctorUser?.id);
      
      // Trier par date (plus récent d'abord)
      const sortedAppointments = doctorAppointments.sort(
        (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
      );
      
      console.log(`✅ ${sortedAppointments.length} rendez-vous trouvés`);
      setAppointments(sortedAppointments);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des rendez-vous:', error);
      showNotification('Erreur lors du chargement des rendez-vous', 'error');
      
      // Données de secours
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          patientId: 'p1',
          doctorId: doctorUser?.id || '',
          appointmentDate: '2024-02-15T09:00:00',
          duration: 30,
          status: 'pending',
          type: 'in_person',
          reason: 'Consultation de suivi',
          patient: {
            id: 'p1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@email.com',
            phoneNumber: '06 12 34 56 78'
          },
          createdAt: '2024-02-10T14:30:00'
        },
        {
          id: '2',
          patientId: 'p2',
          doctorId: doctorUser?.id || '',
          appointmentDate: '2024-02-16T10:30:00',
          duration: 45,
          status: 'confirmed',
          type: 'teleconsultation',
          reason: 'Douleurs chroniques',
          patient: {
            id: 'p2',
            firstName: 'Sophie',
            lastName: 'Martin',
            email: 'sophie.martin@email.com',
            phoneNumber: '06 23 45 67 89'
          },
          createdAt: '2024-02-11T09:15:00',
          confirmedAt: '2024-02-11T11:30:00'
        },
        {
          id: '3',
          patientId: 'p3',
          doctorId: doctorUser?.id || '',
          appointmentDate: '2024-02-14T14:00:00',
          duration: 30,
          status: 'completed',
          type: 'in_person',
          reason: 'Renouvellement ordonnance',
          patient: {
            id: 'p3',
            firstName: 'Michel',
            lastName: 'Bernard',
            email: 'michel.bernard@email.com',
            phoneNumber: '06 34 56 78 90'
          },
          createdAt: '2024-02-07T16:20:00',
          confirmedAt: '2024-02-08T10:00:00'
        },
        {
          id: '4',
          patientId: 'p1',
          doctorId: doctorUser?.id || '',
          appointmentDate: '2024-02-10T11:00:00',
          duration: 30,
          status: 'cancelled',
          type: 'home_visit',
          reason: 'Visite à domicile',
          patient: {
            id: 'p1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@email.com',
            phoneNumber: '06 12 34 56 78'
          },
          createdAt: '2024-02-05T08:45:00'
        }
      ];
      
      setAppointments(mockAppointments);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filtre par recherche (nom du patient)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        apt =>
          apt.patient?.firstName.toLowerCase().includes(term) ||
          apt.patient?.lastName.toLowerCase().includes(term) ||
          apt.patient?.email.toLowerCase().includes(term) ||
          apt.reason.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Filtre par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(apt => apt.type === typeFilter);
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        switch (dateFilter) {
          case 'today':
            return aptDate.toDateString() === today.toDateString();
          case 'week':
            return aptDate >= weekStart;
          case 'month':
            return aptDate >= monthStart;
          default:
            return true;
        }
      });
    }

    setFilteredAppointments(filtered);
  };

  const calculateStats = () => {
    setStats({
      total: appointments.length,
      pending: appointments.filter(a => a.status === 'pending').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', { 
        weekday: 'long',
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      shortDate: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    };
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { 
        bg: 'bg-yellow-500/20', 
        text: 'text-yellow-300', 
        border: 'border-yellow-500/30',
        icon: Hourglass,
        label: 'En attente'
      },
      confirmed: { 
        bg: 'bg-green-500/20', 
        text: 'text-green-300', 
        border: 'border-green-500/30',
        icon: CheckCircle,
        label: 'Confirmé'
      },
      completed: { 
        bg: 'bg-blue-500/20', 
        text: 'text-blue-300', 
        border: 'border-blue-500/30',
        icon: CheckCircle,
        label: 'Terminé'
      },
      cancelled: { 
        bg: 'bg-red-500/20', 
        text: 'text-red-300', 
        border: 'border-red-500/30',
        icon: XCircle,
        label: 'Annulé'
      },
      no_show: { 
        bg: 'bg-gray-500/20', 
        text: 'text-gray-300', 
        border: 'border-gray-500/30',
        icon: XCircle,
        label: 'Non honoré'
      }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      in_person: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'En personne' },
      teleconsultation: { bg: 'bg-purple-500/20', text: 'text-purple-300', label: 'Téléconsultation' },
      home_visit: { bg: 'bg-green-500/20', text: 'text-green-300', label: 'Visite à domicile' }
    };
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.in_person;
    
    return (
      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      try {
        logout();
      } catch (error) {
        console.error('❌ Erreur lors de la déconnexion:', error);
        showNotification('❌ Erreur lors de la déconnexion', 'error');
      }
    }
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.confirmAppointment(appointmentId);
      showNotification('✅ Rendez-vous confirmé', 'success');
      await fetchAppointments();
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
    } catch (error) {
      console.error('❌ Erreur annulation:', error);
      showNotification('❌ Erreur lors de l\'annulation', 'error');
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* HEADER */}
      <div className="futuristic-card p-6 animate-slide-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Dr. {doctorUser?.firstName} {doctorUser?.lastName}
              </h1>
              <p className="text-gray-300 mt-1">
                {doctorUser?.specialty || 'Médecin'} • Tous les rendez-vous
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Bell className="w-5 h-5 text-white" />
              </button>
            </div>
            
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

      {/* STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="futuristic-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        <div className="futuristic-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">En attente</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-xl">
              <Hourglass className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="futuristic-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Confirmés</p>
              <p className="text-2xl font-bold text-green-400">{stats.confirmed}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        <div className="futuristic-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Terminés</p>
              <p className="text-2xl font-bold text-blue-400">{stats.completed}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        <div className="futuristic-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Annulés</p>
              <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-xl">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* FILTRES ET RECHERCHE */}
      <div className="futuristic-card p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Tous les rendez-vous</h2>
            <p className="text-gray-400 text-sm mt-1">
              {filteredAppointments.length} rendez-vous trouvé{filteredAppointments.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            {/* Recherche */}
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="futuristic-input pl-10"
              />
            </div>

            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
            >
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Filtres</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Export */}
            <button className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
              <Download className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Export</span>
            </button>
          </div>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10 animate-slide-in">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="futuristic-select"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmés</option>
                <option value="completed">Terminés</option>
                <option value="cancelled">Annulés</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type de consultation
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="futuristic-select"
              >
                <option value="all">Tous les types</option>
                <option value="in_person">En personne</option>
                <option value="teleconsultation">Téléconsultation</option>
                <option value="home_visit">Visite à domicile</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Période
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="futuristic-select"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>
          </div>
        )}

        {/* LISTE DES RENDEZ-VOUS */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des rendez-vous...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Aucun rendez-vous trouvé
            </h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all'
                ? 'Aucun résultat pour les filtres sélectionnés'
                : 'Vous n\'avez pas encore de rendez-vous'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const { date, time, shortDate } = formatDateTime(appointment.appointmentDate);
              return (
                <div
                  key={appointment.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-5 transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/appointments/${appointment.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* En-tête avec patient et statut */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {appointment.patient?.firstName?.[0]}{appointment.patient?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-white">
                              {appointment.patient?.firstName} {appointment.patient?.lastName}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-gray-400">{shortDate}</span>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-400">{time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(appointment.status)}
                          {getTypeBadge(appointment.type)}
                        </div>
                      </div>

                      {/* Détails du rendez-vous */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Motif</p>
                          <p className="text-white">{appointment.reason}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">
                              {appointment.patient?.phoneNumber || 'Non renseigné'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">{appointment.patient?.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                        {appointment.createdAt && (
                          <span>Créé le {new Date(appointment.createdAt).toLocaleDateString('fr-FR')}</span>
                        )}
                        {appointment.confirmedAt && (
                          <>
                            <span>•</span>
                            <span className="text-green-400">
                              Confirmé le {new Date(appointment.confirmedAt).toLocaleDateString('fr-FR')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConfirmAppointment(appointment.id);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105"
                          >
                            <Check className="w-4 h-4" />
                            Confirmer
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelAppointment(appointment.id);
                            }}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105"
                          >
                            <X className="w-4 h-4" />
                            Annuler
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/appointments/${appointment.id}`);
                        }}
                        className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-white/20 transition-all duration-300"
                      >
                        <Eye className="w-4 h-4" />
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
