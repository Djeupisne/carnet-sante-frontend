import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit2, Trash2, Save, X, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { calendarService } from '../../services/calendarService';

interface CalendarSlot {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
];

const CalendarManagement: React.FC = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [calendars, setCalendars] = useState<CalendarSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
  });

  useEffect(() => {
    fetchCalendars();
  }, [user]);

  const fetchCalendars = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await calendarService.getCalendars(user.id);
      setCalendars(data);
    } catch (error) {
      console.error('Erreur chargement calendriers:', error);
      showNotification('Erreur lors du chargement des disponibilités', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await calendarService.updateCalendar(editingId, formData);
        showNotification('✅ Disponibilité modifiée avec succès', 'success');
      } else {
        await calendarService.createCalendar({ ...formData, doctorId: user?.id });
        showNotification('✅ Disponibilité ajoutée avec succès', 'success');
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      await fetchCalendars();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('❌ Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleEdit = (calendar: CalendarSlot) => {
    setFormData({
      dayOfWeek: calendar.dayOfWeek,
      startTime: calendar.startTime,
      endTime: calendar.endTime,
      isAvailable: calendar.isAvailable,
    });
    setEditingId(calendar.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette disponibilité ?')) return;
    try {
      await calendarService.deleteCalendar(id);
      showNotification('✅ Disponibilité supprimée', 'success');
      await fetchCalendars();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('❌ Erreur lors de la suppression', 'error');
    }
  };

  const toggleAvailability = async (calendar: CalendarSlot) => {
    try {
      await calendarService.updateCalendar(calendar.id, {
        ...calendar,
        isAvailable: !calendar.isAvailable,
      });
      showNotification(
        `✅ Disponibilité ${!calendar.isAvailable ? 'activée' : 'désactivée'}`,
        'success'
      );
      await fetchCalendars();
    } catch (error) {
      console.error('Erreur:', error);
      showNotification('❌ Erreur lors de la modification', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getDayLabel = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label || 'Inconnu';
  };

  const groupedCalendars = DAYS_OF_WEEK.map(day => ({
    day: day.label,
    slots: calendars.filter(c => c.dayOfWeek === day.value),
  }));

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Gestion des calendriers</h2>
            <p className="text-gray-400 text-sm">Configurez vos disponibilités hebdomadaires</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`futuristic-btn flex items-center gap-2 ${
            showForm ? 'bg-gradient-to-r from-red-500 to-pink-600' : ''
          }`}
        >
          {showForm ? (
            <>
              <X className="w-5 h-5" />
              Annuler
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Créer un nouveau calendrier
            </>
          )}
        </button>
      </div>

      {/* FORMULAIRE */}
      {showForm && (
        <div className="futuristic-card p-6 animate-slide-in border-blue-500/50">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            {editingId ? 'Modifier la disponibilité' : 'Nouvelle disponibilité'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Jour de la semaine */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Jour de la semaine
                </label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: Number(e.target.value) })}
                  className="futuristic-input"
                  required
                >
                  {DAYS_OF_WEEK.map(day => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Statut
                </label>
                <select
                  value={formData.isAvailable ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'true' })}
                  className="futuristic-input"
                >
                  <option value="true">Disponible</option>
                  <option value="false">Indisponible</option>
                </select>
              </div>

              {/* Heure de début */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Heure de début
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="futuristic-input"
                  required
                />
              </div>

              {/* Heure de fin */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Heure de fin
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="futuristic-input"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="futuristic-btn flex items-center gap-2 flex-1"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Mettre à jour' : 'Enregistrer'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="futuristic-btn-secondary flex items-center gap-2 flex-1"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTE DES CALENDRIERS */}
      {loading ? (
        <div className="futuristic-card p-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement des disponibilités...</p>
          </div>
        </div>
      ) : calendars.length === 0 ? (
        <div className="futuristic-card p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Aucune disponibilité configurée
            </h3>
            <p className="text-gray-400 mb-6">
              Commencez par créer votre première disponibilité
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="futuristic-btn inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Créer une disponibilité
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {groupedCalendars.map(({ day, slots }) => (
            <div key={day} className="futuristic-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  {day}
                </h3>
                <span className="text-sm text-gray-400">
                  {slots.length} créneau{slots.length > 1 ? 'x' : ''}
                </span>
              </div>

              {slots.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-xl border border-white/10">
                  <Clock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Aucun créneau configuré</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {slots.map(slot => (
                    <div
                      key={slot.id}
                      className={`bg-white/5 rounded-xl p-4 border transition-all duration-300 ${
                        slot.isAvailable
                          ? 'border-green-500/30 hover:border-green-500/50'
                          : 'border-red-500/30 hover:border-red-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className={`w-5 h-5 ${slot.isAvailable ? 'text-green-400' : 'text-red-400'}`} />
                            <span className="font-semibold text-white">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              slot.isAvailable
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                              {slot.isAvailable ? '✓ Disponible' : '✕ Indisponible'}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => toggleAvailability(slot)}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                              slot.isAvailable
                                ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                                : 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                            }`}
                            title={slot.isAvailable ? 'Désactiver' : 'Activer'}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(slot)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-300"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(slot.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
