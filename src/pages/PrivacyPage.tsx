import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, Eye, Database, Globe, CheckCircle2 } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      {/* Header simplifié */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
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

      {/* Contenu avec meilleure lisibilité */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* En-tête */}
          <div className="border-b border-gray-200 pb-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Politique de confidentialité
            </h1>
            <p className="text-gray-500 text-sm">
              Dernière mise à jour : 15 février 2026
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <p className="text-gray-700 leading-relaxed">
              Chez Carnet Santé, nous accordons une importance primordiale à la protection 
              de vos données personnelles. Cette politique explique comment nous collectons, 
              utilisons et protégeons vos informations.
            </p>
          </div>

          {/* Sections avec meilleure hiérarchie visuelle */}
          <div className="space-y-8">
            {/* Collecte des données */}
            <section className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Collecte des données
              </h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>Nous collectons uniquement les données nécessaires au fonctionnement de la plateforme :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Informations d'identification (nom, email, téléphone)</li>
                  <li>Données de santé partagées volontairement</li>
                  <li>Historique des rendez-vous et consultations</li>
                  <li>Préférences de communication</li>
                </ul>
              </div>
            </section>

            {/* Sécurité des données */}
            <section className="border-l-4 border-emerald-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                Sécurité des données
              </h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>Vos données sont protégées par les mesures de sécurité suivantes :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Chiffrement de bout en bout</li>
                  <li>Stockage sur des serveurs certifiés en Europe</li>
                  <li>Accès strictement contrôlé et journalisé</li>
                  <li>Audits de sécurité réguliers</li>
                </ul>
              </div>
            </section>

            {/* Utilisation des données */}
            <section className="border-l-4 border-purple-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                Utilisation des données
              </h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>Vos données sont utilisées uniquement pour :</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Gestion des rendez-vous</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Suivi du dossier médical</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Communication médicale</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">Amélioration du service</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Partage des données */}
            <section className="border-l-4 border-orange-500 pl-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-600" />
                Partage des données
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Vos données ne sont jamais vendues à des tiers. Elles ne sont partagées qu'avec 
                votre consentement explicite avec les professionnels de santé que vous consultez.
              </p>
            </section>

            {/* Vos droits */}
            <section className="bg-gray-50 rounded-xl p-6 mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vos droits</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  "Accès", "Rectification", "Opposition", "Suppression"
                ].map((droit, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <span className="text-sm font-medium text-gray-700">{droit}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Pour exercer vos droits, contactez-nous à privacy@carnetsante.com
              </p>
            </section>
          </div>

          {/* Contact */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Pour toute question concernant cette politique, contactez notre délégué à la protection des données : 
              <a href="mailto:dpo@carnetsante.com" className="text-blue-600 hover:underline ml-1">
                dpo@carnetsante.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
