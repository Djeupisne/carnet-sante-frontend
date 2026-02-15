import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Building2, 
  Bell, 
  Stethoscope, 
  Pill, 
  LineChart,
  Shield,
  ArrowLeft,
  Sparkles,
  HeartPulse,
  Video,
  Clock,
  FileText,
  Users,
  MessageSquare,
  CreditCard,
  Award
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Gestion des rendez-vous",
      description: "Prenez, modifiez ou annulez vos rendez-vous en ligne en quelques clics. Recevez des rappels automatiques.",
      color: "from-blue-500 to-cyan-500",
      details: [
        "Prise de RDV 24h/24",
        "Rappels SMS et email",
        "Annulation en ligne",
        "Historique complet"
      ]
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Dossier médical numérique",
      description: "Accédez à votre dossier médical complet, où que vous soyez. Partagez-le avec vos médecins en toute sécurité.",
      color: "from-purple-500 to-pink-500",
      details: [
        "Documents sécurisés",
        "Partage contrôlé",
        "Historique médical",
        "Résultats d'analyses"
      ]
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Rappels intelligents",
      description: "Recevez des notifications pour vos rendez-vous, prises de médicaments et rappels de suivi médical.",
      color: "from-emerald-500 to-teal-500",
      details: [
        "Rappels personnalisés",
        "Notifications push",
        "Rappels SMS",
        "Alertes préventives"
      ]
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Téléconsultation",
      description: "Consultez vos médecins à distance via notre plateforme de visioconférence sécurisée.",
      color: "from-orange-500 to-amber-500",
      details: [
        "Visioconférence HD",
        "Partage d'écran",
        "Envoi de documents",
        "Consultations en direct"
      ]
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Disponibilité 24/7",
      description: "Accédez à vos informations et prenez des rendez-vous à tout moment, même le week-end.",
      color: "from-indigo-500 to-blue-500",
      details: [
        "Accès permanent",
        "Support réactif",
        "Mises à jour en temps réel",
        "Disponible partout"
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sécurité maximale",
      description: "Vos données sont protégées par les plus hauts standards de sécurité et de confidentialité.",
      color: "from-red-500 to-pink-500",
      details: [
        "Chiffrement AES-256",
        "Conformité RGPD",
        "Audit de sécurité",
        "Double authentification"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100"></div>
                <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 p-3 rounded-2xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Fonctionnalités
              </h1>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Tout ce dont vous avez besoin
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Découvrez toutes les fonctionnalités de notre plateforme pour gérer votre santé en toute simplicité
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group glass rounded-3xl p-8 border border-white/50 hover:shadow-2xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
              
              <div className="relative mb-6">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                <div className="relative bg-white rounded-2xl p-4 inline-flex shadow-lg">
                  <div className={`bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`}>
                    {feature.icon}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {feature.description}
              </p>

              <ul className="space-y-2 mt-4">
                {feature.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-500">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color}`}></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
