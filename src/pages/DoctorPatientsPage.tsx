import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { userService } from '../services/userService';
import { appointmentService } from '../services/appointmentService';
import { 
  Calendar, 
  Users, 
  Clock, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon,
  User,
  Search,
  ArrowLeft,
  LogOut,
  Bell,
  ChevronRight,
  FileText,
  MessageSquare,
  Filter,
  Download,
  MoreVertical,
  Eye,
  X
} from 'lucide-react';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  bloodType?: string;
  allergies?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  lastAppointment?: string;
  totalAppointments?: number;
}

interface Appointment {
  id: string;
  appointmentDate: string;
  status: string;
  type: string;
  reason: string;
}

interface DoctorUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialty?: string;
}

const DoctorPatientsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const doctorUser = user as DoctorUser;
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([]);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'recent' | 'oldest'>('all');

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, patients, filterStatus]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      console.log('👥 Récupération des patients...');
      
      // Récupérer tous les rendez-vous pour identifier les patients uniques
      const appointments = await appointmentService.getAppointments();
      
      if (!appointments || !Array.isArray(appointments)) {
        setPatients([]);
        return;
      }

      // Filtrer les rendez-vous du médecin connecté
      const doctorAppointments = appointments.filter(
        apt => apt.doctorId === doctorUser?.id
      );

      // Extraire les IDs uniques des patients
      const uniquePatientIds = [...new Set(doctorAppointments.map(apt => apt.patientId))];
      
      // Récupérer les détails de chaque patient
      const patientPromises = uniquePatientIds.map(async (patientId) => {
        try {
          // Récupérer les informations du patient
          const patientData = await userService.getUserById(patientId);
          
          // Récupérer les rendez-vous de ce patient avec ce médecin
          const patientAppointments = doctorAppointments.filter(
            apt => apt.patientId === patientId
          );

          // Trier par date (plus récent d'abord)
          const sortedAppointments = patientAppointments.sort(
            (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
          );

          return {
            id: patientId,
            firstName: patientData?.firstName || 'Inconnu',
            lastName: patientData?.lastName || '',
            email: patientData?.email || 'Non renseigné',
            phoneNumber: patientData?.phoneNumber,
            dateOfBirth: patientData?.dateOfBirth,
            gender: patientData?.gender,
            address: patientData?.address,
            bloodType: patientData?.bloodType,
            allergies: patientData?.allergies || [],
            emergencyContact: patientData?.emergencyContact,
            lastAppointment: sortedAppointments[0]?.appointmentDate,
            totalAppointments: patientAppointments.length
          };
        } catch (error) {
          console.error(`❌ Erreur récupération patient ${patientId}:`, error);
          return null;
        }
      });

      const patientsData = (await Promise.all(patientPromises)).filter(p => p !== null) as Patient[];
      
      console.log(`✅ ${patientsData.length} patients trouvés`);
      setPatients(patientsData);
      setFilteredPatients(patientsData);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des patients:', error);
      showNotification('Erreur lors du chargement des patients', 'error');
      
      // Données de secours
      const mockPatients: Patient[] = [
        {
          id: '1',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@email.com',
          phoneNumber: '06 12 34 56 78',
          dateOfBirth: '1980-05-15',
          gender: 'M',
          bloodType: 'A+',
          allergies: ['Pénicilline', 'Pollens'],
          emergencyContact: {
            name: 'Marie Dupont',
            phone: '06 98 76 54 32',
            relationship: 'Conjointe'
          },
          lastAppointment: '2024-02-10T14:30:00',
          totalAppointments: 5
        },
        {
          id: '2',
          firstName: 'Sophie',
          lastName: 'Martin',
          email: 'sophie.martin@email.com',
          phoneNumber: '06 23 45 67 89',
          dateOfBirth: '1992-08-22',
          gender: 'F',
          bloodType: 'O-',
          allergies: [],
          emergencyContact: {
            name: 'Pierre Martin',
            phone: '06 87 65 43 21',
            relationship: 'Frère'
          },
          lastAppointment: '2024-02-05T10:00:00',
          totalAppointments: 3
        },
        {
          id: '3',
          firstName: 'Michel',
          lastName: 'Bernard',
          email: 'michel.bernard@email.com',
          phoneNumber: '06 34 56 78 90',
          dateOfBirth: '1975-11-30',
          gender: 'M',
          bloodType: 'B+',
          allergies: ['Latex', 'Iode'],
          emergencyContact: {
            name: 'Claire Bernard',
            phone: '06 76 54 32 10',
            relationship: 'Épouse'
          },
          lastAppointment: '2024-01-28T09:15:00',
          totalAppointments: 8
        }
      ];
      
      setPatients(mockPatients);
      setFilteredPatients(mockPatients);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientAppointments = async (patientId: string) => {
    try {
      const appointments = await appointmentService.getAppointments();
      if (!appointments || !Array.isArray(appointments)) return;

      const patientAppointments = appointments
        .filter(apt => apt.patientId === patientId && apt.doctorId === doctorUser?.id)
        .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

      setPatientAppointments(patientAppointments);
    } catch (error) {
      console.error('❌ Erreur récupération rendez-vous patient:', error);
    }
  };

  const filterPatients = () => {
    let filtered = [...patients];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.firstName.toLowerCase().includes(term) ||
          p.lastName.toLowerCase().includes(term) ||
          p.email.toLowerCase().includes(term) ||
          p.phoneNumber?.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (filterStatus === 'recent') {
      filtered = filtered.filter(p => {
        if (!p.lastAppointment) return false;
        const lastApt = new Date(p.lastAppointment);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastApt >= thirtyDaysAgo;
      });
    } else if (filterStatus === 'oldest') {
      filtered = filtered.filter(p => {
        if (!p.lastAppointment) return true;
        const lastApt = new Date(p.lastAppointment);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastApt < thirtyDaysAgo;
      });
    }

    setFilteredPatients(filtered);
  };

  const handleViewPatientDetails = async (patient: Patient) => {
    setSelectedPatient(patient);
    await fetchPatientAppointments(patient.id);
    setShowPatientDetails(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', label: 'En attente' },
      confirmed: { bg: 'bg-green-500/20', text: 'text-green-300', label: 'Confirmé' },
      completed: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'Terminé' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Annulé' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.text}`}>
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
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Dr. {doctorUser?.firstName} {doctorUser?.lastName}
              </h1>
              <p className="text-gray-300 mt-1">
                {doctorUser?.specialty || 'Médecin'} • Gestion des patients
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

      {/* MODAL DÉTAILS PATIENT */}
      {showPatientDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="futuristic-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <User className="w-6 h-6 text-purple-400" />
                  Détails du patient
                </h2>
                <button
                  onClick={() => setShowPatientDetails(false)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Informations personnelles</h3>
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Nom complet</p>
                        <p className="text-white font-medium">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white">{selectedPatient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Téléphone</p>
                        <p className="text-white">{selectedPatient.phoneNumber || 'Non renseigné'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-400">Date de naissance</p>
                        <p className="text-white">{formatDate(selectedPatient.dateOfBirth)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Sexe</p>
                        <p className="text-white">{selectedPatient.gender || 'Non renseigné'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations médicales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Informations médicales</h3>
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Groupe sanguin</p>
                      <p className="text-white font-medium">{selectedPatient.bloodType || 'Non renseigné'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Allergies</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                          selectedPatient.allergies.map((allergy, index) => (
                            <span key={index} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm">
                              {allergy}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">Aucune allergie connue</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Contact d'urgence</h3>
                  {selectedPatient.emergencyContact ? (
                    <div className="bg-white/5 rounded-xl p-4 space-y-2">
                      <p className="text-white">{selectedPatient.emergencyContact.name}</p>
                      <p className="text-gray-300">{selectedPatient.emergencyContact.phone}</p>
                      <p className="text-sm text-gray-400">{selectedPatient.emergencyContact.relationship}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Non renseigné</p>
                  )}
                </div>
              </div>

              {/* Historique des rendez-vous */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Historique des rendez-vous</h3>
                <div className="space-y-3">
                  {patientAppointments.length > 0 ? (
                    patientAppointments.map((apt) => {
                      const { date, time } = formatDateTime(apt.appointmentDate);
                      return (
                        <div key={apt.id} className="bg-white/5 rounded-xl p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-white font-medium">{date} à {time}</p>
                              <p className="text-sm text-gray-400 mt-1">{apt.reason}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {getStatusBadge(apt.status)}
                              <span className="text-sm text-gray-400">{apt.type}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-center py-4">Aucun rendez-vous trouvé</p>
                  )}
                </div>
              </div>

              {/* Statistiques */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-400">{selectedPatient.totalAppointments || 0}</p>
                  <p className="text-sm text-gray-400">Rendez-vous</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {patientAppointments.filter(a => a.status === 'confirmed').length}
                  </p>
                  <p className="text-sm text-gray-400">Confirmés</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-400">
                    {patientAppointments.filter(a => a.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-400">En attente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENU PRINCIPAL */}
      <div className="futuristic-card p-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Mes patients</h2>
            <p className="text-gray-400 text-sm mt-1">
              {filteredPatients.length} patient{filteredPatients.length > 1 ? 's' : ''} trouvé{filteredPatients.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {/* Recherche */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="futuristic-input pl-10"
              />
            </div>

            {/* Filtres */}
            <div className="relative group">
              <button className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                <Filter className="w-5 h-5 text-gray-400" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                      filterStatus === 'all' ? 'bg-blue-500/30 text-white' : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    Tous les patients
                  </button>
                  <button
                    onClick={() => setFilterStatus('recent')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                      filterStatus === 'recent' ? 'bg-blue-500/30 text-white' : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    Récents (30 derniers jours)
                  </button>
                  <button
                    onClick={() => setFilterStatus('oldest')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                      filterStatus === 'oldest' ? 'bg-blue-500/30 text-white' : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    Plus anciens
                  </button>
                </div>
              </div>
            </div>

            {/* Export */}
            <button className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
              <Download className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Liste des patients */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Aucun patient trouvé
            </h3>
            <p className="text-gray-400">
              {searchTerm ? 'Aucun résultat pour votre recherche' : 'Vous n\'avez pas encore de patients'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-5 transition-all duration-300 cursor-pointer group"
                onClick={() => handleViewPatientDetails(patient)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Mail className="w-4 h-4" />
                            <span>{patient.email}</span>
                          </div>
                          {patient.phoneNumber && (
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Phone className="w-4 h-4" />
                              <span>{patient.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Dernier rendez-vous</p>
                        <p className="font-medium text-white">
                          {patient.lastAppointment ? formatDate(patient.lastAppointment) : 'Aucun'}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Total rendez-vous</p>
                        <p className="font-medium text-white">{patient.totalAppointments || 0}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Groupe sanguin</p>
                        <p className="font-medium text-white">{patient.bloodType || 'N/A'}</p>
                      </div>
                    </div>

                    {patient.allergies && patient.allergies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {patient.allergies.map((allergy, index) => (
                          <span key={index} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-xs">
                            ⚠️ {allergy}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPatientDetails(patient);
                      }}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-300"
                      title="Voir détails"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatientsPage;
