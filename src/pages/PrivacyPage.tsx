import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, Eye, Database, Globe } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      {/* Header */}
      <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 p-3 rounded-2xl shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Confidentialité
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

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass rounded-3xl p-8 md:p-12 border border-white/50">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Politique de confidentialité
          </h1>
          <p className="text-slate-600 mb-8">Dernière mise à jour : 15 février 2026</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-blue-600" />
                Collecte des données
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Nous collectons uniquement les données nécessaires au fonctionnement de la plateforme :
                informations d'identification, données de santé partagées volontairement,
                et historiques de rendez-vous. Toutes les données sont stockées de manière sécurisée
                sur des serveurs certifiés.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-emerald-600" />
                Sécurité des données
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Vos données sont chiffrées de bout en bout. Nous utilisons les protocoles de sécurité
                les plus avancés pour protéger vos informations médicales. L'accès à vos données est
                strictement contrôlé et journalisé.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-purple-600" />
                Utilisation des données
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Vos données sont utilisées uniquement pour :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2 text-slate-600">
                <li>La gestion de vos rendez-vous médicaux</li>
                <li>Le suivi de votre dossier médical</li>
                <li>L'amélioration de nos services</li>
                <li>La communication avec votre équipe médicale</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-orange-600" />
                Partage des données
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Vos données ne sont jamais vendues à des tiers. Elles ne sont partagées qu'avec
                votre consentement explicite avec les professionnels de santé que vous consultez.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
