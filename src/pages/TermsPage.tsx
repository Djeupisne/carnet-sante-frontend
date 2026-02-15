import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle2, AlertCircle, Scale, HelpCircle } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
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
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="border-b border-gray-200 pb-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Conditions générales d'utilisation
            </h1>
            <p className="text-gray-500 text-sm">
              Dernière mise à jour : 15 février 2026
            </p>
          </div>

          <div className="space-y-6">
            {/* Acceptation */}
            <section className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Acceptation des conditions</h2>
                  <p className="text-gray-600 leading-relaxed">
                    En utilisant notre plateforme, vous acceptez les présentes conditions générales. 
                    Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
                  </p>
                </div>
              </div>
            </section>

            {/* Responsabilités */}
            <section className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Scale className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Responsabilités</h2>
                  <p className="text-gray-600 leading-relaxed">
                    La plateforme agit comme intermédiaire entre les patients et les professionnels de santé. 
                    Nous ne sommes pas responsables de la qualité des soins prodigués ni des décisions médicales.
                  </p>
                </div>
              </div>
            </section>

            {/* Obligations */}
            <section className="bg-emerald-50 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Obligations des utilisateurs</h2>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Fournir des informations exactes et à jour</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Respecter la confidentialité des autres utilisateurs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Ne pas utiliser la plateforme à des fins frauduleuses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Informer rapidement de tout changement important</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Résumé des conditions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Compte utilisateur",
                  items: ["Création libre", "Informations exactes", "Confidentialité"]
                },
                {
                  title: "Utilisation du service",
                  items: ["Usage personnel", "Respect des lois", "Sécurité"]
                },
                {
                  title: "Résiliation",
                  items: ["À tout moment", "Suppression des données", "Sans frais"]
                }
              ].map((section, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
