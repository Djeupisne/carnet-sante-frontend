import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { calendarService } from '../services/calendarService';
import { Calendar, Check, Trash, Edit, Plus, X, Clock, Save, AlertCircle, AlertTriangle, ArrowLeft, LogOut, Bell } from 'lucide-react';

// Interface correspondant au service
interface Calendar {
  id: string;
  date: string;
  slots: string[];
  confirmed: boolean;
  doctor?: { firstName: string; lastName: string; id: string };
}

interface DoctorUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialty?: string;
}

const DoctorCalendarPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const doctorUser = user as DoctorUser;
  
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [newCalendar, setNewCalendar] = useState({ date: '', slots: [''] });
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      setLoading(true);
      console.log('📅 Récupération des calendriers...');
      
      const response = await calendarService.getDoctorCalendars();
      
      if (response && response.success && response.data) {
        const calendarsData = Array.isArray(response.data) ? response.data : [];
        console.log(`✅ ${calendarsData.length} calendrier(s) récupéré(s)`);
        setCalendars(calendarsData);
      } else {
        console.warn('⚠️ Format de réponse inattendu:', response);
        setCalendars([]);
      }
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des calendriers:', error);
      showNotification(
        error.response?.data?.message || 'Impossible de charger les calendriers',
        'error'
      );
      setCalendars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCalendar = async () => {
    // Validation
    if (!newCalendar.date) {
      showNotification('Veuillez sélectionner une date', 'error');
      return;
    }
    
    // Filtrer les créneaux vides
    const validSlots = newCalendar.slots.filter(slot => slot.trim() !== '');
    if (validSlots.length === 0) {
      showNotification('Veuillez ajouter au moins un créneau horaire', 'error');
      return;
    }

    try {
      console.log('📅 Création du calendrier:', { date: newCalendar.date, slots: validSlots });
      
      const response = await calendarService.createCalendar({
        date: newCalendar.date,
        slots: validSlots
      });
      
      if (response && response.success && response.data) {
        setCalendars([...calendars, response.data]);
        setNewCalendar({ date: '', slots: [''] });
        setIsCreating(false);
        showNotification('✅ Calendrier créé avec succès', 'success');
        
        // Notifier les patients (optionnel)
        try {
          await calendarService.notifyPatients(response.data);
          console.log('✉️ Patients notifiés');
        } catch (notifyError) {
          console.warn('⚠️ Notification des patients échouée');
        }
      }
    } catch (error: any) {
      console.error('❌ Erreur création calendrier:', error);
      showNotification(
        error.response?.data?.message || 'Erreur lors de la création du calendrier',
        'error'
      );
    }
  };

  const handleUpdateCalendar = async (calendarId: string) => {
    try {
      const updatedCalendar = calendars.find((c) => c.id === calendarId);
      if (!updatedCalendar) {
        showNotification('Calendrier introuvable', 'error');
        return;
      }

      console.log('📅 Mise à jour du calendrier:', calendarId);
      
      const response = await calendarService.updateCalendar(calendarId, updatedCalendar);
      
      if (response && response.success && response.data) {
        setCalendars(calendars.map((c) => (c.id === calendarId ? response.data : c)));
        showNotification('✅ Calendrier mis à jour avec succès', 'success');
        setIsEditing(null);
        
        // Sauvegarder version et notifier
        try {
          await calendarService.saveCalendarVersion(response.data);
          await calendarService.notifyPatients(response.data);
          console.log('✉️ Patients notifiés de la modification');
        } catch (notifyError) {
          console.warn('⚠️ Notifications/versions échouées');
        }
      }
    } catch (error: any) {
      console.error('❌ Erreur mise à jour calendrier:', error);
      showNotification(
        error.response?.data?.message || 'Erreur lors de la mise à jour du calendrier',
        'error'
      );
    }
  };

  const handleDeleteCalendar = async (calendarId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce calendrier ?')) return;
    
    try {
      console.log('📅 Suppression du calendrier:', calendarId);
      await calendarService.deleteCalendar(calendarId);
      setCalendars(calendars.filter((c) => c.id !== calendarId));
      showNotification('✅ Calendrier supprimé avec succès', 'success');
    } catch (error: any) {
      console.error('❌ Erreur suppression calendrier:', error);
      showNotification(
        error.response?.data?.message || 'Erreur lors de la suppression du calendrier',
        'error'
      );
    }
  };

  const handleConfirmCalendar = async (calendarId: string) => {
    try {
      console.log('📅 Confirmation du calendrier:', calendarId);
      await calendarService.confirmCalendar(calendarId);
      setCalendars(
        calendars.map((c) =>
          c.id === calendarId ? { ...c, confirmed: true } : c
        )
      );
      showNotification('✅ Calendrier confirmé avec succès', 'success');
    } catch (error: any) {
      console.error('❌ Erreur confirmation calendrier:', error);
      showNotification(
        error.response?.data?.message || 'Erreur lors de la confirmation du calendrier',
        'error'
      );
    }
  };

  const handleAddSlot = () => {
    setNewCalendar({ ...newCalendar, slots: [...newCalendar.slots, ''] });
  };

  const handleRemoveSlot = (index: number) => {
    if (newCalendar.slots.length > 1) {
      const updatedSlots = newCalendar.slots.filter((_, i) => i !== index);
      setNewCalendar({ ...newCalendar, slots: updatedSlots });
    }
  };

  const handleSlotChange = (index: number, value: string) => {
    const updatedSlots = [...newCalendar.slots];
    updatedSlots[index] = value;
    setNewCalendar({ ...newCalendar, slots: updatedSlots });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-2xl font-bold text-white">
                {doctorUser?.firstName?.[0]}{doctorUser?.lastName?.[0]}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Dr. {doctorUser?.firstName} {doctorUser?.lastName}
              </h1>
              <p className="text-gray-300 mt-1">
                {doctorUser?.specialty || 'Médecin'} • Gestion des disponibilités
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

      {/* HEADER DE LA PAGE */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Gestion des calendriers</h2>
            <p className="text-gray-400 text-sm">
              {calendars.length} calendrier{calendars.length > 1 ? 's' : ''} configuré{calendars.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="futuristic-btn flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Créer un nouveau calendrier
          </button>
        )}
      </div>

      {/* FORMULAIRE DE CRÉATION */}
      {isCreating && (
        <div className="futuristic-card p-6 animate-slide-in border-blue-500/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Nouveau calendrier
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewCalendar({ date: '', slots: [''] });
              }}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date du calendrier
              </label>
              <input
                type="date"
                value={newCalendar.date}
                onChange={(e) => setNewCalendar({ ...newCalendar, date: e.target.value })}
                className="futuristic-input"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Créneaux horaires
                </label>
                <button
                  onClick={handleAddSlot}
                  className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium flex items-center gap-1 transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter un créneau
                </button>
              </div>

              <div className="space-y-2">
                {newCalendar.slots.map((slot, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={slot}
                      onChange={(e) => handleSlotChange(index, e.target.value)}
                      className="futuristic-input flex-1"
                      required
                    />
                    {newCalendar.slots.length > 1 && (
                      <button
                        onClick={() => handleRemoveSlot(index)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreateCalendar}
                disabled={!newCalendar.date}
                className="futuristic-btn flex items-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Créer le calendrier
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewCalendar({ date: '', slots: [''] });
                }}
                className="futuristic-btn-secondary flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LISTE DES CALENDRIERS */}
      {loading ? (
        <div className="futuristic-card p-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des calendriers...</p>
          </div>
        </div>
      ) : calendars.length === 0 ? (
        <div className="futuristic-card p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Aucun calendrier configuré
            </h3>
            <p className="text-gray-400 mb-6">
              Créez votre premier calendrier avec des créneaux de disponibilité
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="futuristic-btn inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Créer un calendrier
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              className={`futuristic-card p-6 transition-all duration-300 hover:border-white/30 ${
                calendar.confirmed 
                  ? 'border-green-500/50 bg-green-500/5' 
                  : 'border-yellow-500/50 bg-yellow-500/5'
              }`}
            >
              {/* Header de la carte */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    calendar.confirmed 
                      ? 'bg-green-500/20' 
                      : 'bg-yellow-500/20'
                  }`}>
                    <Calendar className={`w-5 h-5 ${
                      calendar.confirmed 
                        ? 'text-green-400' 
                        : 'text-yellow-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white capitalize">
                      {formatDate(calendar.date)}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {calendar.slots.length} créneau{calendar.slots.length > 1 ? 'x' : ''} disponible{calendar.slots.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  calendar.confirmed
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>
                  {calendar.confirmed ? '✓ Confirmé' : '⏳ En attente'}
                </span>
              </div>

              {/* Créneaux horaires */}
              {isEditing === calendar.id ? (
                <div className="space-y-3 mb-4">
                  <input
                    type="date"
                    value={calendar.date}
                    onChange={(e) =>
                      setCalendars(
                        calendars.map((c) =>
                          c.id === calendar.id ? { ...c, date: e.target.value } : c
                        )
                      )
                    }
                    className="futuristic-input mb-2"
                  />
                  {calendar.slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">{slot}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {calendar.slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">{slot}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-white/10">
                {isEditing === calendar.id ? (
                  <>
                    <button
                      onClick={() => handleUpdateCalendar(calendar.id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setIsEditing(null)}
                      className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-white/20 transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </>
                ) : (
                  <>
                    {!calendar.confirmed && (
                      <>
                        <button
                          onClick={() => setIsEditing(calendar.id)}
                          className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all duration-300"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleConfirmCalendar(calendar.id)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
                        >
                          <Check className="w-4 h-4" />
                          Confirmer
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteCalendar(calendar.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300"
                      title="Supprimer"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {calendar.confirmed && calendar.doctor && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400">
                      Confirmé par Dr. {calendar.doctor.firstName} {calendar.doctor.lastName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorCalendarPage;
