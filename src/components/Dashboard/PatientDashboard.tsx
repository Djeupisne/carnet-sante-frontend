import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { calendarService } from '../../services/calendarService';
import { userService } from '../../services/userService';
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

interface Appointment {
  id: string;
  doctor: { firstName: string; lastName: string; specialization: string };
  date: string;
  startTime: string;
  status: 'confirmed' | 'scheduled';
}

const PatientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour la modal de réservation
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [cardInfo, setCardInfo] = useState({ number: '', date: '', cvv: '' });

  const upcomingAppointments: Appointment[] = [
    {
      id: '1',
      doctor: { firstName: 'Marie', lastName: 'Dubois', specialization: 'Cardiologie' },
      date: '2024-01-15',
      startTime: '10:00',
      status: 'confirmed' as const,
    },
    {
      id: '2',
      doctor: { firstName: 'Pierre', lastName: 'Martin', specialization: 'Dermatologie' },
      date: '2024-01-20',
      startTime: '14:30',
      status: 'scheduled' as const,
    },
  ];

  const medicalSummary = {
    allergies: 2,
    medications: 3,
    conditions: 1,
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
          { 
            id: '3', 
            firstName: 'Sophie', 
            lastName: 'Laurent', 
            specialty: 'Neurologie', 
            available: false, 
            availableSlots: [] 
          },
          { 
            id: '4', 
            firstName: 'Jean', 
            lastName: 'Bernard', 
            specialty: 'Pédiatrie', 
            available: true, 
            availableSlots: ['09:30', '13:00', '15:30'] 
          },
        ];
        
        setDoctors(mockDoctors);
        setCalendars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleBookingClick = (doctor: Doctor) => {
    if (!doctor.available) return;
    setSelectedDoctor(doctor);
    setShowBooking(true);
    setBookingStep(1);
    setSelectedTime('');
    setBookingConfirmed(false);
    setCardInfo({ number: '', date: '', cvv: '' });
  };

  const handleConfirmDoctor = () => {
    setBookingStep(2);
  };

  const handleConfirmTime = () => {
    if (selectedTime) setBookingStep(3);
  };

  const handlePayment = () => {
    if (cardInfo.number && cardInfo.date && cardInfo.cvv) {
      setBookingConfirmed(true);
      setTimeout(() => {
        setShowBooking(false);
        setSelectedDoctor(null);
        setBookingStep(1);
        alert(`Rendez-vous confirmé avec Dr. ${selectedDoctor?.firstName} ${selectedDoctor?.lastName} à ${selectedTime}`);
      }, 1500);
    } else {
      alert('Veuillez remplir tous les champs de paiement');
    }
  };

  const closeBooking = () => {
    setShowBooking(false);
    setSelectedDoctor(null);
    setBookingStep(1);
    setSelectedTime('');
    setBookingConfirmed(false);
    setCardInfo({ number: '', date: '', cvv: '' });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">⚕️</span>
                </div>
                <h1 className="text-xl font-black gradient-text text-white">NEXUS HEALTH</h1>
              </div>
              <nav className="hidden md:flex space-x-1 ml-12">
                <Link to="/dashboard" className="text-white/80 hover:text-white px-4 py-2 text-sm font-medium transition rounded-lg hover:bg-white/10">
                  Tableau de bord
                </Link>
                <Link to="/appointments" className="text-white/80 hover:text-white px-4 py-2 text-sm font-medium transition rounded-lg hover:bg-white/10">
                  Rendez-vous
                </Link>
                <Link to="/medical-file" className="text-white/80 hover:text-white px-4 py-2 text-sm font-medium transition rounded-lg hover:bg-white/10">
                  Dossier Médical
                </Link>
                <Link to="/profile" className="text-white/80 hover:text-white px-4 py-2 text-sm font-medium transition rounded-lg hover:bg-white/10">
                  Mon Profil
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-white/60">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-white/60 hover:text-white text-sm font-medium transition px-3 py-1 rounded-lg hover:bg-white/10"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 animate-slide-in">
          <h1 className="text-4xl font-black text-white mb-2 animate-float">
            Bienvenue, {user?.firstName}
          </h1>
          <p className="text-lg text-white/60">
            Gérez votre santé avec la plateforme médicale du futur
          </p>
        </div>

        {error && (
          <div className="futuristic-card p-4 mb-8 border-red-500/50 bg-red-500/10">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* TABLEAU DES MÉDECINS DISPONIBLES */}
        <div className="futuristic-card p-8 mb-12">
          <h2 className="text-2xl font-black gradient-text mb-8">
            Disponibilités des médecins
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white/50 text-lg">Chargement des disponibilités...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/50 text-lg">Aucun médecin disponible pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-4 px-4 font-semibold">Médecin</th>
                    <th className="text-left py-4 px-4 font-semibold">Spécialité</th>
                    <th className="text-left py-4 px-4 font-semibold">Statut</th>
                    <th className="text-left py-4 px-4 font-semibold">Créneaux disponibles</th>
                    <th className="text-left py-4 px-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="border-b border-white/10 hover:bg-white/5 transition">
                      <td className="py-4 px-4">
                        <p className="font-semibold">Dr. {doctor.firstName} {doctor.lastName}</p>
                      </td>
                      <td className="py-4 px-4 text-white/80">{doctor.specialty}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          doctor.available
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {doctor.available ? '✓ Disponible' : '✗ Non disponible'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white/80">
                        {doctor.available ? `${doctor.availableSlots.length} créneaux` : '-'}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleBookingClick(doctor)}
                          disabled={!doctor.available}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            doctor.available
                              ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                              : 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                          }`}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/50 text-lg">Aucun rendez-vous à venir</p>
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
                              {appointment.doctor.specialization}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-white/70 mt-3">
                          <span>📅 {new Date(appointment.date).toLocaleDateString('fr-FR')}</span>
                          <span>🕐 {appointment.startTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {appointment.status === 'confirmed' ? '✓ Confirmé' : '○ Planifié'}
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

          <div className="futuristic-card p-8">
            <h2 className="text-2xl font-black gradient-text mb-8">
              Résumé Médical
            </h2>
            <div className="space-y-4 mb-8">
              {[
                { label: 'Allergies', value: medicalSummary.allergies, icon: '🚫', color: 'from-red-500 to-pink-500' },
                { label: 'Médicaments', value: medicalSummary.medications, icon: '💊', color: 'from-green-500 to-emerald-500' },
                { label: 'Conditions', value: medicalSummary.conditions, icon: '⚕️', color: 'from-blue-500 to-cyan-500' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center text-xl`}>
                        {item.icon}
                      </div>
                      <p className="text-white/80 font-medium">{item.label}</p>
                    </div>
                    <p className="text-2xl font-black gradient-text">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold text-white/80 uppercase mb-4">Dernières activités</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Dernière consultation</span>
                  <span className="text-white font-medium">15 déc. 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Prochain RDV</span>
                  <span className="text-white font-medium">15 janv. 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Médicaments actifs</span>
                  <span className="text-white font-medium">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE RÉSERVATION */}
      {showBooking && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Réserver un rendez-vous</h2>
              <button onClick={closeBooking} className="text-gray-500 hover:text-gray-700">
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
                  <p className="text-gray-600">Votre paiement a été traité avec succès.</p>
                </div>
              ) : (
                <>
                  {bookingStep === 1 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Étape 1: Médecin sélectionné</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <p className="text-lg font-semibold text-gray-900">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                        <p className="text-gray-600 mt-2">{selectedDoctor.specialty}</p>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button onClick={closeBooking} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
                        <button onClick={handleConfirmDoctor} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">Continuer</button>
                      </div>
                    </div>
                  )}

                  {bookingStep === 2 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Étape 2: Sélectionnez l'heure</h3>
                      <div className="grid grid-cols-4 gap-2 mb-6">
                        {selectedDoctor.availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 px-3 rounded-lg font-semibold transition ${
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
                        <button onClick={closeBooking} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
                        <button onClick={handleConfirmTime} disabled={!selectedTime} className={`px-4 py-2 rounded-lg text-white font-semibold ${
                          selectedTime ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
                        }`}>
                          Continuer
                        </button>
                      </div>
                    </div>
                  )}

                  {bookingStep === 3 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Étape 3: Paiement</h3>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-2">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                        <p className="text-sm text-gray-600">Heure: {selectedTime}</p>
                        <p className="text-lg font-bold text-gray-900 mt-4">Montant: 50 €</p>
                      </div>

                      <div className="space-y-4 mb-6">
                        <input
                          type="text"
                          placeholder="Numéro de carte"
                          value={cardInfo.number}
                          onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardInfo.date}
                            onChange={(e) => setCardInfo({ ...cardInfo, date: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            value={cardInfo.cvv}
                            onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button onClick={closeBooking} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Annuler</button>
                        <button onClick={handlePayment} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">Payer 50 €</button>
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

export default PatientDashboard;