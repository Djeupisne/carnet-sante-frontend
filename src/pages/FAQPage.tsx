import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      category: "Général",
      icon: "🏥",
      questions: [
        {
          q: "Qu'est-ce que Carnet Santé ?",
          a: "Carnet Santé est une plateforme numérique qui vous permet de gérer votre santé en ligne : prise de rendez-vous, dossier médical numérique, téléconsultations, et bien plus encore."
        },
        {
          q: "L'application est-elle gratuite ?",
          a: "Oui, l'application est entièrement gratuite pour les patients. Les médecins et établissements disposent d'offres adaptées à leurs besoins."
        },
        {
          q: "Mes données sont-elles sécurisées ?",
          a: "Absolument ! Toutes vos données sont chiffrées et stockées sur des serveurs sécurisés. Nous sommes conformes aux normes RGPD et aux réglementations sur les données de santé."
        }
      ]
    },
    {
      category: "Rendez-vous",
      icon: "📅",
      questions: [
        {
          q: "Comment prendre un rendez-vous ?",
          a: "Connectez-vous à votre compte, recherchez un médecin par spécialité ou disponibilité, choisissez un créneau et confirmez votre rendez-vous."
        },
        {
          q: "Puis-je annuler un rendez-vous ?",
          a: "Oui, vous pouvez annuler ou modifier vos rendez-vous jusqu'à 24h avant la consultation directement depuis votre tableau de bord."
        },
        {
          q: "Comment se passe une téléconsultation ?",
          a: "Le jour de la consultation, vous recevrez un lien par email. Cliquez dessus pour rejoindre la visioconférence sécurisée avec votre médecin."
        }
      ]
    },
    {
      category: "Dossier médical",
      icon: "📋",
      questions: [
        {
          q: "Quels documents puis-je stocker ?",
          a: "Vous pouvez stocker tous vos documents médicaux : ordonnances, résultats d'analyses, comptes-rendus, imagerie médicale, etc."
        },
        {
          q: "Puis-je partager mon dossier avec un médecin ?",
          a: "Oui, vous contrôlez l'accès à votre dossier et pouvez le partager temporairement avec les professionnels de santé de votre choix."
        }
      ]
    },
    {
      category: "Compte et profil",
      icon: "👤",
      questions: [
        {
          q: "Comment modifier mes informations personnelles ?",
          a: "Connectez-vous à votre compte, allez dans 'Mon Profil' et vous pourrez modifier vos informations."
        },
        {
          q: "Que faire si j'ai oublié mon mot de passe ?",
          a: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Vous recevrez un email pour réinitialiser votre mot de passe."
        }
      ]
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-white" />
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Questions fréquentes
          </h1>
          <p className="text-gray-600">
            Retrouvez les réponses aux questions les plus courantes
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          />
        </div>

        {/* FAQ */}
        <div className="space-y-6">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.category}
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div key={faqIndex} className="p-6">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <span className="font-medium text-gray-900 pr-8">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <p className="mt-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucun résultat trouvé pour "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Vous ne trouvez pas votre réponse ?{" "}
          <Link to="/contact" className="text-blue-600 hover:underline">
            Contactez-nous
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
