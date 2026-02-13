import React, { useState, useEffect } from 'react';
import { calendarService } from '../../services/calendarService';
import { Calendar, Check, Trash, Edit, Plus, X, Clock, Save, AlertCircle, AlertTriangle } from 'lucide-react';

// Interface correspondant au service existant
interface Calendar {
  id: string;
  date: string;
  slots: string[];
  confirmed: boolean;
  doctor?: { firstName: string; lastName: string; id: string };
}

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const CalendarManagement: React.FC = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [newCalendar, setNewCalendar] = useState({ date: '', slots: [''] });
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationProps | null>(null);

  useEffect(() => {
    fetchCalendars();
  }, []);

  // Afficher une notification
  const showNotification = (message: string, type: NotificationProps['type']) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchCalendars = async () => {
    try {
      setLoading(true);
      console.log('📅 Récupération des calendriers...');
      
      const response = await calendarService.getDoctorCalendars();
      
      // Adapter au format de réponse { success: boolean; data: Calendar[] }
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
        'Impossible de charger les calendriers. Vérifiez votre connexion.',
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
    if (newCalendar.slots.some(slot => !slot)) {
      showNotification('Veuillez remplir tous les créneaux', 'error');
      return;
    }

    try {
      console.log('📅 Création du calendrier:', newCalendar);
      const response = await calendarService.createCalendar(newCalendar);
      
      if (response && response.success && response.data) {
        setCalendars([...calendars, response.data]);
        setNewCalendar({ date: '', slots: [''] });
        setIsCreating(false);
        showNotification('✅ Calendrier créé avec succès', 'success');
        
        // Notifier les patients (non bloquant)
        try {
          await calendarService.notifyPatients(response.data);
          console.log('✉️ Patients notifiés');
        } catch (notifyError) {
          console.warn('⚠️ Notification des patients échouée (non bloquant)');
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
        
        // Sauvegarder version et notifier (non bloquant)
        try {
          await calendarService.saveCalendarVersion(response.data);
          await calendarService.notifyPatients(response.data);
          console.log('✉️ Patients notifiés de la modification');
        } catch (notifyError) {
          console.warn('⚠️ Notifications/versions échouées (non bloquant)');
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

  return (
    <div className="space-y-6">
      {/* NOTIFICATION */}
      {notification && (
        <div className={`futuristic-card p-4 animate-slide-in border-2 ${
          notification.type === 'success' ? 'border-green-500/50 bg-green-500/10' :
          notification.type === 'error' ? 'border-red-500/50 bg-red-500/10' :
          notification.type === 'warning' ? 'border-yellow-500/50 bg-yellow-500/10' :
          'border-blue-500/50 bg-blue-500/10'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' && <Check className="w-5 h-5 text-green-400" />}
            {notification.type === 'error' && <X className="w-5 h-5 text-red-400" />}
            {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
            {notification.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-400" />}
            <span className={`${
              notification.type === 'success' ? 'text-green-300' :
              notification.type === 'error' ? 'text-red-300' :
              notification.type === 'warning' ? 'text-yellow-300' :
              'text-blue-300'
            }`}>
              {notification.message}
            </span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Gestion des calendriers</h3>
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
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Nouveau calendrier
            </h4>
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
            {/* Date */}
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

            {/* Créneaux horaires */}
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

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreateCalendar}
                disabled={!newCalendar.date || newCalendar.slots.some(s => !s)}
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

                {/* Badge statut */}
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

              {/* Information si confirmé */}
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

export default CalendarManagement;
