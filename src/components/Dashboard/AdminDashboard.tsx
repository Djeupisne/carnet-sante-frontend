import React, { useState, useEffect } from 'react';
import { Users, Calendar, CreditCard, Activity, Trash } from 'lucide-react';
import { calendarService } from '../../services/calendarService'

interface Calendar {
  id: string;
  date: string;
  slots: string[];
  confirmed: boolean;
  doctor?: { firstName: string; lastName: string };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: { total: 0, doctors: 0, patients: 0 },
    appointments: { total: 0, byStatus: {} },
    financial: { totalRevenue: 0, totalCommission: 0 },
  });
  const [calendars, setCalendars] = useState<Calendar[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setStats({
        users: { total: 100, doctors: 20, patients: 80 },
        appointments: { total: 50, byStatus: {} },
        financial: { totalRevenue: 5000, totalCommission: 500 },
      });
    };

    const fetchCalendars = async () => {
      try {
        const response = await calendarService.getAllCalendars();
        setCalendars(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des calendriers:', error);
      }
    };

    fetchStats();
    fetchCalendars();
  }, []);

  const handleDeleteCalendar = async (calendarId: string) => {
    try {
      await calendarService.deleteCalendar(calendarId);
      setCalendars(calendars.filter((c) => c.id !== calendarId));
    } catch (error) {
      console.error('Erreur lors de la suppression du calendrier:', error);
    }
  };

  const statCards = [
    {
      title: 'Utilisateurs totaux',
      value: stats.users.total,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Médecins',
      value: stats.users.doctors,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Patients',
      value: stats.users.patients,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Rendez-vous',
      value: stats.appointments.total,
      icon: Calendar,
      color: 'bg-orange-500',
    },
    {
      title: 'Revenus totaux',
      value: `${stats.financial.totalRevenue} €`,
      icon: CreditCard,
      color: 'bg-red-500',
    },
    {
      title: 'Commission',
      value: `${stats.financial.totalCommission} €`,
      icon: Activity,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Tableau de bord administrateur
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de la plateforme
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            Activité récente
          </h3>
          <div className="text-center text-gray-500 py-8">
            <Activity className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>Aucune activité récente</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Gestion des calendriers
          </h3>
          <div className="space-y-4">
            {calendars.map((calendar) => (
              <div key={calendar.id} className="border p-4 rounded-lg">
                <p>Date: {calendar.date}</p>
                <p>Créneaux: {calendar.slots.join(', ')}</p>
                <p>Statut: {calendar.confirmed ? 'Confirmé' : 'En attente'}</p>
                <button
                  onClick={() => handleDeleteCalendar(calendar.id)}
                  className="mt-2 bg-red-500 text-white p-2 rounded"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;