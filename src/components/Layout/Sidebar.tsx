import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { clsx } from 'clsx'

const Sidebar: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()

  const patientMenu = [
    { name: 'Tableau de bord', path: '/dashboard', icon: '📊' },
    { name: 'Rendez-vous', path: '/appointments', icon: '📅' },
    { name: 'Dossier Médical', path: '/medical-file', icon: '🏥' },
    { name: 'Historique', path: '/consultations', icon: '📋' },
    { name: 'Mon Profil', path: '/profile', icon: '👤' },
  ]

  const doctorMenu = [
    { name: 'Tableau de bord', path: '/doctor/dashboard', icon: '📊' },
    { name: 'Mes Consultations', path: '/doctor/appointments', icon: '📅' },
    { name: 'Disponibilités', path: '/doctor/availability', icon: '⏰' },
    { name: 'Mes Patients', path: '/doctor/patients', icon: '👥' },
    { name: 'Mon Profil', path: '/profile', icon: '👤' },
  ]

  const adminMenu = [
    { name: 'Tableau de bord', path: '/admin/dashboard', icon: '📊' },
    { name: 'Utilisateurs', path: '/admin/users', icon: '👥' },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: '📝' },
    { name: 'Statistiques', path: '/admin/statistics', icon: '📈' },
  ]

  const menu = user?.role === 'doctor' ? doctorMenu : 
               user?.role === 'admin' ? adminMenu : patientMenu

  if (!user) return null

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
      </div>
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Sidebar