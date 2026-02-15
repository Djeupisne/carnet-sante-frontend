import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowLeft, MapPin, Phone, Mail, Building2 } from 'lucide-react';

const LegalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100"></div>
                <div className="relative bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 p-3 rounded-2xl shadow-lg">
                  <Scale className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Mentions légales
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
            Mentions légales
          </h1>
          <p className="text-slate-600 mb-8">Conformément à la loi n°2004-575 du 21 juin 2004</p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                Éditeur du site
              </h2>
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-700"><strong>Raison sociale :</strong> Carnet Santé SAS</p>
                <p className="text-slate-700"><strong>Capital :</strong> 50 000 €</p>
                <p className="text-slate-700"><strong>RCS :</strong> Paris B 123 456 789</p>
                <p className="text-slate-700"><strong>Numéro de TVA :</strong> FR 12 345678901</p>
                <p className="text-slate-700"><strong>Directeur de publication :</strong> Oualoumi Djeupisne</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-emerald-600" />
                Siège social
              </h2>
              <p className="text-slate-600">
                123 Avenue de la Santé<br />
                75001 Paris<br />
                France
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Phone className="w-6 h-6 text-purple-600" />
                Contact
              </h2>
              <div className="space-y-2">
                <p className="text-slate-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  contact@carnetsante.com
                </p>
                <p className="text-slate-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +33 1 23 45 67 89
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Hébergement</h2>
              <p className="text-slate-600">
                <strong>Render</strong><br />
                525 Brannan Street<br />
                San Francisco, CA 94107<br />
                États-Unis
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
