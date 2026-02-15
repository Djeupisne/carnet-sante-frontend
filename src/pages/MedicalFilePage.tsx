import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Pill, 
  AlertCircle,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Scale,
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Plus,
  ChevronRight,
  Edit,
  Trash,
  Eye,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface MedicalRecord {
  id: string;
  recordType: string;
  title: string;
  description: string;
  date: string;
  doctorName: string;
  doctorSpecialty: string;
  attachments?: string[];
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'stopped';
}

interface Allergy {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  diagnosedDate: string;
}

interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'ongoing';
  notes?: string;
}

const MedicalFilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'records' | 'medications' | 'allergies' | 'conditions'>('records');
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([
    {
      id: '1',
      recordType: 'Consultation',
      title: 'Consultation de routine',
      description: 'Examen général, tension artérielle normale, poids stable',
      date: '2024-02-15T10:30:00',
      doctorName: 'Dr. Jean Dupont',
      doctorSpecialty: 'Médecine générale'
    },
    {
      id: '2',
      recordType: 'Analyse',
      title: 'Bilan sanguin',
      description: 'Glycémie: 0.95 g/L, Cholestérol total: 2.1 g/L, Triglycérides: 1.2 g/L',
      date: '2024-02-10T09:15:00',
      doctorName: 'Dr. Marie Martin',
      doctorSpecialty: 'Biologie médicale'
    },
    {
      id: '3',
      recordType: 'Prescription',
      title: 'Renouvellement ordonnance',
      description: 'Traitement pour l\'hypertension à renouveler pour 3 mois',
      date: '2024-02-05T14:45:00',
      doctorName: 'Dr. Pierre Dubois',
      doctorSpecialty: 'Cardiologie'
    }
  ]);

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Amlodipine',
      dosage: '5mg',
      frequency: '1 fois par jour',
      startDate: '2024-01-15',
      prescribedBy: 'Dr. Pierre Dubois',
      status: 'active'
    },
    {
      id: '2',
      name: 'Paracétamol',
      dosage: '1000mg',
      frequency: 'Si besoin',
      startDate: '2024-02-01',
      prescribedBy: 'Dr. Jean Dupont',
      status: 'active'
    },
    {
      id: '3',
      name: 'Amoxicilline',
      dosage: '500mg',
      frequency: '3 fois par jour',
      startDate: '2024-01-10',
      endDate: '2024-01-20',
      prescribedBy: 'Dr. Jean Dupont',
      status: 'completed'
    }
  ]);

  const [allergies, setAllergies] = useState<Allergy[]>([
    {
      id: '1',
      name: 'Pénicilline',
      severity: 'severe',
      reaction: 'Éruption cutanée, difficultés respiratoires',
      diagnosedDate: '2018-03-20'
    },
    {
      id: '2',
      name: 'Pollens',
      severity: 'mild',
      reaction: 'Éternuements, démangeaisons',
      diagnosedDate: '2015-05-10'
    }
  ]);

  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>([
    {
      id: '1',
      name: 'Hypertension artérielle',
      diagnosedDate: '2019-11-05',
      status: 'active',
      notes: 'Bien contrôlée avec traitement'
    },
    {
      id: '2',
      name: 'Asthme',
      diagnosedDate: '2010-08-22',
      status: 'active',
      notes: 'Crise occasionnelle'
    }
  ]);

  useEffect(() => {
    // Simuler un chargement
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
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

  const getSeverityBadge = (severity: string) => {
    const config = {
      mild: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Léger' },
      moderate: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', label: 'Modéré' },
      severe: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', label: 'Sévère' }
    };
    const c = config[severity as keyof typeof config] || config.mild;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text} border ${c.border}`}>
        {c.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', label: 'Actif' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', label: 'Terminé' },
      stopped: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', label: 'Arrêté' },
      resolved: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', label: 'Résolu' },
      ongoing: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', label: 'En cours' }
    };
    const c = config[status as keyof typeof config] || config.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text} border ${c.border}`}>
        {c.label}
      </span>
    );
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
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-black gradient-text text-white">Dossier Médical</h1>
              </div>
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
                  <p className="text-xs text-white/60">Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'records', label: 'Dossiers médicaux', icon: FileText },
              { id: 'medications', label: 'Traitements', icon: Pill },
              { id: 'allergies', label: 'Allergies', icon: AlertCircle },
              { id: 'conditions', label: 'Conditions', icon: Heart }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-white/60 hover:text-white/80'
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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* En-tête avec actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {activeTab === 'records' && 'Dossiers médicaux'}
              {activeTab === 'medications' && 'Traitements en cours'}
              {activeTab === 'allergies' && 'Allergies'}
              {activeTab === 'conditions' && 'Conditions médicales'}
            </h2>
            <p className="text-white/60 text-sm mt-1">
              {activeTab === 'records' && 'Historique de vos consultations et examens'}
              {activeTab === 'medications' && 'Médicaments prescrits'}
              {activeTab === 'allergies' && 'Liste de vos allergies'}
              {activeTab === 'conditions' && 'Problèmes de santé chroniques'}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 transition">
              <Download className="w-4 h-4" />
              <span className="text-sm">Exporter</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Ajouter</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Chargement de votre dossier médical...</p>
          </div>
        ) : (
          <>
            {/* Dossiers médicaux */}
            {activeTab === 'records' && (
              <div className="space-y-4">
                {medicalRecords.map((record) => {
                  const { date, time } = formatDateTime(record.date);
                  return (
                    <div
                      key={record.id}
                      className="futuristic-card p-6 hover:border-white/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{record.title}</h3>
                              <p className="text-sm text-blue-400">{record.recordType}</p>
                            </div>
                          </div>
                          
                          <p className="text-white/80 mb-4">{record.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {time}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {record.doctorName} - {record.doctorSpecialty}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Traitements */}
            {activeTab === 'medications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="futuristic-card p-6 hover:border-white/30 transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Pill className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{med.name}</h3>
                          <p className="text-sm text-white/60">{med.dosage}</p>
                        </div>
                      </div>
                      {getStatusBadge(med.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm text-white/80">
                      <p>Fréquence: {med.frequency}</p>
                      <p>Prescrit par: {med.prescribedBy}</p>
                      <p>Début: {formatDate(med.startDate)}</p>
                      {med.endDate && <p>Fin: {formatDate(med.endDate)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Allergies */}
            {activeTab === 'allergies' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allergies.map((allergy) => (
                  <div
                    key={allergy.id}
                    className="futuristic-card p-6 hover:border-white/30 transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          allergy.severity === 'severe' ? 'bg-red-500/20' :
                          allergy.severity === 'moderate' ? 'bg-orange-500/20' :
                          'bg-yellow-500/20'
                        }`}>
                          <AlertCircle className={`w-5 h-5 ${
                            allergy.severity === 'severe' ? 'text-red-400' :
                            allergy.severity === 'moderate' ? 'text-orange-400' :
                            'text-yellow-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{allergy.name}</h3>
                          <p className="text-sm text-white/60">Diagnostiqué le {formatDate(allergy.diagnosedDate)}</p>
                        </div>
                      </div>
                      {getSeverityBadge(allergy.severity)}
                    </div>
                    
                    <p className="text-white/80 text-sm">
                      <span className="font-medium text-white/60">Réaction:</span> {allergy.reaction}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Conditions médicales */}
            {activeTab === 'conditions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medicalConditions.map((condition) => (
                  <div
                    key={condition.id}
                    className="futuristic-card p-6 hover:border-white/30 transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Heart className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{condition.name}</h3>
                          <p className="text-sm text-white/60">Diagnostiqué le {formatDate(condition.diagnosedDate)}</p>
                        </div>
                      </div>
                      {getStatusBadge(condition.status)}
                    </div>
                    
                    {condition.notes && (
                      <p className="text-white/80 text-sm mt-2">
                        <span className="font-medium text-white/60">Notes:</span> {condition.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MedicalFilePage;
