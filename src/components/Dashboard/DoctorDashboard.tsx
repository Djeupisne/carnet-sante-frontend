import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { Calendar, Users, Clock, DollarSign, X, Check } from 'lucide-react';
import CalendarManagement from './CalendarManagement';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  bloodType: string | null;
  gender: 'male' | 'female' | 'other';
}

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// Étendre l'interface User pour inclure la spécialité
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
  const doctorUser = user as DoctorUser; // Cast vers le type DoctorUser
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
  });

  // États pour la modal de réservation
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const mockTimeSlots = ['08:00', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les statistiques
        const statsResponse = await userService.getDashboardStats();
        setStats(statsResponse.data.stats);

        // Charger les patients depuis la DB
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

          // Mettre à jour les stats avec le nombre réel de patients
          setStats((prev) => ({ ...prev, totalPatients: fetchedPatients.length }));
        } else {
          throw new Error('Format de données invalide pour les patients');
        }

      } catch (error: any) {
        console.error('Erreur lors de la récupération des données:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Impossible de charger les données.';
        setError(errorMessage);

        // Données simulées en cas d'erreur
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
  }, [user]);

  const handleBookingClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowBooking(true);
    setBookingStep(1);
    setSelectedTime('');
    setBookingConfirmed(false);
  };

  const handleConfirmPatient = () => {
    setBookingStep(2);
  };

  const handleConfirmTime = () => {
    if (selectedTime) setBookingStep(3);
  };

  const handleConfirmAppointment = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setShowBooking(false);
      setSelectedPatient(null);
      setBookingStep(1);
      setSelectedTime('');
      alert(`Rendez-vous confirmé avec ${selectedPatient?.firstName} ${selectedPatient?.lastName} à ${selectedTime}`);
    }, 1500);
  };

  const closeBooking = () => {
    setShowBooking(false);
    setSelectedPatient(null);
    setBookingStep(1);
    setSelectedTime('');
    setBookingConfirmed(false);
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

  // Fonction pour formater le genre
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dr. {doctorUser?.firstName} {doctorUser?.lastName}
        </h1>
        <p className="text-gray-600">
          Tableau de bord médical - {doctorUser?.specialty || 'Médecin'}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* STATISTIQUES */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rendez-vous du jour
          </h3>
          <div className="text-center text-gray-500 py-8">
            <Clock className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>Aucun rendez-vous aujourd'hui</p>
          </div>
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
          </div>
        </div>
      </div>

      {/* TABLEAU DES PATIENTS */}
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

      {/* MODAL DE RÉSERVATION */}
      {showBooking && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Planifier un rendez-vous</h2>
              <button 
                onClick={closeBooking} 
                className="text-gray-500 hover:text-gray-700 transition"
              >
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
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={closeBooking} 
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                          Annuler
                        </button>
                        <button 
                          onClick={handleConfirmPatient} 
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
                        >
                          Continuer
                        </button>
                      </div>
                    </div>
                  )}

                  {bookingStep === 2 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Étape 2: Sélectionnez l'heure</h3>
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
                        <button 
                          onClick={() => setBookingStep(1)} 
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
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

                  {bookingStep === 3 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Étape 3: Confirmation</h3>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Détails du rendez-vous:</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Patient:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
                          <p><strong>Heure:</strong> {selectedTime}</p>
                          <p><strong>Date:</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                          <p className="mt-4 p-2 bg-green-100 text-green-800 rounded text-center font-semibold">
                            Aucun paiement requis
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => setBookingStep(2)} 
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                          Retour
                        </button>
                        <button 
                          onClick={handleConfirmAppointment} 
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
                        >
                          Confirmer le rendez-vous
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