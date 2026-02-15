import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { userService } from '../services/userService';
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
  ChevronRight,
  Loader2
} from 'lucide-react';

const PatientProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [userData, setUserData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    bloodType: '',
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      if (response.success && response.data.user) {
        const userData = response.data.user;
        setUserData(userData);
        
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          dateOfBirth: userData.dateOfBirth || '',
          gender: userData.gender || '',
          address: userData.address || {
            street: '',
            city: '',
            postalCode: '',
            country: 'France'
          },
          bloodType: userData.bloodType || '',
          emergencyContact: userData.emergencyContact || {
            name: '',
            phone: '',
            relationship: ''
          }
        });

        if (userData.preferences) {
          setPreferences(userData.preferences);
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      showNotification('Erreur lors du chargement du profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        bloodType: formData.bloodType,
        emergencyContact: formData.emergencyContact,
        preferences: preferences
      };

      const response = await userService.updateProfile(updateData);
      
      if (response.success) {
        showNotification('✅ Profil mis à jour avec succès', 'success');
        setIsEditing(false);
        // Mettre à jour le contexte
        if (user) {
          updateUser({
            ...user,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber
          });
        }
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      showNotification('❌ Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('❌ Les mots de passe ne correspondent pas', 'error');
      return;
    }

    try {
      setSaving(true);
      await userService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      showNotification('✅ Mot de passe modifié avec succès', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('❌ Erreur changement mot de passe:', error);
      showNotification(error.message || '❌ Erreur lors du changement de mot de passe', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        dateOfBirth: userData.dateOfBirth || '',
        gender: userData.gender || '',
        address: userData.address || {
          street: '',
          city: '',
          postalCode: '',
          country: 'France'
        },
        bloodType: userData.bloodType || '',
        emergencyContact: userData.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        }
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non renseigné';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
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
          <p className="text-white/60">Patient • {user.uniqueCode}</p>
          
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
                  <p className="text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-white/40" />
                    {formData.email}
                  </p>
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
                  <p className="text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/40" />
                    {formatDate(formData.dateOfBirth)}
                  </p>
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
                      <option value="male">Masculin</option>
                      <option value="female">Féminin</option>
                      <option value="other">Autre</option>
                    </select>
                  ) : (
                    <p className="text-white">
                      {formData.gender === 'male' ? 'Masculin' : 
                       formData.gender === 'female' ? 'Féminin' : 
                       formData.gender || 'Non spécifié'}
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
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Rue</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{formData.address.street || 'Non renseigné'}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Ville</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-white">{formData.address.city || 'Non renseigné'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Code postal</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address.postalCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, postalCode: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-white">{formData.address.postalCode || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Informations médicales */}
            <div className="futuristic-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Informations médicales
              </h3>
              
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
                  disabled={saving}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Sauvegarde...' : 'Enregistrer'}
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
                Changer le mot de passe
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Mot de passe actuel</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <button
                  onClick={handleChangePassword}
                  disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {saving ? 'Modification...' : 'Changer le mot de passe'}
                </button>
              </div>
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
              
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1">Langue</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
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

              {isEditing && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Sauvegarde...' : 'Enregistrer les préférences'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfilePage;
