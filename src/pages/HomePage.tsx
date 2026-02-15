import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Calendar, 
  Building2, 
  Bell, 
  Stethoscope, 
  Pill, 
  LineChart,
  Shield,
  ChevronRight,
  Sparkles,
  HeartPulse,
  Activity,
  Users,
  CheckCircle2
} from 'lucide-react'

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: <Calendar className="w-7 h-7" />,
      title: 'Gestion des rendez-vous',
      description: 'Prenez, modifiez ou annulez vos rendez-vous en ligne facilement',
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      delay: '0ms'
    },
    {
      icon: <Building2 className="w-7 h-7" />,
      title: 'Dossier médical numérique',
      description: 'Accédez à votre dossier médical complet en quelques clics',
      color: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      delay: '100ms'
    },
    {
      icon: <Bell className="w-7 h-7" />,
      title: 'Rappels intelligents',
      description: 'Recevez des rappels pour vos rendez-vous et traitements',
      color: 'from-emerald-500 to-teal-400',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      delay: '200ms'
    },
    {
      icon: <Stethoscope className="w-7 h-7" />,
      title: 'Réseau de médecins',
      description: 'Trouvez et consultez des professionnels de santé qualifiés',
      color: 'from-orange-500 to-amber-400',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      delay: '300ms'
    },
    {
      icon: <Pill className="w-7 h-7" />,
      title: 'Gestion des traitements',
      description: 'Suivez vos médicaments et traitements au quotidien',
      color: 'from-indigo-500 to-blue-400',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      delay: '400ms'
    },
    {
      icon: <LineChart className="w-7 h-7" />,
      title: 'Analyses et suivis',
      description: "Visualisez l'évolution de votre santé dans le temps",
      color: 'from-teal-500 to-cyan-400',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      delay: '500ms'
    }
  ]

  const stats = [
    { value: '10k+', label: 'Patients satisfaits', icon: <Users className="w-8 h-8" /> },
    { value: '500+', label: 'Médecins partenaires', icon: <Stethoscope className="w-8 h-8" /> },
    { value: '50k+', label: 'Rendez-vous par mois', icon: <Calendar className="w-8 h-8" /> },
    { value: '4.9/5', label: 'Note moyenne', icon: <CheckCircle2 className="w-8 h-8" /> }
  ]

  const benefits = [
    'Disponible 24/7',
    'Sécurité maximale',
    'Support réactif',
    'Gratuit pour commencer'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      {/* Import Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Outfit', sans-serif;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .blob {
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: blob 7s ease-in-out infinite;
        }

        @keyframes blob {
          0%, 100% {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          }
          25% {
            border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
          }
          50% {
            border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
          }
          75% {
            border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
          }
        }

        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .feature-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card:hover {
          transform: translateY(-8px) scale(1.02);
        }
      `}</style>

      {/* Navigation avec glassmorphism */}
      <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo moderne */}
            <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 p-3 rounded-2xl shadow-lg">
                  <HeartPulse className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                    Carnet de Santé
                  </span>
                </h1>
                <p className="text-xs text-slate-500 font-medium">Votre santé, notre priorité</p>
              </div>
            </Link>

            {/* Navigation desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/features" className="text-slate-700 hover:text-blue-600 transition-colors font-medium text-sm">
                Fonctionnalités
              </a>
              <a href="#stats" className="text-slate-700 hover:text-blue-600 transition-colors font-medium text-sm">
                Statistiques
              </a>
              <a href="/contact" className="text-slate-700 hover:text-blue-600 transition-colors font-medium text-sm">
                Contact
              </a>
            </div>

            {/* Boutons de connexion */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-slate-600 flex items-center gap-2 text-sm font-medium">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    Bonjour, {user?.firstName}
                  </span>
                  <Link
                    to="/dashboard"
                    className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105"
                  >
                    <span>Tableau de bord</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-700 hover:text-blue-600 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-white/50"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section avec animations */}
      <div className="relative overflow-hidden">
        {/* Blobs animés en arrière-plan */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blob blur-3xl" 
             style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 blob blur-3xl" 
             style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 blob blur-3xl" 
             style={{ animationDelay: '4s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge animé */}
            <div 
              className={`inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-blue-200/50 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0ms' }}
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                La plateforme de santé la plus fiable
              </span>
            </div>

            {/* Titre principal avec animation */}
            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: '100ms' }}>
              <span className="block mb-2">
                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                  Votre santé,
                </span>
              </span>
              <span className="block">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  simplifiée et connectée
                </span>
              </span>
            </h1>

            {/* Description avec animation */}
            <p className={`text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
               style={{ animationDelay: '200ms' }}>
              Gérez vos rendez-vous médicaux, consultez votre dossier de santé et 
              suivez votre parcours médical en toute simplicité, où que vous soyez.
            </p>

            {/* Boutons CTA avec animation */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                 style={{ animationDelay: '300ms' }}>
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
                  >
                    <span>Commencer gratuitement</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 glass text-slate-700 rounded-2xl text-lg font-bold border-2 border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all hover:shadow-lg"
                  >
                    <span>Se connecter</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
                >
                  <span>Accéder au tableau de bord</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {/* Bénéfices en ligne */}
            <div className={`flex flex-wrap justify-center gap-6 mb-20 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                 style={{ animationDelay: '400ms' }}>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-slate-200/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Statistiques avec animation */}
            <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`glass p-6 rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <div className="text-blue-600 mb-3 flex justify-center opacity-80">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section avec cartes améliorées */}
      <div id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="glass px-4 py-2 rounded-full text-sm font-bold text-blue-600 border border-blue-200/50">
                Fonctionnalités
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Une plateforme complète et intuitive pour gérer votre santé au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card group glass rounded-3xl p-8 border border-white/50 hover:shadow-2xl"
                style={{ animationDelay: feature.delay }}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                
                {/* Icône avec effet moderne */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  <div className={`relative ${feature.bgColor} rounded-2xl p-4 inline-flex group-hover:scale-110 transition-transform duration-300`}>
                    <div className={feature.iconColor}>
                      {feature.icon}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4 font-medium">
                  {feature.description}
                </p>

                {/* Lien avec flèche */}
                <div className="flex items-center text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>En savoir plus</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section CTA moderne */}
      <div className="relative py-24 overflow-hidden">
        {/* Background avec blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-emerald-600">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white/10 blob blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 blob blur-3xl" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-6">
            <Activity className="w-16 h-16 text-white/80 mx-auto mb-4" strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Prêt à prendre soin de<br />votre santé ?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Rejoignez des milliers de patients et médecins qui utilisent déjà notre plateforme
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-2xl text-lg font-black shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all"
          >
            <span>Créer un compte gratuitement</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Footer moderne */}
      <footer id="contact" className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Colonne 1 - Logo */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 p-2.5 rounded-xl">
                  <HeartPulse className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black">Carnet de Santé</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-medium mb-6">
                Votre partenaire santé au quotidien. Une solution moderne et sécurisée 
                pour gérer votre santé.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

           {/* Colonne 2 - Produit */}
<div>
  <h4 className="text-lg font-bold mb-4">Produit</h4>
  <ul className="space-y-3">
    <li>
      <Link to="/features" className="text-slate-400 hover:text-white transition font-medium text-sm">
        Fonctionnalités
      </Link>
    </li>
    <li>
      <Link to="/pricing" className="text-slate-400 hover:text-white transition font-medium text-sm">
        Tarifs
      </Link>
    </li>
    <li>
      <Link to="/faq" className="text-slate-400 hover:text-white transition font-medium text-sm">
        FAQ
      </Link>
    </li>
    <li>
      <Link to="/docs" className="text-slate-400 hover:text-white transition font-medium text-sm">
        Documentation
      </Link>
    </li>
  </ul>
</div>

{/* Colonne 3 - Légal */}
<div>
  <h4 className="text-lg font-bold mb-4">Légal</h4>
  <ul className="space-y-3">
    <li>
      <Link to="/privacy" className="text-slate-400 hover:text-white transition font-medium text-sm">
        Confidentialité
      </Link>
    </li>
    <li>
      <Link to="/terms" className="text-slate-400 hover:text-white transition font-medium text-sm">
        Conditions d'utilisation
      </Link>
    </li>
    <li>
      <Link to="/legal" className="text-slate-400 hover:text-white transition font-medium text-sm">
        Mentions légales
      </Link>
    </li>
  </ul>
</div>

            {/* Colonne 4 - Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="text-slate-400 font-medium text-sm">oualoumidjeupisne@gmail.com</li>
                <li className="text-slate-400 font-medium text-sm">+228 93 36 01 50</li>
                <li className="text-slate-400 font-medium text-sm">Lomé,Togo</li>
              </ul>
            </div>
          </div>

          {/* Séparateur */}
          <div className="border-t border-slate-800 mb-8"></div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <p className="font-medium">© 2026 Carnet de Santé. Tous droits réservés.</p>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-slate-400 font-medium">Sécurisé et confidentiel</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
