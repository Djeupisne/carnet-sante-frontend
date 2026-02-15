import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle, AlertCircle, Scale } from 'lucide-react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100"></div>
                <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 p-3 rounded-2xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Conditions d'utilisation
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
        <div className="glass rounded-3xl p-8 md:p-12 border border-white/50">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Conditions générales d'utilisation
          </h1>
          <p className="text-slate-600 mb-8">Dernière mise à jour : 15 février 2026</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                Acceptation des conditions
              </h2>
              <p className="text-slate-600 leading-relaxed">
                En utilisant notre plateforme, vous acceptez les présentes conditions générales.
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6 text-blue-600" />
                Responsabilités
              </h2>
              <p className="text-slate-600 leading-relaxed">
                La plateforme agit comme intermédiaire entre les patients et les professionnels de santé.
                Nous ne sommes pas responsables de la qualité des soins prodigués ni des décisions médicales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                Obligations des utilisateurs
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>Fournir des informations exactes et à jour</li>
                <li>Respecter la confidentialité des autres utilisateurs</li>
                <li>Ne pas utiliser la plateforme à des fins frauduleuses</li>
                <li>Informer rapidement de tout changement important</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
