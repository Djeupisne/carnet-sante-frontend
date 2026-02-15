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
  Lock
} from 'lucide-react';

const DocumentationPage: React.FC = () => {
  const sections = [
    {
      title: "Guide utilisateur",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
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
      icon: <Code className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
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
      icon: <Server className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-500",
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
      icon: <Lock className="w-6 h-6" />,
      color: "from-red-500 to-pink-500",
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
      icon: <Smartphone className="w-6 h-6" />,
      color: "from-orange-500 to-amber-500",
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
      icon: <Globe className="w-6 h-6" />,
      color: "from-indigo-500 to-blue-500",
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
      <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100"></div>
                <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 p-3 rounded-2xl shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Documentation
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
            Documentation technique
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Tout ce dont vous avez besoin pour utiliser et intégrer notre plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="feature-card group glass rounded-3xl p-8 border border-white/50 hover:shadow-2xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
              
              <div className="relative mb-6">
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                <div className="relative bg-white rounded-2xl p-4 inline-flex shadow-lg">
                  <div className={`bg-gradient-to-br ${section.color} bg-clip-text text-transparent`}>
                    {section.icon}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                {section.title}
              </h3>

              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-slate-600 hover:text-blue-600 transition-colors text-sm flex items-center gap-2"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${section.color}`}></div>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 glass rounded-3xl p-8 border border-white/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Démarrage rapide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/50 rounded-xl p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">1.</div>
              <h3 className="font-semibold text-slate-900 mb-2">Créez un compte</h3>
              <p className="text-sm text-slate-600">Inscrivez-vous gratuitement en quelques clics</p>
            </div>
            <div className="bg-white/50 rounded-xl p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">2.</div>
              <h3 className="font-semibold text-slate-900 mb-2">Configurez votre profil</h3>
              <p className="text-sm text-slate-600">Renseignez vos informations personnelles</p>
            </div>
            <div className="bg-white/50 rounded-xl p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">3.</div>
              <h3 className="font-semibold text-slate-900 mb-2">Commencez à utiliser</h3>
              <p className="text-sm text-slate-600">Prenez vos premiers rendez-vous</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
