import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  Download,
  Eye,
  Edit,
  Trash,
  X,
  Check,
  Award,
  Activity,
  DollarSign,
  Stethoscope,
  Users,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  type: 'in_person' | 'teleconsultation' | 'home_visit';
  reason: string;
  symptoms?: any;
  notes?: string;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    specialty?: string;
  };
  payment?: {
    id: string;
    amount: number;
    status: string;
    paymentMethod?: string;
  };
}

const AppointmentManagement: React.FC = () => {
  const { showNotification } = useNotification();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    no_show: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
    calculateStats();
  }, [appointments, searchTerm, statusFilter, typeFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllAppointments();
      setAppointments(response.data || []);
      setFilteredAppointments(response.data || []);
    } catch (error) {
      console.error('❌ Erreur récupération rendez-vous:', error);
      showNotification('Erreur lors du chargement des rendez-vous', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        apt =>
          apt.patient?.firstName.toLowerCase().includes(term) ||
          apt.patient?.lastName.toLowerCase().includes(term) ||
          apt.doctor?.firstName.toLowerCase().includes(term) ||
          apt.doctor?.lastName.toLowerCase().includes(term) ||
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
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      no_show: appointments.filter(a => a.status === 'no_show').length,
      today: appointments.filter(a => {
        const today = new Date();
        const aptDate = new Date(a.appointmentDate);
        return aptDate.toDateString() === today.toDateString();
      }).length,
      thisWeek: appointments.filter(a => {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        return new Date(a.appointmentDate) >= weekStart;
      }).length,
      thisMonth: appointments.filter(a => {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return new Date(a.appointmentDate) >= monthStart;
      }).length
    });
  };

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      // Appel API pour mettre à jour le statut
      // À implémenter selon votre API
      showNotification(`✅ Statut mis à jour avec succès`, 'success');
      fetchAppointments();
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
      showNotification('❌ Erreur lors de la mise à jour', 'error');
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) return;
    
    try {
      await adminService.deleteAppointment(appointmentId);
      showNotification('✅ Rendez-vous supprimé avec succès', 'success');
      fetchAppointments();
    } catch (error) {
      console.error('❌ Erreur suppression rendez-vous:', error);
      showNotification('❌ Erreur lors de la suppression', 'error');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      full: date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock, label: 'En attente' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle, label: 'Confirmé' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: CheckCircle, label: 'Terminé' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: XCircle, label: 'Annulé' },
      no_show: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: XCircle, label: 'Non honoré' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border} shadow-sm`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      in_person: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: User, label: 'En personne' },
      teleconsultation: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', icon: MessageSquare, label: 'Téléconsultation' },
      home_visit: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: MapPin, label: 'Visite à domicile' }
    };
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.in_person;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total rendez-vous</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">En attente</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Confirmés</p>
              <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Aujourd'hui</p>
              <p className="text-3xl font-bold text-purple-600">{stats.today}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* En-tête avec filtres */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Gestion des rendez-vous
              </h2>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                {filteredAppointments.length} rendez-vous trouvé{filteredAppointments.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {/* Barre de recherche */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher patient, médecin, motif..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
              />
            </div>

            {/* Menu filtre */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-100 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 font-medium">Filtres</span>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${showFilterMenu ? 'rotate-180' : ''}`} />
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-slide-down">
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Statut</p>
                    <div className="space-y-1 mb-3">
                      {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setShowFilterMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                            statusFilter === status
                              ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {status === 'all' && <span>Tous</span>}
                          {status === 'pending' && <><Clock className="w-4 h-4" /> En attente</>}
                          {status === 'confirmed' && <><CheckCircle className="w-4 h-4" /> Confirmé</>}
                          {status === 'completed' && <><CheckCircle className="w-4 h-4" /> Terminé</>}
                          {status === 'cancelled' && <><XCircle className="w-4 h-4" /> Annulé</>}
                          {status === 'no_show' && <><XCircle className="w-4 h-4" /> Non honoré</>}
                        </button>
                      ))}
                    </div>

                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Type</p>
                    <div className="space-y-1 mb-3">
                      {['all', 'in_person', 'teleconsultation', 'home_visit'].map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setTypeFilter(type);
                            setShowFilterMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                            typeFilter === type
                              ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {type === 'all' && <span>Tous</span>}
                          {type === 'in_person' && <><User className="w-4 h-4" /> En personne</>}
                          {type === 'teleconsultation' && <><MessageSquare className="w-4 h-4" /> Téléconsultation</>}
                          {type === 'home_visit' && <><MapPin className="w-4 h-4" /> Visite à domicile</>}
                        </button>
                      ))}
                    </div>

                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Période</p>
                    <div className="space-y-1">
                      {['all', 'today', 'week', 'month'].map((period) => (
                        <button
                          key={period}
                          onClick={() => {
                            setDateFilter(period);
                            setShowFilterMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                            dateFilter === period
                              ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {period === 'all' && <span>Toutes les dates</span>}
                          {period === 'today' && <><Clock className="w-4 h-4" /> Aujourd'hui</>}
                          {period === 'week' && <><Calendar className="w-4 h-4" /> Cette semaine</>}
                          {period === 'month' && <><Calendar className="w-4 h-4" /> Ce mois</>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bouton rafraîchir */}
            <button
              onClick={fetchAppointments}
              className="px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300 rounded-lg hover:from-gray-200 hover:to-gray-100 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
              title="Rafraîchir"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>

            {/* Bouton export */}
            <button
              className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-white rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-600 mt-4 font-medium">Chargement des rendez-vous...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun rendez-vous trouvé</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all'
                ? 'Aucun résultat pour les filtres sélectionnés'
                : 'Aucun rendez-vous pour le moment'}
            </p>
          </div>
        ) : (
          /* Liste des rendez-vous */
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const { date, time, full } = formatDateTime(appointment.appointmentDate);
              return (
                <div
                  key={appointment.id}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-xl transition-all hover:-translate-y-1 hover:border-orange-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Informations principales */}
                    <div className="flex-1">
                      {/* En-tête avec statut et type */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {getStatusBadge(appointment.status)}
                        {getTypeBadge(appointment.type)}
                        <span className="text-xs text-gray-400 ml-auto">
                          ID: {appointment.id.slice(0, 8)}...
                        </span>
                      </div>

                      {/* Patient et Médecin */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Patient */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                              {appointment.patient?.firstName?.[0]}{appointment.patient?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Patient</p>
                            <p className="font-semibold text-gray-900">
                              {appointment.patient?.firstName} {appointment.patient?.lastName}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span className="truncate max-w-[150px]">{appointment.patient?.email}</span>
                            </div>
                            {appointment.patient?.phoneNumber && (
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                <Phone className="w-3 h-3" />
                                {appointment.patient.phoneNumber}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Médecin */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                              {appointment.doctor?.firstName?.[0]}{appointment.doctor?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Médecin</p>
                            <p className="font-semibold text-gray-900">
                              Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                            </p>
                            {appointment.doctor?.specialty && (
                              <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                <Award className="w-3 h-3 text-blue-500" />
                                {appointment.doctor.specialty}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Date et motif */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-medium text-gray-900">{date}</p>
                            <p className="text-sm text-gray-600">{time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Motif</p>
                            <p className="font-medium text-gray-900">{appointment.reason}</p>
                          </div>
                        </div>
                      </div>

                      {/* Notes supplémentaires */}
                      {appointment.notes && (
                        <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Notes</p>
                          <p>{appointment.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[120px]">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowDetailsModal(true);
                        }}
                        className="flex-1 lg:w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all hover:scale-105 flex items-center justify-center gap-2 border border-blue-200 shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Détails</span>
                      </button>
                      
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                            className="flex-1 lg:w-full px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all hover:scale-105 flex items-center justify-center gap-2 border border-green-200 shadow-sm"
                          >
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-medium">Confirmer</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                            className="flex-1 lg:w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all hover:scale-105 flex items-center justify-center gap-2 border border-red-200 shadow-sm"
                          >
                            <X className="w-4 h-4" />
                            <span className="text-sm font-medium">Annuler</span>
                          </button>
                        </>
                      )}
                      
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                          className="flex-1 lg:w-full px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all hover:scale-105 flex items-center justify-center gap-2 border border-blue-200 shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Terminer</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="flex-1 lg:w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all hover:scale-105 flex items-center justify-center gap-2 border border-red-200 shadow-sm"
                      >
                        <Trash className="w-4 h-4" />
                        <span className="text-sm font-medium">Supprimer</span>
                      </button>
                    </div>
                  </div>

                  {/* Pied de carte */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Créé le {formatDateTime(appointment.createdAt).full}
                    </div>
                    {appointment.payment && (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        <span className="font-medium text-green-600">{appointment.payment.amount} €</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal détails */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-pink-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Détails du rendez-vous
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Statut et type */}
              <div className="flex flex-wrap gap-3">
                {getStatusBadge(selectedAppointment.status)}
                {getTypeBadge(selectedAppointment.type)}
              </div>

              {/* Informations patient */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Patient
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Nom complet</p>
                    <p className="font-medium text-gray-900">
                      {selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-gray-700">{selectedAppointment.patient?.email}</p>
                  </div>
                  {selectedAppointment.patient?.phoneNumber && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Téléphone</p>
                      <p className="text-gray-700">{selectedAppointment.patient.phoneNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations médecin */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Médecin
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Nom complet</p>
                    <p className="font-medium text-gray-900">
                      Dr. {selectedAppointment.doctor?.firstName} {selectedAppointment.doctor?.lastName}
                    </p>
                  </div>
                  {selectedAppointment.doctor?.specialty && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Spécialité</p>
                      <p className="text-gray-700">{selectedAppointment.doctor.specialty}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-gray-700">{selectedAppointment.doctor?.email}</p>
                  </div>
                </div>
              </div>

              {/* Détails du rendez-vous */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  Détails
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date et heure</p>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(selectedAppointment.appointmentDate).full}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Durée</p>
                    <p className="text-gray-700">{selectedAppointment.duration} minutes</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Motif</p>
                    <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                      {selectedAppointment.reason}
                    </p>
                  </div>
                  {selectedAppointment.notes && (
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Paiement */}
              {selectedAppointment.payment && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Paiement
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Montant</p>
                      <p className="text-xl font-bold text-green-600">{selectedAppointment.payment.amount} €</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Statut</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedAppointment.payment.status === 'completed' 
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : selectedAppointment.payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {selectedAppointment.payment.status}
                      </span>
                    </div>
                    {selectedAppointment.payment.paymentMethod && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Méthode</p>
                        <p className="text-gray-700">{selectedAppointment.payment.paymentMethod}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Styles pour l'animation */}
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AppointmentManagement;
