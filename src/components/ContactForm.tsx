import React from 'react';
import { Link } from 'react-router-dom';
import { useForm, ValidationError } from '@formspree/react';
import { 
  Send, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  AlertCircle 
} from 'lucide-react';

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const [state, handleSubmit] = useForm("mldbeodj");

  // État local pour gérer les valeurs du formulaire (optionnel mais recommandé)
  const [formValues, setFormValues] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  if (state.succeeded) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-10 text-center animate-fade-in">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h3 className="text-3xl font-bold text-gray-900 mb-3">Message envoyé !</h3>
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Retour à l'accueil
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all"
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Indicateur de progression */}
      {state.submitting && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-pulse">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-700 font-medium">Envoi en cours, veuillez patienter...</p>
        </div>
      )}

      {/* Nom complet */}
      <div className="group">
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          Nom complet <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <User className="w-5 h-5" />
          </div>
          <input
            id="name"
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            onInput={handleSubmit}
            required
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all hover:border-gray-300 text-gray-900 placeholder-gray-400"
            placeholder="Jean Dupont"
          />
        </div>
        <ValidationError 
          prefix="Nom" 
          field="name"
          errors={state.errors}
          className="text-red-500 text-sm mt-2 flex items-center gap-1 ml-1"
          render={({ message }) => (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}
        />
      </div>

      {/* Email */}
      <div className="group">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          Adresse email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Mail className="w-5 h-5" />
          </div>
          <input
            id="email"
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            onInput={handleSubmit}
            required
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all hover:border-gray-300 text-gray-900 placeholder-gray-400"
            placeholder="jean.dupont@email.com"
          />
        </div>
        <ValidationError 
          prefix="Email" 
          field="email"
          errors={state.errors}
          className="text-red-500 text-sm mt-2 flex items-center gap-1 ml-1"
          render={({ message }) => (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}
        />
      </div>

      {/* Téléphone */}
      <div className="group">
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          Téléphone <span className="text-gray-400 text-xs font-normal">(optionnel)</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Phone className="w-5 h-5" />
          </div>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            onInput={handleSubmit}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all hover:border-gray-300 text-gray-900 placeholder-gray-400"
            placeholder="+33 6 12 34 56 78"
          />
        </div>
      </div>

      {/* Sujet */}
      <div className="group">
        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          Sujet <span className="text-gray-400 text-xs font-normal">(optionnel)</span>
        </label>
        <select
          id="subject"
          name="subject"
          value={formValues.subject}
          onChange={handleChange}
          onInput={handleSubmit}
          className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all hover:border-gray-300 text-gray-900 appearance-none cursor-pointer"
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
      <div className="group">
        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
          Message <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-6 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <MessageSquare className="w-5 h-5" />
          </div>
          <textarea
            id="message"
            name="message"
            value={formValues.message}
            onChange={handleChange}
            onInput={handleSubmit}
            rows={6}
            required
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all hover:border-gray-300 text-gray-900 placeholder-gray-400 resize-none"
            placeholder="Décrivez votre demande en quelques mots..."
          />
        </div>
        <ValidationError 
          prefix="Message" 
          field="message"
          errors={state.errors}
          className="text-red-500 text-sm mt-2 flex items-center gap-1 ml-1"
          render={({ message }) => (
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}
        />
      </div>

      {/* Honeypot anti-spam */}
      <input type="text" name="_gotcha" style={{ display: 'none' }} />

      {/* Bouton d'envoi */}
      <button
        type="submit"
        disabled={state.submitting}
        className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 text-white py-5 px-6 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
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

      {/* Mention légale */}
      <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
        En soumettant ce formulaire, vous acceptez que vos données soient traitées conformément à notre{' '}
        <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all">
          politique de confidentialité
        </Link>
        . Vos informations sont sécurisées et ne seront jamais partagées avec des tiers.
      </p>
    </form>
  );
};

export default ContactForm;
