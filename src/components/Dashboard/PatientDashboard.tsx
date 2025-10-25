import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { calendarService } from '../../services/calendarService';
import { userService } from '../../services/userService';
import { appointmentService } from '../../services/appointmentService'; // Ajout
import { X, Check } from 'lucide-react';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  available: boolean;
  availableSlots: string[];
}

interface Calendar {
  id: string;
  date: string;
  slots: string[];
  confirmed: boolean;
  doctor: { firstName: string; lastName: string };
}

// Supprimez l'ancienne interface Appointment et utilisez celle de vos types
interface Appointment {
  id: string;
  doctor: { firstName: string; lastName: string; specialty: string };
  appointmentDate: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  type: 'in_person' | 'teleconsultation' | 'home_visit';
  reason: string;
}

const PatientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]); // Modifié
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true); // Nouvel état
  const [error, setError] = useState<string | null>(null);
  
  // États pour la modal de réservation
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [cardInfo, setCardInfo] = useState({ number: '', date: '', cvv: '' });

  const medicalSummary = {
    allergies: 2,
    medications: 3,
    conditions: 1,
  };

  // Fonction pour charger les rendez-vous depuis la base de données
  const fetchAppointments = async () => {
    if (!user?.id) {
      setAppointmentsLoading(false);
      return;
    }

    try {
      setAppointmentsLoading(true);
      const appointments = await appointmentService.getAppointments();
      
      // Transformer les données pour correspondre à l'interface
      const transformedAppointments: Appointment[] = appointments.map((apt: any) => ({
        id: apt.id,
        doctor: {
          firstName: apt.doctor.firstName,
          lastName: apt.doctor.lastName,
          specialty: apt.doctor.specialty
        },
        appointmentDate: apt.appointmentDate,
        duration: apt.duration,
        status: apt.status,
        type: apt.type,
        reason: apt.reason
      }));

      // Filtrer pour n'afficher que les rendez-vous à venir
      const now = new Date();
      const upcoming = transformedAppointments.filter(apt => {
        const appointmentDate = new Date(apt.appointmentDate);
        return appointmentDate >= now && apt.status !== 'cancelled' && apt.status !== 'completed';
      });

      setUpcomingAppointments(upcoming);
    } catch (err) {
      console.error('Erreur lors du chargement des rendez-vous:', err);
      // En cas d'erreur, utilisez des données par défaut
      setUpcomingAppointments([
        {
          id: '1',
          doctor: { firstName: 'Marie', lastName: 'Dubois', specialty: 'Cardiologie' },
          appointmentDate: '2024-01-15T10:00:00',
          duration: 30,
          status: 'confirmed',
          type: 'in_person',
          reason: 'Consultation de routine'
        }
      ]);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Charger les docteurs depuis la DB
        const doctorsResponse = await userService.getAllDoctors();
        const fetchedDoctors: Doctor[] = doctorsResponse.data.map((d: any) => ({
          id: d.id,
          firstName: d.firstName,
          lastName: d.lastName,
          specialty: d.specialty || 'Non spécifié',
          available: d.isActive,
          availableSlots: d.availability?.slots || ['09:00', '10:00', '11:00', '14:00', '15:00'],
        }));
        
        setDoctors(fetchedDoctors);
        setCalendars([]);
        
        // Charger les rendez-vous
        await fetchAppointments();
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Impossible de charger les données. Utilisation des données de secours.');

        // Données simulées en cas d'erreur
        const mockDoctors: Doctor[] = [
          { 
            id: '1', 
            firstName: 'Marie', 
            lastName: 'Dubois', 
            specialty: 'Cardiologie', 
            available: true, 
            availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'] 
          },
          { 
            id: '2', 
            firstName: 'Pierre', 
            lastName: 'Martin', 
            specialty: 'Dermatologie', 
            available: true, 
            availableSlots: ['10:30', '14:00', '16:00'] 
          },
        ];
        
        setDoctors(mockDoctors);
        setCalendars([]);
        setUpcomingAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // Fonction pour formater la date
  const formatAppointmentDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  // Fonction pour formater l'heure
  const formatAppointmentTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Heure invalide';
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status: string) => {
    const statusMap = {
      confirmed: '✓ Confirmé',
      pending: '○ En attente',
      scheduled: '○ Planifié',
      completed: 'Terminé',
      cancelled: 'Annulé',
      no_show: 'Non honoré'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  // Fonction pour obtenir la classe CSS du statut
  const getStatusClass = (status: string) => {
    const classMap = {
      confirmed: 'bg-green-500/20 text-green-300 border border-green-500/30',
      pending: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      scheduled: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      completed: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border border-red-500/30',
      no_show: 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
    };
    return classMap[status as keyof typeof classMap] || classMap.pending;
  };

  // ... (le reste de vos fonctions handleBookingClick, handleConfirmDoctor, etc. reste inchangé)

  // Dans le JSX, remplacez la section des rendez-vous à venir par :
  {/* SECTION DES RENDEZ-VOUS À VENIR */}
  <div className="lg:col-span-2 futuristic-card p-8">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-black gradient-text">
          Rendez-vous à venir
        </h2>
        <p className="text-white/60 text-sm mt-1">Vos prochaines consultations</p>
      </div>
      <Link
        to="/appointments"
        className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition"
      >
        Voir tout →
      </Link>
    </div>
    
    {appointmentsLoading ? (
      <div className="text-center py-12">
        <p className="text-white/50 text-lg">Chargement des rendez-vous...</p>
      </div>
    ) : upcomingAppointments.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-white/50 text-lg">Aucun rendez-vous à venir</p>
        <Link
          to="/appointments/book"
          className="inline-block mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
        >
          Prendre un rendez-vous
        </Link>
      </div>
    ) : (
      <div className="space-y-4">
        {upcomingAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-5 transition duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-lg">
                    👨‍⚕️
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                    </p>
                    <p className="text-xs text-white/60">
                      {appointment.doctor.specialty}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-white/70 mt-3">
                  <span>📅 {formatAppointmentDate(appointment.appointmentDate)}</span>
                  <span>🕐 {formatAppointmentTime(appointment.appointmentDate)}</span>
                  <span>⏱️ {appointment.duration} min</span>
                </div>
                {appointment.reason && (
                  <p className="text-white/60 text-sm mt-2">
                    Motif: {appointment.reason}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(appointment.status)}`}
                >
                  {getStatusText(appointment.status)}
                </span>
                <Link
                  to={`/appointments/${appointment.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition"
                >
                  Détails →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>