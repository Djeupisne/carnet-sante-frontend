import React, { useState, useEffect } from 'react';
import { calendarService } from '../services/calendarService';
import { Calendar, Check, Trash, Edit } from 'lucide-react';

interface Calendar {
  id: string;
  date: string;
  slots: string[];
  confirmed: boolean;
  doctor?: { firstName: string; lastName: string };
}

const CalendarManagement: React.FC = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [newCalendar, setNewCalendar] = useState({ date: '', slots: [''] });
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const response = await calendarService.getDoctorCalendars();
      setCalendars(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des calendriers:', error);
    }
  };

  const handleCreateCalendar = async () => {
    try {
      const response = await calendarService.createCalendar(newCalendar);
      setCalendars([...calendars, { ...response.data, confirmed: false }]);
      setNewCalendar({ date: '', slots: [''] });
      setIsCreating(false);
      await calendarService.notifyPatients(response.data);
    } catch (error) {
      console.error('Erreur lors de la création du calendrier:', error);
    }
  };

  const handleUpdateCalendar = async (calendarId: string) => {
    try {
      const updatedCalendar = calendars.find((c) => c.id === calendarId);
      if (updatedCalendar) {
        const response = await calendarService.updateCalendar(calendarId, updatedCalendar);
        setCalendars(calendars.map((c) => (c.id === calendarId ? response.data : c)));
        await calendarService.saveCalendarVersion(response.data);
        await calendarService.notifyPatients(response.data);
        setIsEditing(null);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du calendrier:', error);
    }
  };

  const handleDeleteCalendar = async (calendarId: string) => {
    try {
      await calendarService.deleteCalendar(calendarId);
      setCalendars(calendars.filter((c) => c.id !== calendarId));
    } catch (error) {
      console.error('Erreur lors de la suppression du calendrier:', error);
    }
  };

  const handleConfirmCalendar = async (calendarId: string) => {
    try {
      await calendarService.confirmCalendar(calendarId);
      setCalendars(
        calendars.map((c) =>
          c.id === calendarId ? { ...c, confirmed: true } : c
        )
      );
    } catch (error) {
      console.error('Erreur lors de la confirmation du calendrier:', error);
    }
  };

  const handleAddSlot = () => {
    setNewCalendar({ ...newCalendar, slots: [...newCalendar.slots, ''] });
  };

  const handleSlotChange = (index: number, value: string) => {
    const updatedSlots = [...newCalendar.slots];
    updatedSlots[index] = value;
    setNewCalendar({ ...newCalendar, slots: updatedSlots });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Gestion des calendriers
      </h3>
      {isCreating ? (
        <div className="mb-4">
          <input
            type="date"
            value={newCalendar.date}
            onChange={(e) => setNewCalendar({ ...newCalendar, date: e.target.value })}
            className="border rounded p-2 mr-2"
          />
          {newCalendar.slots.map((slot, index) => (
            <input
              key={index}
              type="time"
              value={slot}
              onChange={(e) => handleSlotChange(index, e.target.value)}
              className="border rounded p-2 mr-2 mt-2"
            />
          ))}
          <button
            onClick={handleAddSlot}
            className="bg-gray-500 text-white p-2 rounded mt-2 mr-2"
          >
            Ajouter un créneau
          </button>
          <button
            onClick={handleCreateCalendar}
            className="bg-blue-500 text-white p-2 rounded mt-2"
          >
            Créer
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="bg-red-500 text-white p-2 rounded mt-2 ml-2"
          >
            Annuler
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="mb-4 bg-blue-500 text-white p-2 rounded"
        >
          Créer un nouveau calendrier
        </button>
      )}

      <div className="space-y-4">
        {calendars.map((calendar) => (
          <div key={calendar.id} className="border p-4 rounded-lg">
            <p>Date: {calendar.date}</p>
            <p>Créneaux: {calendar.slots.join(', ')}</p>
            <p>Statut: {calendar.confirmed ? 'Confirmé' : 'En attente'}</p>
            <div className="flex space-x-2 mt-2">
              {!calendar.confirmed && (
                <>
                  <button
                    onClick={() => setIsEditing(calendar.id)}
                    className="bg-yellow-500 text-white p-2 rounded"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleConfirmCalendar(calendar.id)}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                </>
              )}
              <button
                onClick={() => handleDeleteCalendar(calendar.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
            {isEditing === calendar.id && (
              <div className="mt-4">
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
                  className="border rounded p-2 mr-2"
                />
                <button
                  onClick={() => handleUpdateCalendar(calendar.id)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setIsEditing(null)}
                  className="bg-red-500 text-white p-2 rounded ml-2"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarManagement;