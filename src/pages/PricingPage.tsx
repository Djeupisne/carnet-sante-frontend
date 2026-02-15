import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, ArrowLeft, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: "Patient",
      price: "0 €",
      description: "Pour les patients",
      features: [
        "Gestion des rendez-vous",
        "Dossier médical personnel",
        "Rappels SMS/Email",
        "Historique des consultations",
        "Téléconsultation"
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: false
    },
    {
      name: "Médecin",
      price: "49 €",
      period: "/mois",
      description: "Pour les professionnels",
      features: [
        "Gestion des patients",
        "Calendrier personnalisé",
        "Téléconsultation intégrée",
        "Dossiers médicaux",
        "Statistiques détaillées",
        "Support prioritaire"
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: true
    },
    {
      name: "Établissement",
      price: "Sur devis",
      description: "Pour cliniques et hôpitaux",
      features: [
        "Multi-utilisateurs",
        "API dédiée",
        "Personnalisation",
        "Support 24/7",
        "Formation incluse",
        "SLA garantie"
      ],
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
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
            Tarifs adaptés à vos besoins
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choisissez la formule qui vous convient, sans engagement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg border-2 relative ${
                plan.popular ? 'border-purple-400' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Recommandé
                </div>
              )}
              
              <div className="p-6">
                <div className={`w-12 h-12 ${plan.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <div className={`bg-gradient-to-r ${plan.color} bg-clip-text text-transparent font-bold text-xl`}>
                    {plan.name[0]}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 text-sm ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.name === "Patient" ? "/register" : "/contact"}
                  className={`block w-full text-center py-3 ${plan.buttonColor} text-white rounded-xl font-semibold transition-all hover:shadow-lg`}
                >
                  {plan.name === "Patient" ? "Commencer gratuitement" : "Nous contacter"}
                </Link>
              </div>
            </div>
          ))}
        </div>

       <div className="mt-8 text-center">
  <p className="text-sm text-red-500">
    * Tous les prix sont HT. Une facture sera fournie après chaque paiement.
  </p>
  <Link
    to="/faq"
    className="inline-flex items-center gap-1 text-sm text-green-600 hover:underline mt-4"
  >
    <HelpCircle className="w-4 h-4" />
    Questions fréquentes sur les tarifs
  </Link>
</div>

      </div>
    </div>
  );
};

export default PricingPage;
