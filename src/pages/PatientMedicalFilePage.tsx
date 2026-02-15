import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { medicalFileService, MedicalFile, Medication, Allergy, MedicalCondition } from '../services/medicalFileService';
import { userService } from '../services/userService';
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
  Droplets,
  Scale,
  ArrowLeft,
  Download,
  Printer,
  Eye,
  X,
  ChevronRight,
  Loader2
} from 'lucide-react';

const PatientMedicalFilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'records' | 'medications' | 'allergies' | 'conditions'>('records');
  const [medicalRecords, setMedicalRecords] = useState<MedicalFile[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [conditions, setConditions] = useState<MedicalCondition[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalFile | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchMedicalData();
    }
  }, [user?.id]);

  const fetchMedicalData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les dossiers médicaux
      const recordsResponse = await medicalFileService.getPatientMedicalFiles(user!.id);
      if (recordsResponse.success) {
        setMedicalRecords(recordsResponse.data);
      }

      // Récupérer les médicaments
      const meds = await medicalFileService.getMedications(user!.id);
      setMedications(meds);

      // Récupérer les allergies
      const alls = await medicalFileService.getAllergies(user!.id);
      setAllergies(alls);

      // Récupérer les conditions
      const conds = await medicalFileService.getMedicalConditions(user!.id);
      setConditions(conds);

    } catch (error) {
      console.error('❌ Erreur chargement données médicales:', error);
      showNotification('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
    } catch {
      return { date: 'Date invalide', time: '' };
    }
  };

  const getRecordTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      consultation: 'Consultation',
      lab_result: 'Résultat d\'analyse',
      prescription: 'Prescription',
      vaccination: 'Vaccination',
      allergy: 'Allergie',
      surgery: 'Chirurgie',
      hospitalization: 'Hospitalisation',
      chronic_disease: 'Maladie chronique',
      family_history: 'Antécédent familial'
    };
    return types[type] || type;
  };

  const getSeverityBadge = (severity: string) => {
    const config = {
      mild: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', label: 'Léger' },
      moderate: { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30', label: 'Modéré' },
      severe: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', label: 'Sévère' }
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
      active: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30', label: 'Actif' },
      completed: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', label: 'Terminé' },
      stopped: { bg: 'bg-gray-500/20', text: 'text-gray-300', border: 'border-gray-500/30', label: 'Arrêté' },
      resolved: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30', label: 'Résolu' },
      ongoing: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', label: 'En cours' }
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
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
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
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'records', label: 'Dossiers', icon: FileText, count: medicalRecords.length },
              { id: 'medications', label: 'Traitements', icon: Pill, count: medications.length },
              { id: 'allergies', label: 'Allergies', icon: AlertCircle, count: allergies.length },
              { id: 'conditions', label: 'Conditions', icon: Heart, count: conditions.length }
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
                  {tab.count > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-white/10 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-white/60">Chargement de votre dossier médical...</p>
          </div>
        ) : (
          <>
            {/* Dossiers médicaux */}
            {activeTab === 'records' && (
              <div className="space-y-4">
                {medicalRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">Aucun dossier médical trouvé</p>
                  </div>
                ) : (
                  medicalRecords.map((record) => {
                    const { date, time } = formatDateTime(record.consultationDate);
                    return (
                      <div
                        key={record.id}
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowRecordModal(true);
                        }}
                        className="futuristic-card p-6 hover:border-white/30 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`p-2 rounded-lg ${
                                record.isCritical ? 'bg-red-500/20' : 'bg-blue-500/20'
                              }`}>
                                <FileText className={`w-5 h-5 ${
                                  record.isCritical ? 'text-red-400' : 'text-blue-400'
                                }`} />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">{record.title}</h3>
                                <p className="text-sm text-blue-400">{getRecordTypeLabel(record.recordType)}</p>
                              </div>
                              {record.isCritical && (
                                <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-semibold border border-red-500/30">
                                  Critique
                                </span>
                              )}
                            </div>
                            
                            {record.description && (
                              <p className="text-white/80 mb-4 line-clamp-2">{record.description}</p>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {time}
                              </span>
                              {record.doctor && (
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  Dr. {record.doctor.firstName} {record.doctor.lastName}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Traitements */}
            {activeTab === 'medications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medications.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <Pill className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">Aucun traitement en cours</p>
                  </div>
                ) : (
                  medications.map((med, index) => (
                    <div
                      key={med.id || index}
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
                  ))
                )}
              </div>
            )}

            {/* Allergies */}
            {activeTab === 'allergies' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allergies.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <AlertCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">Aucune allergie enregistrée</p>
                  </div>
                ) : (
                  allergies.map((allergy) => (
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
                      {allergy.notes && (
                        <p className="text-white/60 text-sm mt-2">{allergy.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Conditions médicales */}
            {activeTab === 'conditions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {conditions.length === 0 ? (
                  <div className="col-span-2 text-center py-12">
                    <Heart className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">Aucune condition médicale enregistrée</p>
                  </div>
                ) : (
                  conditions.map((condition) => (
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
                        <p className="text-white/80 text-sm mt-2">{condition.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal détails dossier médical */}
      {showRecordModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Détails du dossier
              </h2>
              <button
                onClick={() => setShowRecordModal(false)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedRecord.title}</h3>
                  <p className="text-blue-400 mt-1">{getRecordTypeLabel(selectedRecord.recordType)}</p>
                </div>
                {selectedRecord.isCritical && (
                  <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm font-semibold border border-red-500/30">
                    Critique
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-sm text-white/60">Date de consultation</p>
                  <p className="text-white font-medium">
                    {new Date(selectedRecord.consultationDate).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                {selectedRecord.nextAppointment && (
                  <div>
                    <p className="text-sm text-white/60">Prochain rendez-vous</p>
                    <p className="text-white font-medium">
                      {new Date(selectedRecord.nextAppointment).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>

              {selectedRecord.doctor && (
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-blue-400 mb-1">Médecin</p>
                  <p className="text-white font-medium">
                    Dr. {selectedRecord.doctor.firstName} {selectedRecord.doctor.lastName}
                  </p>
                  {selectedRecord.doctor.specialty && (
                    <p className="text-sm text-white/60 mt-1">{selectedRecord.doctor.specialty}</p>
                  )}
                </div>
              )}

              {selectedRecord.description && (
                <div>
                  <p className="text-sm text-white/60 mb-1">Description</p>
                  <p className="text-white bg-white/5 p-3 rounded-lg">{selectedRecord.description}</p>
                </div>
              )}

              {selectedRecord.diagnosis && (
                <div>
                  <p className="text-sm text-white/60 mb-1">Diagnostic</p>
                  <p className="text-white bg-white/5 p-3 rounded-lg">{selectedRecord.diagnosis}</p>
                </div>
              )}

              {selectedRecord.symptoms && (
                <div>
                  <p className="text-sm text-white/60 mb-1">Symptômes</p>
                  <p className="text-white bg-white/5 p-3 rounded-lg">
                    {Array.isArray(selectedRecord.symptoms) 
                      ? selectedRecord.symptoms.join(', ')
                      : JSON.stringify(selectedRecord.symptoms)}
                  </p>
                </div>
              )}

              {selectedRecord.medications && (
                <div>
                  <p className="text-sm text-white/60 mb-2">Médicaments prescrits</p>
                  <div className="space-y-2">
                    {Array.isArray(selectedRecord.medications) && selectedRecord.medications.map((med: any, idx: number) => (
                      <div key={idx} className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <p className="font-medium text-white">{med.name || 'Médicament'}</p>
                        <p className="text-sm text-white/60">{med.dosage} - {med.frequency}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.labResults && (
                <div>
                  <p className="text-sm text-white/60 mb-2">Résultats d'analyses</p>
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <pre className="text-sm text-white/80 whitespace-pre-wrap">
                      {JSON.stringify(selectedRecord.labResults, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {selectedRecord.vitalSigns && (
                <div>
                  <p className="text-sm text-white/60 mb-2">Signes vitaux</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(selectedRecord.vitalSigns).map(([key, value]) => (
                      <div key={key} className="bg-white/5 rounded-lg p-2 text-center">
                        <p className="text-xs text-white/60">{key}</p>
                        <p className="text-white font-medium">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMedicalFilePage;
