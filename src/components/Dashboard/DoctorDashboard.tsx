import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { appointmentService } from '../../services/appointmentService';
import { notificationService } from '../../services/notificationService';
import { Calendar, Users, Clock, DollarSign, X, Check, Bell, ChevronRight } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import CalendarManagement from './CalendarManagement';
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  bloodType: string | null;
  gender: 'male' | 'female' | 'other';
}
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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'today' | 'pending' | 'upcoming' | 'all'>('pending');
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
  });
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [cardInfo, setCardInfo] = useState({ number: '', date: '', cvv: '' });
  const [reason, setReason] = useState('');
  const mockTimeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', 
    '16:00', '16:30', '17:00'
  ];
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
  const fetchAppointments = async () => {
    if (!user?.id) return;
    try {
      setAppointmentsLoading(true);
      console.log('🔄 Chargement des rendez-vous pour le médecin...');
      const data = await appointmentService.getAppointments();
      console.log('📋 Rendez-vous reçus:', data);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const statsResponse = await userService.getDashboardStats();
        setStats(statsResponse.data.stats);
        const patientsResponse = await userService.getAllPatients();
        console.log('🔍 Réponse patients:', patientsResponse);
        if (patientsResponse.data && Array.isArray(patientsResponse.data)) {
          const fetchedPatients: Patient[] = patientsResponse.data.map((p: any) => ({
            id: p.id,
            firstName: p.firstName,
            lastName: p.lastName,
            phoneNumber: p.phoneNumber,
            bloodType: p.bloodType,
            gender: p.gender,
          }));
          setPatients(fetchedPatients);
          setStats((prev) => ({ ...prev, totalPatients: fetchedPatients.length }));
        } else {
          throw new Error('Format de données invalide pour les patients');
        }
        await fetchAppointments();
      } catch (error: any) {
        console.error('Erreur lors de la récupération des données:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Impossible de charger les données.';
        setError(errorMessage);
        const mockPatients: Patient[] = [
          { id: '1', firstName: 'Alice', lastName: 'Dupont', phoneNumber: '+33612345678', bloodType: 'A+', gender: 'female' },
          { id: '2', firstName: 'Bob', lastName: 'Martin', phoneNumber: '+33698765432', bloodType: 'O-', gender: 'male' },
          { id: '3', firstName: 'Charlie', lastName: 'Brown', phoneNumber: null, bloodType: 'B+', gender: 'male' },
          { id: '4', firstName: 'Diana', lastName: 'Prince', phoneNumber: '+33655556666', bloodType: 'AB+', gender: 'female' },
          { id: '5', firstName: 'Eve', lastName: 'Johnson', phoneNumber: '+33644445555', bloodType: null, gender: 'other' },
          { id: '6', firstName: 'Frank', lastName: 'Wilson', phoneNumber: '+33633334444', bloodType: 'A-', gender: 'male' },
        ];
        setPatients(mockPatients);
        setStats({
          totalAppointments: 24,
          todayAppointments: 5,
          totalPatients: mockPatients.length,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, [user]);
  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.confirmAppointment(appointmentId);
      showNotification('✅ Rendez-vous confirmé ! Le patient a été notifié.', 'success');
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
  const handleBookingClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowBooking(true);
    setBookingStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
    setBookingConfirmed(false);
    setCardInfo({ number: '', date: '', cvv: '' });
  };
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };
  const handleConfirmPatient = () => {
    setBookingStep(2);
  };
  const handleConfirmDate = () => {
    if (selectedDate) setBookingStep(3);
  };
  const handleConfirmTime = () => {
    if (selectedTime) setBookingStep(4);
  };
  const handlePayment = async () => {
    if (!cardInfo.number || !cardInfo.date || !cardInfo.cvv) {
      showNotification('Veuillez remplir tous les champs de paiement', 'error');
      return;
    }
    if (!selectedPatient || !selectedDate || !selectedTime || !reason) {
      showNotification('Informations de rendez-vous incomplètes', 'error');
      return;
    }
    try {
      const appointmentData = {
        doctorId: user?.id || '',
        appointmentDate: `${selectedDate}T${selectedTime}:00`,
        duration: 30,
        type: 'in_person' as const,
        reason: reason,
        notes: ''
      };
      await appointmentService.createAppointment(appointmentData);
      setBookingConfirmed(true);
      showNotification('✅ Rendez-vous créé ! Le patient sera notifié.', 'success');
      setTimeout(() => {
        setShowBooking(false);
        setSelectedPatient(null);
        setBookingStep(1);
        setSelectedDate('');
        setSelectedTime('');
        setCardInfo({ number: '', date: '', cvv: '' });
        setReason('');
        fetchAppointments();
      }, 2000);
    } catch (error) {
      console.error('❌ Erreur création rendez-vous:', error);
      showNotification('Erreur lors de la création du rendez-vous', 'error');
    }
  };
  const closeBooking = () => {
    setShowBooking(false);
    setSelectedPatient(null);
    setBookingStep(1);
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
    setBookingConfirmed(false);
    setCardInfo({ number: '', date: '', cvv: '' });
  };
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
      title: 'Revenus mensuels',
      value: '0 €',
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ];
  const formatGender = (gender: string) => {
    switch (gender) {
      case 'male': return 'Homme';
      case 'female': return 'Femme';
      case 'other': return 'Autre';
      default: return gender;
    }
  };
  return (
    <div className="space-y-6">
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
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actions rapides
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                <span>Gérer mes disponibilités</span>
              </div>
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-3" />
                <span>Voir mes patients</span>
              </div>
            </button>
            <Link
              to="/doctor/appointments"
              className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                <span>Tous les rendez-vous</span>
              </div>
            </Link>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Statistiques</h4>
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
                <span className="text-gray-600">Patients total</span>
                <span className="font-semibold text-blue-600">
                  {new Set(appointments.map(a => a.patientId)).size}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Liste des patients</h2>
          <div className="text-sm text-gray-500">
            {loading ? 'Chargement...' : `${patients.length} patient(s) trouvé(s)`}
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">Chargement des patients...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Aucun patient disponible</p>
            <p className="text-gray-400 text-sm mt-2">
              Les patients apparaîtront ici une fois qu'ils seront inscrits dans le système.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-gray-900">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-4 font-semibold">Nom</th>
                  <th className="text-left py-4 px-4 font-semibold">Prénom</th>
                  <th className="text-left py-4 px-4 font-semibold">Numéro de téléphone</th>
                  <th className="text-left py-4 px-4 font-semibold">Groupe sanguin</th>
                  <th className="text-left py-4 px-4 font-semibold">Genre</th>
                  <th className="text-left py-4 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{patient.lastName}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{patient.firstName}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-700">{patient.phoneNumber || '-'}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.bloodType 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.bloodType || 'Non renseigné'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.gender === 'female' 
                          ? 'bg-pink-100 text-pink-800'
                          : patient.gender === 'male'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {formatGender(patient.gender)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleBookingClick(patient)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-200 transform hover:scale-105"
                      >
                        Prendre RDV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <CalendarManagement />
      {showBooking && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Planifier un rendez-vous</h2>
              <button onClick={closeBooking} className="text-gray-500 hover:text-gray-700 transition">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {bookingConfirmed ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Check size={32} className="text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Rendez-vous confirmé!</h3>
                  <p className="text-gray-600">Le rendez-vous a été planifié avec succès.</p>
                  <p className="text-gray-500 text-sm mt-2">Le patient sera notifié.</p>
                </div>
              ) : (
                <>
                  {bookingStep === 1 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Étape 1: Patient sélectionné</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <p className="text-lg font-semibold text-gray-900">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Téléphone: {selectedPatient.phoneNumber || 'Non renseigné'}</p>
                          <p>Groupe sanguin: {selectedPatient.bloodType || 'Non renseigné'}</p>
                        </div>
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Motif de la consultation
                        </label>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          rows={3}
                          placeholder="Décrivez brièvement le motif de la consultation..."
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <button onClick={closeBooking} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                          Annuler
                        </button>
                        <button 
                          onClick={handleConfirmPatient} 
                          disabled={!reason}
                          className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                            reason 
                              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                              : 'bg-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Continuer
                        </button>
                      </div>
                    </div>
                  )}
                  {bookingStep === 2 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Étape 2: Sélectionnez la date</h3>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date du rendez-vous
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                          {generateDates().map((date) => (
                            <button
                              key={date}
                              onClick={() => handleDateSelect(date)}
                              className={`py-2 px-3 rounded-lg font-semibold transition ${
                                selectedDate === date
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              }`}
                            >
                              {new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setBookingStep(1)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                          Retour
                        </button>
                        <button 
                          onClick={handleConfirmDate} 
                          disabled={!selectedDate} 
                          className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                            selectedDate ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Continuer
                        </button>
                      </div>
                    </div>
                  )}
                  {bookingStep === 3 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Étape 3: Sélectionnez l'heure</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Date sélectionnée: {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                        {mockTimeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-3 px-4 rounded-lg font-semibold transition ${
                              selectedTime === slot
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setBookingStep(2)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                          Retour
                        </button>
                        <button 
                          onClick={handleConfirmTime} 
                          disabled={!selectedTime} 
                          className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                            selectedTime ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Continuer
                        </button>
                      </div>
                    </div>
                  )}
                  {bookingStep === 4 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Étape 4: Paiement sécurisé</h3>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Récapitulatif du rendez-vous</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Patient:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
                          <p><strong>Motif:</strong> {reason}</p>
                          <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          <p><strong>Heure:</strong> {selectedTime}</p>
                          <div className="border-t border-gray-200 mt-3 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Total à payer:</span>
                              <span className="text-2xl font-bold text-blue-600">50 €</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de carte
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardInfo.number}
                          onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date d'expiration
                          </label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            value={cardInfo.date}
                            onChange={(e) => setCardInfo({ ...cardInfo, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cardInfo.cvv}
                            onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setBookingStep(3)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                          Retour
                        </button>
                        <button 
                          onClick={handlePayment} 
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-semibold flex items-center gap-2"
                        >
                          <CreditCard size={18} />
                          Payer 50 €
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
export default DoctorDashboard;
