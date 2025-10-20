import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Doctor, AppointmentSlot, CreateAppointmentData } from '../../types/appointment'
import { appointmentService } from '../../services/appointmentService'
import { useNotification } from '../../context/NotificationContext'
import { Calendar, Clock, User, CheckCircle, ChevronRight, ArrowLeft, Heart } from 'lucide-react'

const BookAppointment: React.FC = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null)
  const [formData, setFormData] = useState({
    reason: '',
    type: 'consultation'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  // Commenté car non utilisé : const [hoveredDoctorId, setHoveredDoctorId] = useState<string | null>(null)

  useEffect(() => {
    loadDoctors()
  }, [])

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailableSlots()
    }
  }, [selectedDoctor, selectedDate])

  const loadDoctors = async () => {
    try {
      const data = await appointmentService.getDoctors()
      setDoctors(data)
    } catch (error) {
      showNotification('Erreur lors du chargement des médecins', 'error')
    }
  }

  const loadAvailableSlots = async () => {
    if (!selectedDoctor) return
    try {
      const slots = await appointmentService.getDoctorAvailability(selectedDoctor.id, selectedDate)
      setAvailableSlots(slots)
    } catch (error) {
      showNotification('Erreur lors du chargement des créneaux', 'error')
    }
  }

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setStep(2)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
  }

  const handleSlotSelect = (slot: AppointmentSlot) => {
    if (!slot.isAvailable) return
    setSelectedSlot(slot)
    setStep(3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor || !selectedSlot) return

    setIsLoading(true)
    try {
      const appointmentData: CreateAppointmentData = {
        doctorId: selectedDoctor.id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        reason: formData.reason,
        type: formData.type
      }

      await appointmentService.createAppointment(appointmentData)
      showNotification('Rendez-vous pris avec succès!', 'success')
      navigate('/appointments')
    } catch (error) {
      showNotification('Erreur lors de la prise de rendez-vous', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const generateDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0])
      }
    }
    return dates
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Fond animé */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-20 right-1/3 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="fixed inset-0 bg-[linear-gradient(rgba(100,200,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(100,200,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-2xl bg-gradient-to-b from-white/10 to-white/5 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to="/appointments" className="flex items-center gap-2 text-white/60 hover:text-white transition">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-semibold">Retour</span>
              </Link>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-75"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Carnet Santé
                </h1>
              </div>
              <div className="w-24"></div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Étapes animées */}
          <div className="mb-16">
            <div className="flex items-center justify-between relative">
              <div className="absolute inset-x-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2"></div>
              
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="relative flex flex-col items-center">
                  <div className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                    step >= stepNumber
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/50'
                      : 'bg-white/10 text-white/40 border border-white/20'
                  }`}>
                    {step > stepNumber ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <p className={`mt-4 text-sm font-semibold whitespace-nowrap transition-all ${
                    step >= stepNumber ? 'text-white' : 'text-white/40'
                  }`}>
                    {stepNumber === 1 && 'Médecin'}
                    {stepNumber === 2 && 'Date & Heure'}
                    {stepNumber === 3 && 'Confirmation'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Étape 1: Choix du médecin */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-black mb-3">
                  <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                    Choisissez votre médecin
                  </span>
                </h2>
                <p className="text-white/60 text-lg">Sélectionnez un spécialiste parmi nos praticiens experts</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    // Commenté car non utilisé : onMouseEnter={() => setHoveredDoctorId(doctor.id)}
                    // Commenté car non utilisé : onMouseLeave={() => setHoveredDoctorId(null)}
                    onClick={() => handleDoctorSelect(doctor)}
                    className="group relative cursor-pointer"
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500`}></div>
                    
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 group-hover:border-white/30 rounded-2xl p-8 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-white/20 group-hover:to-white/10">
                      <div className="flex items-start gap-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-all"></div>
                          <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
                            {doctor.firstName[0]}{doctor.lastName[0]}
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </h3>
                          <p className="text-cyan-300 font-semibold text-sm mb-4">{doctor.specialty}</p>
                          
                          <div className="space-y-2 text-sm">
                            {/* Commenté car non présent dans l'interface Doctor */}
                            {/* <div className="flex items-center gap-2 text-white/70">
                              <span className="w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></span>
                              <span><strong>{doctor.experience}</strong> ans d'expérience</span>
                            </div> */}
                            <div className="flex items-center gap-2 text-white/70">
                              <span className="w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></span>
                              <span><strong>{doctor.consultationPrice}€</strong> la consultation</span>
                            </div>
                            {doctor.rating && (
                              <div className="flex items-center gap-2 text-white/70">
                                <span className="w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></span>
                                <span>⭐ <strong>{doctor.rating}</strong> {/* doctor.totalReviews pas dans l'interface */}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-6 h-6 text-white/40 group-hover:text-cyan-300 transition-all group-hover:translate-x-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Étape 2: Choix de la date et heure */}
          {step === 2 && selectedDoctor && (
            <div className="space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-4xl font-black mb-3">
                    <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                      Choisissez une date et heure
                    </span>
                  </h2>
                  <p className="text-white/60 text-lg">Sélectionnez le créneau qui vous convient</p>
                </div>
                <button
                  onClick={() => {
                    setStep(1)
                    setSelectedDate('')
                    setSelectedSlot(null)
                  }}
                  className="text-white/60 hover:text-white transition text-sm font-semibold flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Changer
                </button>
              </div>

              {/* Résumé du médecin sélectionné */}
              <div className="relative rounded-2xl overflow-hidden p-8 border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-600/10"></div>
                <div className="relative flex items-center gap-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                    {selectedDoctor.firstName[0]}{selectedDoctor.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</h3>
                    <p className="text-cyan-300">{selectedDoctor.specialty}</p>
                  </div>
                </div>
              </div>

              {/* Sélection des dates */}
              <div>
                <label className="block text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-cyan-400" />
                  Sélectionnez une date
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {generateDates().map((date) => (
                    <button
                      key={date}
                      onClick={() => handleDateSelect(date)}
                      className={`relative group overflow-hidden rounded-xl p-4 font-semibold transition-all duration-300 ${
                        selectedDate === date
                          ? 'ring-2 ring-cyan-400'
                          : ''
                      }`}
                    >
                      <div className={`absolute inset-0 transition-all ${
                        selectedDate === date
                          ? 'bg-gradient-to-br from-cyan-500 to-purple-600'
                          : 'bg-white/10 group-hover:bg-white/20'
                      }`}></div>
                      <div className="relative text-center">
                        <div className={`text-xs font-semibold ${selectedDate === date ? 'text-white' : 'text-white/70'}`}>
                          {new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                        </div>
                        <div className={`text-lg font-black ${selectedDate === date ? 'text-white' : 'text-white/80'}`}>
                          {new Date(date).getDate()}
                        </div>
                        <div className={`text-xs ${selectedDate === date ? 'text-white/90' : 'text-white/50'}`}>
                          {new Date(date).toLocaleDateString('fr-FR', { month: 'short' })}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Créneaux horaires */}
              {selectedDate && (
                <div>
                  <label className="block text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-purple-400" />
                    Créneaux disponibles
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlotSelect(slot)}
                        disabled={!slot.isAvailable}
                        className={`relative group rounded-xl p-3 font-semibold transition-all duration-300 overflow-hidden ${
                          !slot.isAvailable ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <div className={`absolute inset-0 transition-all ${
                          !slot.isAvailable
                            ? 'bg-white/5'
                            : selectedSlot?.startTime === slot.startTime
                            ? 'bg-gradient-to-br from-cyan-500 to-purple-600'
                            : 'bg-white/10 group-hover:bg-white/20'
                        }`}></div>
                        <div className={`relative text-center ${
                          !slot.isAvailable
                            ? 'text-white/30'
                            : selectedSlot?.startTime === slot.startTime
                            ? 'text-white'
                            : 'text-white/70'
                        }`}>
                          {slot.startTime}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Étape 3: Confirmation */}
          {step === 3 && selectedDoctor && selectedSlot && (
            <div className="space-y-8">
              <h2 className="text-4xl font-black">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  Confirmer votre rendez-vous
                </span>
              </h2>

              {/* Récapitulatif */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5"></div>
                <div className="relative p-10 space-y-6">
                  <div className="flex items-start gap-4">
                    <User className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-white/60 text-sm font-semibold mb-1">MÉDECIN</p>
                      <p className="text-xl font-bold text-white">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                      <p className="text-cyan-300 mt-1">{selectedDoctor.specialty}</p>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-white/20 to-transparent"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-start gap-4">
                      <Calendar className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white/60 text-sm font-semibold mb-1">DATE</p>
                        <p className="text-lg font-bold text-white">{new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Clock className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-white/60 text-sm font-semibold mb-1">HEURE</p>
                        <p className="text-lg font-bold text-white">{selectedSlot.startTime} - {selectedSlot.endTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-white/20 to-transparent"></div>

                  <div className="flex items-center justify-between">
                    <p className="text-white/60">Honoraires de consultation</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">{selectedDoctor.consultationPrice}€</p>
                  </div>
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-bold mb-3">Type de consultation</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  >
                    <option value="consultation" className="bg-slate-900">Consultation</option>
                    <option value="follow_up" className="bg-slate-900">Suivi</option>
                    <option value="routine" className="bg-slate-900">Routine</option>
                    <option value="emergency" className="bg-slate-900">Urgence</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-bold mb-3">Motif de la consultation</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white backdrop-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none placeholder:text-white/40"
                    placeholder="Décrivez le motif de votre consultation..."
                    required
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 px-6 py-3 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 relative group overflow-hidden rounded-xl px-6 py-3 font-semibold text-white disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:shadow-2xl group-hover:shadow-cyan-500/50 transition-all"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      {isLoading ? 'Confirmation...' : 'Confirmer le rendez-vous'}
                    </div>
                  </button>
                </div>
              </form>
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
      `}</style>
    </div>
  )
}

export default BookAppointment