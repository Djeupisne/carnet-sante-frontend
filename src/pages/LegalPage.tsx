import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowLeft, Building2, MapPin, Phone, Mail, Globe, FileText, User } from 'lucide-react';

const LegalPage: React.FC = () => {
  const legalInfos = [
    {
      icon: <Building2 className="w-5 h-5" />,
      label: "Raison sociale",
      value: "Carnet Santé SAS"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Capital social",
      value: "50 000 €"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "RCS",
      value: "Paris B 123 456 789"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      label: "N° TVA",
      value: "FR 12 345678901"
    },
    {
      icon: <User className="w-5 h-5" />,
      label: "Directeur de publication",
      value: "Oualoumi Djeupisne"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
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
              Mentions légales
            </h1>
            <p className="text-gray-500 text-sm">
              Conformément à la loi n°2004-575 du 21 juin 2004
            </p>
          </div>

          {/* Grille d'informations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {legalInfos.map((info, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {info.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{info.label}</p>
                  <p className="font-medium text-gray-900">{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Adresse */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Siège social
            </h2>
            <address className="not-italic text-gray-600 leading-relaxed">
              123 Avenue de la Santé<br />
              75001 Lomé<br />
              Togo
            </address>
          </div>

          {/* Contact */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Contact
            </h2>
            <div className="space-y-3">
              <a href="mailto:oualoumidjeupisne@gmail.com" 
                 className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">oualoumidjeupisne@gmail.com</span>
              </a>
              <a href="tel:+22893360150" 
                 className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">+228 93 36 01 50</span>
              </a>
            </div>
          </div>

          {/* Hébergement */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Hébergement</h2>
            <p className="text-sm text-gray-500">
              Render · 525 Brannan Street · San Francisco, CA 94107 · États-Unis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
