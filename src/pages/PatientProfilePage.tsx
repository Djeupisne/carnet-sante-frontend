import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { userService, UserPreferences } from '../services/userService';
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
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

const PatientProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [userData, setUserData] = useState<any>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
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
    } as Address,
    bloodType: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    } as EmergencyContact
  });

  const [preferences, setPreferences] = useState<UserPreferences>({
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

  const [showPasswordErrors, setShowPasswordErrors] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  // Charger les données utilisateur
  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  // Appliquer le thème et la langue
  useEffect(() => {
    applyTheme(preferences.theme);
    applyLanguage(preferences.language);
  }, [preferences.theme, preferences.language]);

  const applyTheme = (theme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    if (theme === 'light') {
      // Mode clair
      root.style.setProperty('--bg-primary', '#f9fafb');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#6b7280');
      root.style.setProperty('--border-color', '#e5e7eb');
      
      // Ajouter une classe pour le mode clair
      root.classList.remove('dark');
      root.classList.add('light');
      
      // Changer la couleur de fond du body
      document.body.className = 'bg-gray-50';
    } else {
      // Mode sombre
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--border-color', '#334155');
      
      // Ajouter une classe pour le mode sombre
      root.classList.remove('light');
      root.classList.add('dark');
      
      // Changer la couleur de fond du body
      document.body.className = 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';
    }
  };

  const applyLanguage = (language: string) => {
    // Stocker la langue dans localStorage
    localStorage.setItem('preferred-language', language);
    
    // Changer la direction du texte si nécessaire
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    
    // Vous pouvez également changer les textes ici si vous avez un système d'internationalisation
    console.log('🌐 Langue changée:', language);
  };

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

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('❌ Veuillez sélectionner une image', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('❌ L\'image ne doit pas dépasser 5MB', 'error');
      return;
    }

    try {
      setUploadingPhoto(true);
      
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await userService.updateProfilePicture(formData);
      
      if (response.success) {
        showNotification('✅ Photo de profil mise à jour', 'success');
        if (user) {
          updateUser({
            ...user,
            profilePicture: response.data.profilePicture
          });
        }
      }
    } catch (error) {
      console.error('❌ Erreur upload photo:', error);
      showNotification('❌ Erreur lors de l\'upload', 'error');
    } finally {
      setUploadingPhoto(false);
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
        emergencyContact: formData.emergencyContact
      };

      const response = await userService.updateProfile(updateData);
      
      if (response.success) {
        showNotification('✅ Profil mis à jour avec succès', 'success');
        setIsEditing(false);
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

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      
      // Sauvegarde locale immédiate
      localStorage.setItem('preferences', JSON.stringify(preferences));
      
      // Appliquer les changements immédiatement
      applyTheme(preferences.theme);
      applyLanguage(preferences.language);
      
      showNotification('✅ Préférences mises à jour', 'success');
      
      // Tentative de sauvegarde sur le serveur (non bloquante)
      try {
        await userService.updatePreferences(preferences);
        console.log('✅ Préférences sauvegardées sur le serveur');
      } catch (serverError) {
        console.warn('⚠️ Sauvegarde serveur échouée, mais changements appliqués localement');
      }
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde préférences:', error);
      showNotification('❌ Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setShowPasswordErrors({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false
    });

    let hasError = false;
    const errors = { ...showPasswordErrors };

    if (!passwordData.currentPassword) {
      errors.currentPassword = true;
      hasError = true;
    }
    if (!passwordData.newPassword) {
      errors.newPassword = true;
      hasError = true;
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = true;
      hasError = true;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('❌ Les mots de passe ne correspondent pas', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showNotification('❌ Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }

    if (hasError) {
      setShowPasswordErrors(errors);
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

  const getBloodTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'A+': 'A+',
      'A-': 'A-',
      'B+': 'B+',
      'B-': 'B-',
      'AB+': 'AB+',
      'AB-': 'AB-',
      'O+': 'O+',
      'O-': 'O-'
    };
    return types[type] || type;
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300"
         style={{ 
           backgroundColor: preferences.theme === 'light' ? '#f9fafb' : '#0f172a',
           color: preferences.theme === 'light' ? '#111827' : '#ffffff'
         }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300"
              style={{ 
                backgroundColor: preferences.theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.9)',
                borderColor: preferences.theme === 'light' ? '#e5e7eb' : '#334155'
              }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: preferences.theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                  color: preferences.theme === 'light' ? '#4b5563' : '#ffffff'
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-black gradient-text">Mon Profil</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="border-b transition-colors duration-300"
           style={{ 
             borderColor: preferences.theme === 'light' ? '#e5e7eb' : '#334155',
             backgroundColor: preferences.theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)'
           }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'profile', label: preferences.language === 'fr' ? 'Profil' : 'Profile', icon: User },
              { id: 'security', label: preferences.language === 'fr' ? 'Sécurité' : 'Security', icon: Lock },
              { id: 'preferences', label: preferences.language === 'fr' ? 'Préférences' : 'Preferences', icon: Bell }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
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
        <div className="rounded-xl p-8 mb-6 text-center relative transition-colors duration-300"
             style={{ 
               backgroundColor: preferences.theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)',
               borderColor: preferences.theme === 'light' ? '#e5e7eb' : '#334155',
               borderWidth: '1px'
             }}>
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white mx-auto">
              {user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
              )}
            </div>
            {isEditing && (
              <div className="absolute bottom-0 right-0">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload"
                  className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition cursor-pointer flex items-center justify-center"
                >
                  {uploadingPhoto ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-white" />
                  )}
                </label>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-4" style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-500">Patient • {user.uniqueCode}</p>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-8 right-8 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition"
            >
              <Edit className="w-4 h-4" />
              {preferences.language === 'fr' ? 'Modifier' : 'Edit'}
            </button>
          )}
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Informations personnelles */}
            <div className="rounded-xl p-6 transition-colors duration-300"
                 style={{ 
                   backgroundColor: preferences.theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)',
                   borderColor: preferences.theme === 'light' ? '#e5e7eb' : '#334155',
                   borderWidth: '1px'
                 }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                {preferences.language === 'fr' ? 'Informations personnelles' : 'Personal Information'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    {preferences.language === 'fr' ? 'Prénom' : 'First Name'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                        borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                        color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                      }}
                    />
                  ) : (
                    <p style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>{formData.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    {preferences.language === 'fr' ? 'Nom' : 'Last Name'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                        borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                        color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                      }}
                    />
                  ) : (
                    <p style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>{formData.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    Email
                  </label>
                  <p className="flex items-center gap-2" style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>
                    <Mail className="w-4 h-4 text-gray-400" />
                    {formData.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    {preferences.language === 'fr' ? 'Téléphone' : 'Phone'}
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                        borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                        color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                      }}
                    />
                  ) : (
                    <p className="flex items-center gap-2" style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>
                      <Phone className="w-4 h-4 text-gray-400" />
                      {formData.phoneNumber || 'Non renseigné'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    {preferences.language === 'fr' ? 'Date de naissance' : 'Date of Birth'}
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                        borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                        color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                      }}
                    />
                  ) : (
                    <p className="flex items-center gap-2" style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(formData.dateOfBirth)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    {preferences.language === 'fr' ? 'Sexe' : 'Gender'}
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                        borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                        color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                      }}
                    >
                      <option value="">{preferences.language === 'fr' ? 'Non spécifié' : 'Not specified'}</option>
                      <option value="male">{preferences.language === 'fr' ? 'Masculin' : 'Male'}</option>
                      <option value="female">{preferences.language === 'fr' ? 'Féminin' : 'Female'}</option>
                      <option value="other">{preferences.language === 'fr' ? 'Autre' : 'Other'}</option>
                    </select>
                  ) : (
                    <p style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>
                      {formData.gender === 'male' ? (preferences.language === 'fr' ? 'Masculin' : 'Male') : 
                       formData.gender === 'female' ? (preferences.language === 'fr' ? 'Féminin' : 'Female') : 
                       formData.gender || (preferences.language === 'fr' ? 'Non spécifié' : 'Not specified')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div className="rounded-xl p-6 transition-colors duration-300"
                 style={{ 
                   backgroundColor: preferences.theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)',
                   borderColor: preferences.theme === 'light' ? '#e5e7eb' : '#334155',
                   borderWidth: '1px'
                 }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-400" />
                {preferences.language === 'fr' ? 'Adresse' : 'Address'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    {preferences.language === 'fr' ? 'Rue' : 'Street'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                        borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                        color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                      }}
                    />
                  ) : (
                    <p style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>{formData.address.street || 'Non renseigné'}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1"
                           style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                      {preferences.language === 'fr' ? 'Ville' : 'City'}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ 
                          backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                          borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                          color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                        }}
                      />
                    ) : (
                      <p style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>{formData.address.city || 'Non renseigné'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1"
                           style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                      {preferences.language === 'fr' ? 'Code postal' : 'Postal Code'}
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.address.postalCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, postalCode: e.target.value }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ 
                          backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                          borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                          color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                        }}
                      />
                    ) : (
                      <p style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>{formData.address.postalCode || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Informations médicales */}
            <div className="rounded-xl p-6 transition-colors duration-300"
                 style={{ 
                   backgroundColor: preferences.theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)',
                   borderColor: preferences.theme === 'light' ? '#e5e7eb' : '#334155',
                   borderWidth: '1px'
                 }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                {preferences.language === 'fr' ? 'Informations médicales' : 'Medical Information'}
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1"
                       style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                  {preferences.language === 'fr' ? 'Groupe sanguin' : 'Blood Type'}
                </label>
                {isEditing ? (
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ 
                      backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                      borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                      color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                    }}
                  >
                    <option value="">{preferences.language === 'fr' ? 'Non spécifié' : 'Not specified'}</option>
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
                  <p className="flex items-center gap-2" style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>
                    <Droplets className="w-4 h-4 text-red-400" />
                    {getBloodTypeLabel(formData.bloodType) || (preferences.language === 'fr' ? 'Non renseigné' : 'Not specified')}
                  </p>
                )}
              </div>
            </div>

            {/* Contact d'urgence */}
            <div className="rounded-xl p-6 transition-colors duration-300"
                 style={{ 
                   backgroundColor: preferences.theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)',
                   borderColor: preferences.theme === 'light' ? '#e5e7eb' : '#334155',
                   borderWidth: '1px'
                 }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-400" />
                {preferences.language === 'fr' ? 'Contact d\'urgence' : 'Emergency Contact'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    {preferences.language === 'fr' ? 'Nom' : 'Name'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                        borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                        color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                      }}
                    />
                  ) : (
                    <p style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>{formData.emergencyContact.name || 'Non renseigné'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    {preferences.language === 'fr' ? 'Téléphone' : 'Phone'}
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                        borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                        color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                      }}
                    />
                  ) : (
                    <p style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>{formData.emergencyContact.phone || 'Non renseigné'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    {preferences.language === 'fr' ? 'Lien de parenté' : 'Relationship'}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ 
                        backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                        borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                        color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                      }}
                    />
                  ) : (
                    <p style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>{formData.emergencyContact.relationship || 'Non renseigné'}</p>
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
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  {preferences.language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? (preferences.language === 'fr' ? 'Sauvegarde...' : 'Saving...') : (preferences.language === 'fr' ? 'Enregistrer' : 'Save')}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="rounded-xl p-6 transition-colors duration-300"
                 style={{ 
                   backgroundColor: preferences.theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)',
                   borderColor: preferences.theme === 'light' ? '#e5e7eb' : '#334155',
                   borderWidth: '1px'
                 }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                {preferences.language === 'fr' ? 'Changer le mot de passe' : 'Change Password'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    {preferences.language === 'fr' ? 'Mot de passe actuel' : 'Current Password'}
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      showPasswordErrors.currentPassword ? 'border-red-500' : ''
                    }`}
                    style={{ 
                      backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                      borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                      color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                    }}
                  />
                  {showPasswordErrors.currentPassword && (
                    <p className="text-red-400 text-xs mt-1">
                      {preferences.language === 'fr' ? 'Mot de passe requis' : 'Password required'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    {preferences.language === 'fr' ? 'Nouveau mot de passe' : 'New Password'}
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      showPasswordErrors.newPassword ? 'border-red-500' : ''
                    }`}
                    style={{ 
                      backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                      borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                      color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                    }}
                  />
                  {showPasswordErrors.newPassword && (
                    <p className="text-red-400 text-xs mt-1">
                      {preferences.language === 'fr' ? 'Nouveau mot de passe requis' : 'New password required'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1"
                         style={{ color: preferences.theme === 'light' ? '#4b5563' : '#94a3b8' }}>
                    {preferences.language === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      showPasswordErrors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    style={{ 
                      backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                      borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                      color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                    }}
                  />
                  {showPasswordErrors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">
                      {preferences.language === 'fr' ? 'Confirmation requise' : 'Confirmation required'}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {saving ? (preferences.language === 'fr' ? 'Modification...' : 'Changing...') : (preferences.language === 'fr' ? 'Changer le mot de passe' : 'Change Password')}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            {/* Langue */}
            <div className="rounded-xl p-6 transition-colors duration-300"
                 style={{ 
                   backgroundColor: preferences.theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)',
                   borderColor: preferences.theme === 'light' ? '#e5e7eb' : '#334155',
                   borderWidth: '1px'
                 }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                {preferences.language === 'fr' ? 'Langue' : 'Language'}
              </h3>
              
              <div>
                <select
                  value={preferences.language}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    setPreferences({ ...preferences, language: newLang });
                    applyLanguage(newLang);
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: preferences.theme === 'light' ? '#ffffff' : '#1e293b',
                    borderColor: preferences.theme === 'light' ? '#d1d5db' : '#475569',
                    color: preferences.theme === 'light' ? '#111827' : '#ffffff'
                  }}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>

            {/* Notifications */}
            <div className="rounded-xl p-6 transition-colors duration-300"
                 style={{ 
                   backgroundColor: preferences.theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)',
                   borderColor: preferences.theme === 'light' ? '#e5e7eb' : '#334155',
                   borderWidth: '1px'
                 }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-400" />
                {preferences.language === 'fr' ? 'Notifications' : 'Notifications'}
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
                       style={{ backgroundColor: preferences.theme === 'light' ? '#f9fafb' : 'rgba(255,255,255,0.05)' }}>
                  <span style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>
                    {preferences.language === 'fr' ? 'Notifications par email' : 'Email Notifications'}
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={preferences.notifications.email}
                      onChange={(e) => {
                        setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, email: e.target.checked }
                        });
                      }}
                      className="sr-only"
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors ${
                      preferences.notifications.email ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                        preferences.notifications.email ? 'translate-x-5' : 'translate-x-1'
                      }`}></div>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
                       style={{ backgroundColor: preferences.theme === 'light' ? '#f9fafb' : 'rgba(255,255,255,0.05)' }}>
                  <span style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>
                    {preferences.language === 'fr' ? 'Notifications par SMS' : 'SMS Notifications'}
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={preferences.notifications.sms}
                      onChange={(e) => {
                        setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, sms: e.target.checked }
                        });
                      }}
                      className="sr-only"
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors ${
                      preferences.notifications.sms ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                        preferences.notifications.sms ? 'translate-x-5' : 'translate-x-1'
                      }`}></div>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
                       style={{ backgroundColor: preferences.theme === 'light' ? '#f9fafb' : 'rgba(255,255,255,0.05)' }}>
                  <span style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>
                    {preferences.language === 'fr' ? 'Notifications push' : 'Push Notifications'}
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={preferences.notifications.push}
                      onChange={(e) => {
                        setPreferences({
                          ...preferences,
                          notifications: { ...preferences.notifications, push: e.target.checked }
                        });
                      }}
                      className="sr-only"
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors ${
                      preferences.notifications.push ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                        preferences.notifications.push ? 'translate-x-5' : 'translate-x-1'
                      }`}></div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Thème */}
            <div className="rounded-xl p-6 transition-colors duration-300"
                 style={{ 
                   backgroundColor: preferences.theme === 'light' ? '#ffffff' : 'rgba(255,255,255,0.05)',
                   borderColor: preferences.theme === 'light' ? '#e5e7eb' : '#334155',
                   borderWidth: '1px'
                 }}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-400" />
                {preferences.language === 'fr' ? 'Thème' : 'Theme'}
              </h3>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setPreferences({ ...preferences, theme: 'light' });
                    applyTheme('light');
                  }}
                  className={`flex-1 p-4 rounded-lg border-2 transition ${
                    preferences.theme === 'light'
                      ? 'border-blue-400 bg-blue-600/20'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: preferences.theme === 'light' ? 'rgba(37,99,235,0.1)' : 'transparent'
                  }}
                >
                  <Sun className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <span style={{ color: preferences.theme === 'light' ? '#111827' : '#ffffff' }}>
                    {preferences.language === 'fr' ? 'Clair' : 'Light'}
                  </span>
                  {preferences.theme === 'light' && (
                    <Check className="w-4 h-4 text-blue-400 mx-auto mt-2" />
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setPreferences({ ...preferences, theme: 'dark' });
                    applyTheme('dark');
                  }}
                  className={`flex-1 p-4 rounded-lg border-2 transition ${
                    preferences.theme === 'dark'
                      ? 'border-blue-400 bg-blue-600/20'
                      : 'border-transparent hover:border-gray-600'
                  }`}
                  style={{ 
                    backgroundColor: preferences.theme === 'dark' ? 'rgba(37,99,235,0.1)' : 'transparent'
                  }}
                >
                  <Moon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <span style={{ color: preferences.theme === 'dark' ? '#ffffff' : '#111827' }}>
                    {preferences.language === 'fr' ? 'Sombre' : 'Dark'}
                  </span>
                  {preferences.theme === 'dark' && (
                    <Check className="w-4 h-4 text-blue-400 mx-auto mt-2" />
                  )}
                </button>
              </div>
            </div>

            {/* Bouton sauvegarder préférences */}
            <div className="flex justify-end">
              <button
                onClick={handleSavePreferences}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? (preferences.language === 'fr' ? 'Sauvegarde...' : 'Saving...') : (preferences.language === 'fr' ? 'Enregistrer les préférences' : 'Save Preferences')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfilePage;
