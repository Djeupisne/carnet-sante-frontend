import React from 'react';
import { Link } from 'react-router-dom'; // ✅ IMPORT AJOUTÉ
import { useForm, ValidationError } from '@formspree/react';
import { Send, CheckCircle2, User, Mail, Phone, MessageSquare } from 'lucide-react';

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const [state, handleSubmit] = useForm("mldbeodj");

  if (state.succeeded) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-10 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Message envoyé !</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais (généralement sous 24h).
        </p>
        <div className="inline-flex items-center gap-2 text-sm text-emerald-600 bg-emerald-100 px-4 py-2 rounded-full">
          <CheckCircle2 className="w-4 h-4" />
          <span>Un email de confirmation a été envoyé</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Nom complet */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            id="name"
            type="text"
            name="name"
            required
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all group-focus-within:bg-white"
            placeholder="Jean Dupont"
          />
        </div>
        <ValidationError 
          prefix="Nom" 
          field="name"
          errors={state.errors}
          className="text-red-500 text-sm mt-1 flex items-center gap-1"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            id="email"
            type="email"
            name="email"
            required
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all group-focus-within:bg-white"
            placeholder="jean.dupont@email.com"
          />
        </div>
        <ValidationError 
          prefix="Email" 
          field="email"
          errors={state.errors}
          className="text-red-500 text-sm mt-1 flex items-center gap-1"
        />
      </div>

      {/* Téléphone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Téléphone <span className="text-gray-400 text-xs">(optionnel)</span>
        </label>
        <div className="relative group">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            id="phone"
            type="tel"
            name="phone"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all group-focus-within:bg-white"
            placeholder="+228 93 36 01 50"
          />
        </div>
      </div>

      {/* Sujet */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Sujet <span className="text-gray-400 text-xs">(optionnel)</span>
        </label>
        <select
          id="subject"
          name="subject"
          className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all focus:bg-white appearance-none cursor-pointer"
        >
          <option value="">Sélectionnez un sujet</option>
          <option value="Question générale">📝 Question générale</option>
          <option value="Support technique">🛠️ Support technique</option>
          <option value="Partenariat">🤝 Partenariat</option>
          <option value="Facturation">💰 Facturation</option>
          <option value="Autre">❓ Autre</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <div className="relative group">
          <MessageSquare className="absolute left-4 top-6 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all group-focus-within:bg-white resize-none"
            placeholder="Décrivez votre demande en quelques mots..."
          />
        </div>
        <ValidationError 
          prefix="Message" 
          field="message"
          errors={state.errors}
          className="text-red-500 text-sm mt-1 flex items-center gap-1"
        />
      </div>

      {/* Honeypot anti-spam */}
      <input type="text" name="_gotcha" style={{ display: 'none' }} />

      {/* Bouton d'envoi */}
      <button
        type="submit"
        disabled={state.submitting}
        className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        {state.submitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Envoi en cours...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <span>Envoyer le message</span>
          </>
        )}
      </button>

      {/* Mention légale - avec Link maintenant défini */}
      <p className="text-xs text-gray-400 text-center mt-4">
        En soumettant ce formulaire, vous acceptez que vos données soient traitées conformément à notre 
        <Link to="/privacy" className="text-blue-600 hover:underline mx-1">
          politique de confidentialité
        </Link>.
      </p>
    </form>
  );
};

export default ContactForm;
