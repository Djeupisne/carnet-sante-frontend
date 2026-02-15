import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  ArrowLeft, 
  MapPin, 
  Clock, 
  HelpCircle,
  Phone,
  Heart,
  Shield,
  Users,
  Sparkles,
  CheckCircle,
  Star,
  MessageCircle,
  Headphones,
  Globe
} from 'lucide-react';
import ContactForm from '../components/ContactForm';

const ContactPage: React.FC = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      value: "oualoumidjeupisne@gmail.com",
      link: "mailto:oualoumidjeupisne@gmail.com",
      gradient: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      description: "Réponse sous 24h"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      label: "Téléphone",
      value: "+228 93 36 01 50",
      link: "tel:+22893360150",
      gradient: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      description: "Urgences uniquement"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: "Adresse",
      value: "Lomé, Togo",
      link: null,
      gradient: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      description: "Sur rendez-vous"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Horaires",
      value: "Lun-Ven, 9h-18h",
      link: null,
      gradient: "from-orange-500 to-amber-500",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
      description: "Fermé le week-end"
    }
  ];

  const stats = [
    { icon: <MessageCircle className="w-5 h-5" />, value: "< 24h", label: "Délai de réponse", color: "from-blue-500 to-cyan-500" },
    { icon: <Users className="w-5 h-5" />, value: "1000+", label: "Clients satisfaits", color: "from-emerald-500 to-teal-500" },
    { icon: <Star className="w-5 h-5" />, value: "4.9/5", label: "Note moyenne", color: "from-yellow-500 to-orange-500" },
    { icon: <Shield className="w-5 h-5" />, value: "100%", label: "Sécurité garantie", color: "from-purple-500 to-pink-500" }
  ];

  const faqItems = [
    "Comment prendre un rendez-vous ?",
    "Comment modifier mes informations ?",
    "Puis-je annuler une consultation ?",
    "Comment se passe une téléconsultation ?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      {/* Header avec effet glassmorphisme */}
      <nav className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 p-2.5 rounded-xl shadow-lg">
                  <Heart className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Carnet Santé
                </span>
                <p className="text-xs text-gray-500">Contact & Support</p>
              </div>
            </Link>
            
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:text-blue-600 hover:border-blue-300 transition-all group shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Retour à l'accueil</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-[500px] h-[500px] bg-gradient-to-r from-blue-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-5 py-2.5 mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Nous sommes là pour vous aider</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Comment pouvons-nous
            <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
              vous aider ?
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Notre équipe de support est disponible pour répondre à toutes vos questions. 
            Que vous soyez patient, médecin ou partenaire, nous vous répondrons sous 24h.
          </p>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200/60 text-center hover:shadow-lg transition-all group hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 text-white group-hover:scale-110 transition-transform shadow-md`}>
                {stat.icon}
              </div>
              <p className="text-xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Informations */}
          <div className="lg:col-span-1 space-y-6">
            {/* Carte d'informations */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Contactez-nous</h2>
              </div>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className={`w-14 h-14 ${info.bgLight} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md`}>
                      <div className={info.textColor}>
                        {info.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        {info.label}
                      </p>
                      {info.link ? (
                        <a 
                          href={info.link}
                          className="text-gray-900 font-bold hover:text-blue-600 transition-colors text-lg"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 font-bold text-lg">{info.value}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carte horaires */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 text-white border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-bold">Horaires d'ouverture</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-300">Lundi - Vendredi</span>
                  <span className="font-semibold text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full">9h00 - 18h00</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-300">Samedi</span>
                  <span className="font-semibold text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full">10h00 - 14h00</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-300">Dimanche</span>
                  <span className="font-semibold text-red-400 bg-red-400/10 px-4 py-1.5 rounded-full">Fermé</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white">Réponse garantie</span> sous 24h ouvrées
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Card */}
            <Link
              to="/faq"
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all group block"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Questions fréquentes</h3>
                  <div className="space-y-2 mb-3">
                    {faqItems.slice(0, 2).map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                        {item}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center text-sm text-purple-600 font-semibold">
                    Voir toutes les FAQs
                    <ArrowLeft className="w-4 h-4 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Badge de confiance */}
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-6 text-white text-center shadow-xl">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-90" />
              <p className="text-sm font-medium opacity-90 mb-1">Données sécurisées</p>
              <p className="text-xs opacity-75">Chiffrement AES-256 • Conforme RGPD</p>
            </div>
          </div>

          {/* Colonne droite - Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
              {/* En-tête du formulaire */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                  Envoyez-nous un message
                </h2>
                <p className="text-gray-600">
                  Remplissez le formulaire ci-dessous. Tous les champs marqués d'une <span className="text-red-500">*</span> sont obligatoires.
                </p>
              </div>

              <ContactForm />

              {/* Informations supplémentaires */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>Réponse sous 24h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span>Données sécurisées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-gray-400" />
                    <span>Support réactif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles pour les animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
