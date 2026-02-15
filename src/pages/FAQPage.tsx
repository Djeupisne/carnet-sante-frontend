import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      category: "Général",
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
      <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100"></div>
                <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 p-3 rounded-2xl shadow-lg">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                FAQ
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Questions fréquentes
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Retrouvez les réponses aux questions les plus courantes
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 glass border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* FAQ */}
        <div className="space-y-8">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="glass rounded-3xl p-8 border border-white/50">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div
                      key={faqIndex}
                      className="border border-slate-200 rounded-xl overflow-hidden bg-white/50"
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-slate-900">{
