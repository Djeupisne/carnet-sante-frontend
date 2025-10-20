import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, User, FileText, ChevronRight, Plus, Loader, Stethoscope, MapPin, Sparkles } from 'lucide-react'
import { Appointment } from '../../types/appointment'
import { appointmentService } from '../../services/appointmentService'
import { useNotification } from '../../context/NotificationContext'

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { showNotification } = useNotification()

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      setIsLoading(true)
      const data = await appointmentService.getAppointments()

      if (Array.isArray(data)) {
        setAppointments(data)
      } else if (data?.appointments && Array.isArray(data.appointments)) {
        setAppointments(data.appointments)
      } else if (data?.data && Array.isArray(data.data)) {
        setAppointments(data.data)
      } else {
        setAppointments([])
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      showNotification('Erreur lors du chargement des rendez-vous', 'error')
      setAppointments([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      return
    }

    try {
      await appointmentService.cancelAppointment(appointmentId)
      await loadAppointments()
      showNotification('Rendez-vous annulé avec succès', 'success')
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error)
      showNotification('Erreur lors de l\'annulation du rendez-vous', 'error')
    }
  }

  const filteredAppointments = Array.isArray(appointments) 
    ? appointments.filter(apt => {
        const now = new Date()
        const appointmentDate = new Date(`${apt.date}T${apt.startTime}`)
        
        switch (filter) {
          case 'upcoming':
            return appointmentDate >= now && apt.status !== 'cancelled'
          case 'past':
            return appointmentDate < now || apt.status === 'cancelled' || apt.status === 'completed'
          default:
            return true
        }
      })
    : []

  const getStatusVariant = (status: string) => {
    const variants = {
      confirmed: { 
        gradient: 'from-emerald-400 to-teal-500', 
        light: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        badge: 'bg-emerald-100 text-emerald-700'
      },
      scheduled: { 
        gradient: 'from-cyan-400 to-blue-500',
        light: 'from-cyan-50 to-blue-50',
        border: 'border-cyan-200',
        text: 'text-cyan-700',
        badge: 'bg-cyan-100 text-cyan-700'
      },
      completed: { 
        gradient: 'from-slate-400 to-slate-500',
        light: 'from-slate-50 to-slate-50',
        border: 'border-slate-200',
        text: 'text-slate-700',
        badge: 'bg-slate-100 text-slate-700'
      },
      cancelled: { 
        gradient: 'from-rose-400 to-red-500',
        light: 'from-rose-50 to-red-50',
        border: 'border-rose-200',
        text: 'text-rose-700',
        badge: 'bg-rose-100 text-rose-700'
      },
      no_show: { 
        gradient: 'from-amber-400 to-orange-500',
        light: 'from-amber-50 to-orange-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        badge: 'bg-amber-100 text-amber-700'
      },
    }
    return variants[status as keyof typeof variants] || variants.scheduled
  }

  const getStatusText = (status: string) => {
    const texts = {
      confirmed: 'Confirmé',
      scheduled: 'Planifié',
      completed: 'Terminé',
      cancelled: 'Annulé',
      no_show: 'Non honoré',
    }
    return texts[status as keyof typeof texts] || status
  }

  const getTypeText = (type: string) => {
    const types = {
      consultation: 'Consultation',
      follow_up: 'Suivi',
      emergency: 'Urgence',
      routine: 'Routine',
    }
    return types[type as keyof typeof types] || type
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
        {/* Fond animé */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto py-20 px-4 flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <Loader className="w-12 h-12 text-cyan-400 animate-spin" />
              <Sparkles className="w-6 h-6 text-purple-400 absolute top-0 right-0 animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 font-semibold text-lg">
              Chargement de vos rendez-vous...
            </p>
          </div>
        </div>
      </div>
    )
  }

  const filterOptions = [
    { value: 'all', label: 'Tous les RDV', icon: '📋' },
    { value: 'upcoming', label: 'À venir', icon: '⏰' },
    { value: 'past', label: 'Historique', icon: '📊' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Fond animé premium */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/15 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grille d'arrière-plan */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(100,200,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(100,200,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header Premium */}
        <header className="sticky top-0 z-50 backdrop-blur-2xl bg-gradient-to-b from-white/10 to-white/5 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-75"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Carnet Santé
                </h1>
              </div>
              <nav className="hidden md:flex gap-8">
                {[
                  { label: 'Tableau de bord', path: '/dashboard' },
                  { label: 'Rendez-vous', path: '/appointments' },
                  { label: 'Dossier Médical', path: '/medical-file' }
                ].map((item, i) => (
                  <Link
                    key={i}
                    to={item.path}
                    className={`text-sm font-semibold transition-all ${
                      i === 1
                        ? 'text-cyan-300 border-b-2 border-cyan-400'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </header>

        {/* Contenu Principal */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Section Titre avec animation */}
          <div className="mb-12 flex justify-between items-start">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></div>
                <span className="text-sm font-semibold text-cyan-300">VOS RENDEZ-VOUS MÉDICAUX</span>
              </div>
              <h2 className="text-5xl font-black mb-3">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  Gestion Simplifiée
                </span>
              </h2>
              <p className="text-white/60 text-lg flex items-center gap-2">
                <span className="inline-block w-1 h-4 bg-gradient-to-b from-cyan-400 to-transparent rounded-full"></span>
                Accédez à tous vos rendez-vous et gérez votre suivi médical en un seul endroit
              </p>
            </div>
            <Link
              to="/appointments/book"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 blur-lg group-hover:blur-xl transition-all opacity-100"></div>
              <div className="relative bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 rounded-xl flex items-center gap-2 group-hover:shadow-2xl transition-all group-hover:scale-105">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                Nouveau RDV
              </div>
            </Link>
          </div>

          {/* Filtres Visuels */}
          <div className="mb-10 flex gap-4 flex-wrap">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value as any)}
                className={`relative px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 group ${
                  filter === opt.value
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {filter === opt.value && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 to-purple-600/40 rounded-lg blur-lg -z-10 group-hover:blur-xl"></div>
                )}
                <div className={`relative px-4 py-2 rounded-lg backdrop-blur-sm border transition-all ${
                  filter === opt.value
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-cyan-400/50 shadow-lg shadow-cyan-500/50'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}>
                  <span className="mr-2">{opt.icon}</span>
                  {opt.label}
                </div>
              </button>
            ))}
          </div>

          {/* Contenu */}
          {filteredAppointments.length === 0 ? (
            <div className="relative rounded-2xl overflow-hidden p-16 text-center group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10"></div>
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_0%,rgba(255,255,255,0.03)_100%)]"></div>
              
              <div className="relative z-10 flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-2xl"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center border border-white/10">
                    <Calendar className="w-12 h-12 text-cyan-300" />
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent mb-3">
                Aucun rendez-vous trouvé
              </h3>
              <p className="text-white/50 mb-10 max-w-md mx-auto">
                {filter === 'upcoming' 
                  ? "Vous n'avez aucun rendez-vous à venir. Planifiez une consultation dès maintenant."
                  : filter === 'past'
                  ? "Aucun rendez-vous passé pour le moment."
                  : "Commencez en prenant votre premier rendez-vous médical."
                }
              </p>
              <Link
                to="/appointments/book"
                className="group/btn relative inline-flex items-center gap-2 font-semibold text-white"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-lg group-hover/btn:blur-xl transition-all opacity-75"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3 rounded-xl flex items-center gap-2 group-hover/btn:shadow-2xl transition-all group-hover/btn:scale-105">
                  <Plus className="w-5 h-5" />
                  Prendre un rendez-vous
                </div>
              </Link>
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredAppointments.map((appointment) => {
                const statusVar = getStatusVariant(appointment.status)
                const appointmentDate = new Date(appointment.date)
                const isUpcoming = new Date(`${appointment.date}T${appointment.startTime}`) >= new Date()
                
                return (
                  <div
                    key={appointment.id}
                    onMouseEnter={() => setHoveredId(appointment.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="relative group cursor-pointer"
                  >
                    {/* Glow background */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${statusVar.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500`}></div>
                    
                    {/* Card */}
                    <div className={`relative rounded-2xl backdrop-blur-xl border overflow-hidden transition-all duration-500 ${
                      hoveredId === appointment.id
                        ? `bg-gradient-to-br ${statusVar.light} ${statusVar.border} border-white/30 shadow-2xl`
                        : `bg-white/5 ${statusVar.border} border-white/10 hover:border-white/20`
                    }`}>
                      
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${statusVar.light} opacity-0 group-hover:opacity-20 transition-all`}></div>

                      <div className="relative p-8">
                        <div className="flex items-start justify-between gap-6">
                          {/* Contenu Gauche */}
                          <div className="flex-1">
                            {/* Docteur */}
                            <div className="flex items-center gap-4 mb-6">
                              <div className="relative">
                                <div className={`absolute inset-0 bg-gradient-to-r ${statusVar.gradient} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-all`}></div>
                                <div className={`relative w-14 h-14 bg-gradient-to-br ${statusVar.gradient} rounded-2xl flex items-center justify-center`}>
                                  <User className="w-7 h-7 text-white" />
                                </div>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                  Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                                </h3>
                                <p className="text-white/60 text-sm font-medium">{appointment.doctor.specialization}</p>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex gap-3 mb-6 flex-wrap">
                              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusVar.badge} backdrop-blur-sm border ${statusVar.border}`}>
                                <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${statusVar.gradient}`}></span>
                                {getStatusText(appointment.status)}
                              </span>
                              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/10 text-white/80 border border-white/10">
                                {getTypeText(appointment.type)}
                              </span>
                            </div>

                            {/* Infos détaillées */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 text-white/80">
                                  <Calendar className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                                  <span className="font-semibold">{appointmentDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-white/80">
                                  <Clock className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                  <span className="font-semibold">{appointment.startTime} - {appointment.endTime}</span>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <FileText className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
                                  <div>
                                    <p className="text-white/60 text-xs font-medium">MOTIF</p>
                                    <p className="font-semibold text-white">{appointment.reason}</p>
                                  </div>
                                </div>
                                {appointment.notes && (
                                  <p className="text-white/60 text-sm italic">{appointment.notes.substring(0, 50)}...</p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions Droite */}
                          <div className="flex flex-col gap-3 min-w-fit">
                            <Link
                              to={`/appointments/${appointment.id}`}
                              className="group/link relative inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-0 group-hover/link:opacity-100 blur-lg transition-all"></div>
                              <div className="relative backdrop-blur-sm bg-white/10 border border-white/20 px-4 py-2 rounded-lg group-hover/link:bg-gradient-to-r group-hover/link:from-cyan-500 group-hover/link:to-purple-600 group-hover/link:border-transparent transition-all group-hover/link:shadow-lg">
                                Détails
                                <ChevronRight className="w-4 h-4 inline group-hover/link:translate-x-1 transition-transform" />
                              </div>
                            </Link>
                            {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                              <button
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="group/cancel relative inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 opacity-0 group-hover/cancel:opacity-100 blur-lg transition-all"></div>
                                <div className="relative backdrop-blur-sm bg-white/10 border border-white/20 px-4 py-2 rounded-lg group-hover/cancel:bg-gradient-to-r group-hover/cancel:from-red-500 group-hover/cancel:to-rose-600 group-hover/cancel:border-transparent transition-all">
                                  Annuler
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default AppointmentList