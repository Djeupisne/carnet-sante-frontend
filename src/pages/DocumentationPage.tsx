import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  ArrowLeft, 
  Code, 
  Users,
  Shield,
  Zap,
  Globe,
  Smartphone,
  Server,
  Lock,
  ChevronRight
} from 'lucide-react';

const DocumentationPage: React.FC = () => {
  const sections = [
    {
      title: "Guide utilisateur",
      icon: <Users className="w-5 h-5" />,
      color: "bg-blue-100",
      textColor: "text-blue-600",
      description: "Apprenez à utiliser toutes les fonctionnalités de la plateforme",
      links: [
        "Premiers pas",
        "Gestion des rendez-vous",
        "Dossier médical",
        "Téléconsultation",
        "Profil et préférences"
      ]
    },
    {
      title: "Guide médecin",
      icon: <Code className="w-5 h-5" />,
      color: "bg-purple-100",
      textColor: "text-purple-600",
      description: "Configurez votre compte et gérez vos patients",
      links: [
        "Configuration du compte",
        "Gestion des patients",
        "Calendrier et disponibilités",
        "Téléconsultation",
        "Facturation"
      ]
    },
    {
      title: "API Documentation",
      icon: <Server className="w-5 h-5" />,
      color: "bg-emerald-100",
      textColor: "text-emerald-600",
      description: "Intégrez notre API dans vos applications",
      links: [
        "Authentification",
        "Endpoints",
        "Webhooks",
        "Rate limiting",
        "Exemples de code"
      ]
    },
    {
      title: "Sécurité",
      icon: <Lock className="w-5 h-5" />,
      color: "bg-red-100",
      textColor: "text-red-600",
      description: "Comprendre nos mesures de sécurité",
      links: [
        "Chiffrement des données",
        "RGPD",
        "Politique de confidentialité",
        "Journalisation",
        "Certifications"
      ]
    },
    {
      title: "Applications mobiles",
      icon: <Smartphone className="w-5 h-5" />,
      color: "bg-orange-100",
      textColor: "text-orange-600",
      description: "Utilisez nos applications iOS et Android",
      links: [
        "iOS",
        "Android",
        "Installation",
        "Mise à jour",
        "Dépannage"
      ]
    },
    {
      title: "Intégration",
      icon: <Globe className="w-5 h-5" />,
      color: "bg-indigo-100",
      textColor: "text-indigo-600",
      description: "Intégrez nos services dans votre système",
      links: [
        "Systèmes de santé",
        "Dossier patient",
        "Paiements",
        "Notifications",
        "Calendriers"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">Carnet Santé</span>
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Documentation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour utiliser et intégrer notre plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-200 overflow-hidden group cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${section.color} rounded-lg flex items-center justify-center`}>
                    <div className={section.textColor}>
                      {section.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  {section.description}
                </p>

                <ul className="space-y-2">
                  {section.links.slice(0, 3).map((link, idx) => (
                    <li key={idx} className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      {link}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center text-sm text-blue-600 group-hover:gap-2 transition-all">
                  <span>Voir plus</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Démarrage rapide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <div className="text-2xl font-bold text-white mb-2">1.</div>
              <h3 className="font-semibold text-white mb-1">Créez un compte</h3>
              <p className="text-sm text-white/80">Inscrivez-vous gratuitement en quelques clics</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <div className="text-2xl font-bold text-white mb-2">2.</div>
              <h3 className="font-semibold text-white mb-1">Configurez votre profil</h3>
              <p className="text-sm text-white/80">Renseignez vos informations personnelles</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
              <div className="text-2xl font-bold text-white mb-2">3.</div>
              <h3 className="font-semibold text-white mb-1">Commencez à utiliser</h3>
              <p className="text-sm text-white/80">Prenez vos premiers rendez-vous</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
