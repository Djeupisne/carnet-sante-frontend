import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  Users,
  Building,
  HeartPulse
} from 'lucide-react';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: "Patient",
      price: "Gratuit",
      description: "Pour les patients qui souhaitent gérer leur santé",
      features: [
        "Gestion des rendez-vous",
        "Dossier médical personnel",
        "Rappels SMS/Email",
        "Historique des consultations",
        "Téléconsultation"
      ],
      color: "from-blue-500 to-cyan-500",
      icon: <HeartPulse className="w-8 h-8" />
    },
    {
      name: "Médecin",
      price: "49€",
      period: "/mois",
      description: "Pour les professionnels de santé",
      features: [
        "Gestion des patients",
        "Calendrier personnalisé",
        "Téléconsultation intégrée",
        "Dossiers médicaux",
        "Statistiques détaillées",
        "Support prioritaire"
      ],
      color: "from-purple-500 to-pink-500",
      icon: <Users className="w-8 h-8" />,
      popular: true
    },
    {
      name: "Établissement",
      price: "Sur devis",
      description: "Pour les cliniques et hôpitaux",
      features: [
        "Multi-utilisateurs",
        "API dédiée",
        "Personnalisation complète",
        "Support 24/7",
        "Formation incluse",
        "SLA garantie"
      ],
      color: "from-emerald-500 to-teal-500",
      icon: <Building className="w-8 h-8" />
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
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Tarifs
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
            Des tarifs adaptés à vos besoins
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choisissez la formule qui vous convient, sans engagement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative glass rounded-3xl p-8 border border-white/50 hover:shadow-2xl transition-all hover:-translate-y-2 ${
                plan.popular ? 'border-2 border-blue-400 shadow-xl' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Le plus populaire
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} p-4 mb-6 shadow-lg`}>
                <div className="text-white">
                  {plan.icon}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                {plan.period && <span className="text-slate-500">{plan.period}</span>}
              </div>
              <p className="text-slate-600 mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.name === "Patient" ? "/register" : "/contact"}
                className={`block w-full text-center py-3 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                    : 'glass border-2 border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                {plan.name === "Patient" ? "Commencer gratuitement" : "Nous contacter"}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-slate-500 text-sm">
          * Tous les prix sont HT. Une facture sera fournie après chaque paiement.
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
