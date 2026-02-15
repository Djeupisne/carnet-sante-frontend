import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Heart, 
  Droplets,
  Scale,
  Activity,
  Edit,
  Save,
  X,
  ArrowLeft,
  Camera,
  Lock,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react';

const PatientProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    address: '',
    city: '',
    postalCode: '',
    bloodType: user?.bloodType || '',
    weight: '',
    height: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: 'dark',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

  useEffect(() => {
    // Simuler le chargement des données supplémentaires
    setFormData(prev => ({
      ...prev,
      address: '123 Rue de la Santé',
      city: 'Paris',
      postalCode: '75001',
      weight: '70',
      height: '175',
      emergencyContact: {
        name: 'Marie Dupont',
        phone: '06 98 76 54 32',
        relationship: 'Conjointe'
      }
    }));
  }, []);

  const handleSave = () => {
    setLoading(true);
    // Simuler une sauvegarde
    setTimeout(() => {
      updateUser({
        ...user!,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber
      });
      showNotification('✅ Profil mis à jour avec succès', 'success');
      setIsEditing(false);
      setLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      bloodType: user?.bloodType || '',
      weight: formData.weight,
      height: formData.height,
      emergencyContact: formData.emergencyContact
    });
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non renseigné';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-black gradient-text text-white">Mon Profil</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'profile', label: 'Profil', icon: User },
              { id: 'security', label: 'Sécurité', icon: Lock },
              { id: 'preferences', label: 'Préférences', icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-white/60 hover:text-white/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Photo de profil */}
        <div className="futuristic-card p-8 mb-6 text-center relative">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white mx-auto">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition">
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mt-4">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-white/60">Patient</p>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-8 right-8 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
          )}
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Informations personnelles */}
            <div className="futuristic-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Informations personnelles
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Prénom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{formData.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Nom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{formData.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-white/40" />
                      {formData.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Téléphone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white flex items-center gap-2">
                      <Phone className="w-4 h-4 text-white/40" />
                      {formData.phoneNumber || 'Non renseigné'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Date de naissance</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white/40" />
                      {formatDate(formData.dateOfBirth)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Sexe</label>
                  {isEditing ? (
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Non spécifié</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  ) : (
                    <p className="text-white">
                      {formData.gender === 'M' ? 'Masculin' : formData.gender === 'F' ? 'Féminin' : 'Non spécifié'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="futuristic-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-400" />
                Adresse
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-white/60 mb-1">Adresse</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{formData.address || 'Non renseigné'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Ville</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{formData.city || 'Non renseigné'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Code postal</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{formData.postalCode || 'Non renseigné'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Informations médicales */}
            <div className="futuristic-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Informations médicales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Groupe sanguin</label>
                  {isEditing ? (
                    <select
                      value={formData.bloodType}
                      onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Non spécifié</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="text-white flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-red-400" />
                      {formData.bloodType || 'Non renseigné'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Poids (kg)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white flex items-center gap-2">
                      <Scale className="w-4 h-4 text-green-400" />
                      {formData.weight ? `${formData.weight} kg` : 'Non renseigné'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Taille (cm)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" />
                      {formData.height ? `${formData.height} cm` : 'Non renseigné'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact d'urgence */}
            <div className="futuristic-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-400" />
                Contact d'urgence
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Nom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{formData.emergencyContact.name || 'Non renseigné'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Téléphone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{formData.emergencyContact.phone || 'Non renseigné'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Lien de parenté</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{formData.emergencyContact.relationship || 'Non renseigné'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            {isEditing && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 transition"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Sauvegarde...' : 'Enregistrer'}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="futuristic-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                Sécurité du compte
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Mot de passe actuel</label>
                  <input
                    type="password"
                    placeholder="********"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                </div>
                
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                  Changer le mot de passe
                </button>
              </div>
            </div>

            <div className="futuristic-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Authentification à deux facteurs
              </h3>
              
              <p className="text-white/80 mb-4">
                Renforcez la sécurité de votre compte en activant l'authentification à deux facteurs.
              </p>
              
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                Activer la 2FA
              </button>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="futuristic-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                Langue et région
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Langue</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="futuristic-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-400" />
                Notifications
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white">Notifications par email</span>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.email}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: { ...preferences.notifications, email: e.target.checked }
                    })}
                    className="w-5 h-5"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white">Notifications par SMS</span>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.sms}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: { ...preferences.notifications, sms: e.target.checked }
                    })}
                    className="w-5 h-5"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white">Notifications push</span>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.push}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: { ...preferences.notifications, push: e.target.checked }
                    })}
                    className="w-5 h-5"
                  />
                </label>
              </div>
            </div>

            <div className="futuristic-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                Thème
              </h3>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                  className={`flex-1 p-4 rounded-lg border-2 transition ${
                    preferences.theme === 'light'
                      ? 'border-blue-400 bg-white/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Sun className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <span className="text-white text-sm">Clair</span>
                </button>
                
                <button
                  onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                  className={`flex-1 p-4 rounded-lg border-2 transition ${
                    preferences.theme === 'dark'
                      ? 'border-blue-400 bg-white/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Moon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <span className="text-white text-sm">Sombre</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfilePage;
