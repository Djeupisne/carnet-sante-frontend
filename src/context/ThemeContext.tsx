import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Language = 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt';

interface ThemeContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Dictionnaire de traduction
const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'dashboard': 'Tableau de bord',
    'doctors': 'Médecins',
    'patients': 'Patients',
    'appointments': 'Rendez-vous',
    'finances': 'Finances',
    'calendars': 'Calendriers',
    'medicalFile': 'Dossier Médical',
    'profile': 'Mon Profil',
    'logout': 'Déconnexion',
    
    // Actions
    'edit': 'Modifier',
    'save': 'Enregistrer',
    'cancel': 'Annuler',
    'delete': 'Supprimer',
    'confirm': 'Confirmer',
    'search': 'Rechercher',
    'filter': 'Filtres',
    'export': 'Exporter',
    'import': 'Importer',
    'add': 'Ajouter',
    'create': 'Créer',
    'update': 'Mettre à jour',
    'view': 'Voir',
    'details': 'Détails',
    'back': 'Retour',
    
    // Statuts
    'pending': 'En attente',
    'confirmed': 'Confirmé',
    'completed': 'Terminé',
    'cancelled': 'Annulé',
    'no_show': 'Non honoré',
    'active': 'Actif',
    'inactive': 'Inactif',
    'success': 'Succès',
    'error': 'Erreur',
    'warning': 'Attention',
    'info': 'Information',
    
    // Médecins
    'doctor': 'Médecin',
    'specialty': 'Spécialité',
    'licenseNumber': 'Numéro de licence',
    'consultationPrice': 'Prix consultation',
    'available': 'Disponible',
    'notAvailable': 'Non disponible',
    
    // Patients
    'patient': 'Patient',
    'dateOfBirth': 'Date de naissance',
    'gender': 'Sexe',
    'bloodType': 'Groupe sanguin',
    'phoneNumber': 'Téléphone',
    'email': 'Email',
    'address': 'Adresse',
    'emergencyContact': 'Contact d\'urgence',
    
    // Rendez-vous
    'appointmentDate': 'Date du rendez-vous',
    'appointmentTime': 'Heure',
    'duration': 'Durée',
    'reason': 'Motif',
    'type': 'Type',
    'in_person': 'En personne',
    'teleconsultation': 'Téléconsultation',
    'home_visit': 'Visite à domicile',
    
    // Finances
    'totalRevenue': 'Revenus totaux',
    'commission': 'Commission',
    'netRevenue': 'Revenu net',
    'transactions': 'Transactions',
    'paymentMethod': 'Méthode de paiement',
    'paymentStatus': 'Statut du paiement',
    
    // Messages
    'welcome': 'Bienvenue',
    'loading': 'Chargement...',
    'noData': 'Aucune donnée disponible',
    'confirmDelete': 'Êtes-vous sûr de vouloir supprimer ?',
    'operationSuccessful': 'Opération réussie',
    'operationFailed': 'Opération échouée',
    
    // Profil
    'personalInfo': 'Informations personnelles',
    'security': 'Sécurité',
    'preferences': 'Préférences',
    'changePassword': 'Changer le mot de passe',
    'currentPassword': 'Mot de passe actuel',
    'newPassword': 'Nouveau mot de passe',
    'confirmPassword': 'Confirmer le mot de passe',
    'language': 'Langue',
    'theme': 'Thème',
    'light': 'Clair',
    'dark': 'Sombre',
    'notifications': 'Notifications',
    'emailNotifications': 'Notifications par email',
    'smsNotifications': 'Notifications par SMS',
    'pushNotifications': 'Notifications push',
    
    // Jours et mois
    'monday': 'Lundi',
    'tuesday': 'Mardi',
    'wednesday': 'Mercredi',
    'thursday': 'Jeudi',
    'friday': 'Vendredi',
    'saturday': 'Samedi',
    'sunday': 'Dimanche',
    'january': 'Janvier',
    'february': 'Février',
    'march': 'Mars',
    'april': 'Avril',
    'may': 'Mai',
    'june': 'Juin',
    'july': 'Juillet',
    'august': 'Août',
    'september': 'Septembre',
    'october': 'Octobre',
    'november': 'Novembre',
    'december': 'Décembre',
  },
  en: {
    // Navigation
    'dashboard': 'Dashboard',
    'doctors': 'Doctors',
    'patients': 'Patients',
    'appointments': 'Appointments',
    'finances': 'Finances',
    'calendars': 'Calendars',
    'medicalFile': 'Medical File',
    'profile': 'My Profile',
    'logout': 'Logout',
    
    // Actions
    'edit': 'Edit',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'confirm': 'Confirm',
    'search': 'Search',
    'filter': 'Filters',
    'export': 'Export',
    'import': 'Import',
    'add': 'Add',
    'create': 'Create',
    'update': 'Update',
    'view': 'View',
    'details': 'Details',
    'back': 'Back',
    
    // Status
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'no_show': 'No show',
    'active': 'Active',
    'inactive': 'Inactive',
    'success': 'Success',
    'error': 'Error',
    'warning': 'Warning',
    'info': 'Info',
    
    // Doctors
    'doctor': 'Doctor',
    'specialty': 'Specialty',
    'licenseNumber': 'License number',
    'consultationPrice': 'Consultation price',
    'available': 'Available',
    'notAvailable': 'Not available',
    
    // Patients
    'patient': 'Patient',
    'dateOfBirth': 'Date of birth',
    'gender': 'Gender',
    'bloodType': 'Blood type',
    'phoneNumber': 'Phone number',
    'email': 'Email',
    'address': 'Address',
    'emergencyContact': 'Emergency contact',
    
    // Appointments
    'appointmentDate': 'Appointment date',
    'appointmentTime': 'Time',
    'duration': 'Duration',
    'reason': 'Reason',
    'type': 'Type',
    'in_person': 'In person',
    'teleconsultation': 'Teleconsultation',
    'home_visit': 'Home visit',
    
    // Finances
    'totalRevenue': 'Total revenue',
    'commission': 'Commission',
    'netRevenue': 'Net revenue',
    'transactions': 'Transactions',
    'paymentMethod': 'Payment method',
    'paymentStatus': 'Payment status',
    
    // Messages
    'welcome': 'Welcome',
    'loading': 'Loading...',
    'noData': 'No data available',
    'confirmDelete': 'Are you sure you want to delete?',
    'operationSuccessful': 'Operation successful',
    'operationFailed': 'Operation failed',
    
    // Profile
    'personalInfo': 'Personal information',
    'security': 'Security',
    'preferences': 'Preferences',
    'changePassword': 'Change password',
    'currentPassword': 'Current password',
    'newPassword': 'New password',
    'confirmPassword': 'Confirm password',
    'language': 'Language',
    'theme': 'Theme',
    'light': 'Light',
    'dark': 'Dark',
    'notifications': 'Notifications',
    'emailNotifications': 'Email notifications',
    'smsNotifications': 'SMS notifications',
    'pushNotifications': 'Push notifications',
    
    // Days and months
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday',
    'january': 'January',
    'february': 'February',
    'march': 'March',
    'april': 'April',
    'may': 'May',
    'june': 'June',
    'july': 'July',
    'august': 'August',
    'september': 'September',
    'october': 'October',
    'november': 'November',
    'december': 'December',
  },
  es: {
    // Navigation
    'dashboard': 'Panel',
    'doctors': 'Médicos',
    'patients': 'Pacientes',
    'appointments': 'Citas',
    'finances': 'Finanzas',
    'calendars': 'Calendarios',
    'medicalFile': 'Historial médico',
    'profile': 'Mi perfil',
    'logout': 'Cerrar sesión',
    
    // Actions
    'edit': 'Editar',
    'save': 'Guardar',
    'cancel': 'Cancelar',
    'delete': 'Eliminar',
    'confirm': 'Confirmar',
    'search': 'Buscar',
    'filter': 'Filtros',
    'export': 'Exportar',
    'import': 'Importar',
    'add': 'Añadir',
    'create': 'Crear',
    'update': 'Actualizar',
    'view': 'Ver',
    'details': 'Detalles',
    'back': 'Volver',
    
    // Status
    'pending': 'Pendiente',
    'confirmed': 'Confirmado',
    'completed': 'Completado',
    'cancelled': 'Cancelado',
    'no_show': 'No presentado',
    'active': 'Activo',
    'inactive': 'Inactivo',
    'success': 'Éxito',
    'error': 'Error',
    'warning': 'Advertencia',
    'info': 'Información',
    
    // Doctors
    'doctor': 'Médico',
    'specialty': 'Especialidad',
    'licenseNumber': 'Número de licencia',
    'consultationPrice': 'Precio consulta',
    'available': 'Disponible',
    'notAvailable': 'No disponible',
    
    // Patients
    'patient': 'Paciente',
    'dateOfBirth': 'Fecha de nacimiento',
    'gender': 'Sexo',
    'bloodType': 'Grupo sanguíneo',
    'phoneNumber': 'Teléfono',
    'email': 'Email',
    'address': 'Dirección',
    'emergencyContact': 'Contacto de emergencia',
    
    // Appointments
    'appointmentDate': 'Fecha de cita',
    'appointmentTime': 'Hora',
    'duration': 'Duración',
    'reason': 'Motivo',
    'type': 'Tipo',
    'in_person': 'Presencial',
    'teleconsultation': 'Teleconsulta',
    'home_visit': 'Visita domiciliaria',
    
    // Finances
    'totalRevenue': 'Ingresos totales',
    'commission': 'Comisión',
    'netRevenue': 'Ingresos netos',
    'transactions': 'Transacciones',
    'paymentMethod': 'Método de pago',
    'paymentStatus': 'Estado del pago',
    
    // Messages
    'welcome': 'Bienvenido',
    'loading': 'Cargando...',
    'noData': 'No hay datos disponibles',
    'confirmDelete': '¿Estás seguro de que quieres eliminar?',
    'operationSuccessful': 'Operación exitosa',
    'operationFailed': 'Operación fallida',
    
    // Profile
    'personalInfo': 'Información personal',
    'security': 'Seguridad',
    'preferences': 'Preferencias',
    'changePassword': 'Cambiar contraseña',
    'currentPassword': 'Contraseña actual',
    'newPassword': 'Nueva contraseña',
    'confirmPassword': 'Confirmar contraseña',
    'language': 'Idioma',
    'theme': 'Tema',
    'light': 'Claro',
    'dark': 'Oscuro',
    'notifications': 'Notificaciones',
    'emailNotifications': 'Notificaciones por email',
    'smsNotifications': 'Notificaciones por SMS',
    'pushNotifications': 'Notificaciones push',
  },
  de: {
    // Navigation
    'dashboard': 'Dashboard',
    'doctors': 'Ärzte',
    'patients': 'Patienten',
    'appointments': 'Termine',
    'finances': 'Finanzen',
    'calendars': 'Kalender',
    'medicalFile': 'Krankenakte',
    'profile': 'Mein Profil',
    'logout': 'Abmelden',
    
    // Actions
    'edit': 'Bearbeiten',
    'save': 'Speichern',
    'cancel': 'Abbrechen',
    'delete': 'Löschen',
    'confirm': 'Bestätigen',
    'search': 'Suchen',
    'filter': 'Filter',
    'export': 'Exportieren',
    'import': 'Importieren',
    'add': 'Hinzufügen',
    'create': 'Erstellen',
    'update': 'Aktualisieren',
    'view': 'Ansehen',
    'details': 'Details',
    'back': 'Zurück',
    
    // Status
    'pending': 'Ausstehend',
    'confirmed': 'Bestätigt',
    'completed': 'Abgeschlossen',
    'cancelled': 'Storniert',
    'no_show': 'Nicht erschienen',
    'active': 'Aktiv',
    'inactive': 'Inaktiv',
    'success': 'Erfolg',
    'error': 'Fehler',
    'warning': 'Warnung',
    'info': 'Info',
    
    // Doctors
    'doctor': 'Arzt',
    'specialty': 'Fachgebiet',
    'licenseNumber': 'Lizenznummer',
    'consultationPrice': 'Konsultationspreis',
    'available': 'Verfügbar',
    'notAvailable': 'Nicht verfügbar',
    
    // Patients
    'patient': 'Patient',
    'dateOfBirth': 'Geburtsdatum',
    'gender': 'Geschlecht',
    'bloodType': 'Blutgruppe',
    'phoneNumber': 'Telefonnummer',
    'email': 'Email',
    'address': 'Adresse',
    'emergencyContact': 'Notfallkontakt',
    
    // Appointments
    'appointmentDate': 'Termindatum',
    'appointmentTime': 'Uhrzeit',
    'duration': 'Dauer',
    'reason': 'Grund',
    'type': 'Typ',
    'in_person': 'Persönlich',
    'teleconsultation': 'Telemedizin',
    'home_visit': 'Hausbesuch',
    
    // Finances
    'totalRevenue': 'Gesamteinnahmen',
    'commission': 'Provision',
    'netRevenue': 'Nettoeinnahmen',
    'transactions': 'Transaktionen',
    'paymentMethod': 'Zahlungsmethode',
    'paymentStatus': 'Zahlungsstatus',
    
    // Messages
    'welcome': 'Willkommen',
    'loading': 'Laden...',
    'noData': 'Keine Daten verfügbar',
    'confirmDelete': 'Sind Sie sicher, dass Sie löschen möchten?',
    'operationSuccessful': 'Vorgang erfolgreich',
    'operationFailed': 'Vorgang fehlgeschlagen',
    
    // Profile
    'personalInfo': 'Persönliche Informationen',
    'security': 'Sicherheit',
    'preferences': 'Einstellungen',
    'changePassword': 'Passwort ändern',
    'currentPassword': 'Aktuelles Passwort',
    'newPassword': 'Neues Passwort',
    'confirmPassword': 'Passwort bestätigen',
    'language': 'Sprache',
    'theme': 'Thema',
    'light': 'Hell',
    'dark': 'Dunkel',
    'notifications': 'Benachrichtigungen',
    'emailNotifications': 'E-Mail-Benachrichtigungen',
    'smsNotifications': 'SMS-Benachrichtigungen',
    'pushNotifications': 'Push-Benachrichtigungen',
  },
  it: {
    // Navigation
    'dashboard': 'Dashboard',
    'doctors': 'Medici',
    'patients': 'Pazienti',
    'appointments': 'Appuntamenti',
    'finances': 'Finanze',
    'calendars': 'Calendari',
    'medicalFile': 'Cartella clinica',
    'profile': 'Il mio profilo',
    'logout': 'Disconnetti',
    
    // Actions
    'edit': 'Modifica',
    'save': 'Salva',
    'cancel': 'Annulla',
    'delete': 'Elimina',
    'confirm': 'Conferma',
    'search': 'Cerca',
    'filter': 'Filtri',
    'export': 'Esporta',
    'import': 'Importa',
    'add': 'Aggiungi',
    'create': 'Crea',
    'update': 'Aggiorna',
    'view': 'Visualizza',
    'details': 'Dettagli',
    'back': 'Indietro',
    
    // Status
    'pending': 'In attesa',
    'confirmed': 'Confermato',
    'completed': 'Completato',
    'cancelled': 'Annullato',
    'no_show': 'Non presentato',
    'active': 'Attivo',
    'inactive': 'Inattivo',
    'success': 'Successo',
    'error': 'Errore',
    'warning': 'Attenzione',
    'info': 'Informazione',
    
    // Doctors
    'doctor': 'Medico',
    'specialty': 'Specialità',
    'licenseNumber': 'Numero di licenza',
    'consultationPrice': 'Prezzo consulenza',
    'available': 'Disponibile',
    'notAvailable': 'Non disponibile',
    
    // Patients
    'patient': 'Paziente',
    'dateOfBirth': 'Data di nascita',
    'gender': 'Sesso',
    'bloodType': 'Gruppo sanguigno',
    'phoneNumber': 'Telefono',
    'email': 'Email',
    'address': 'Indirizzo',
    'emergencyContact': 'Contatto di emergenza',
    
    // Appointments
    'appointmentDate': 'Data appuntamento',
    'appointmentTime': 'Ora',
    'duration': 'Durata',
    'reason': 'Motivo',
    'type': 'Tipo',
    'in_person': 'In presenza',
    'teleconsultation': 'Teleconsulenza',
    'home_visit': 'Visita domiciliare',
    
    // Finances
    'totalRevenue': 'Entrate totali',
    'commission': 'Commissione',
    'netRevenue': 'Entrate nette',
    'transactions': 'Transazioni',
    'paymentMethod': 'Metodo di pagamento',
    'paymentStatus': 'Stato pagamento',
    
    // Messages
    'welcome': 'Benvenuto',
    'loading': 'Caricamento...',
    'noData': 'Nessun dato disponibile',
    'confirmDelete': 'Sei sicuro di voler eliminare?',
    'operationSuccessful': 'Operazione riuscita',
    'operationFailed': 'Operazione fallita',
    
    // Profile
    'personalInfo': 'Informazioni personali',
    'security': 'Sicurezza',
    'preferences': 'Preferenze',
    'changePassword': 'Cambia password',
    'currentPassword': 'Password attuale',
    'newPassword': 'Nuova password',
    'confirmPassword': 'Conferma password',
    'language': 'Lingua',
    'theme': 'Tema',
    'light': 'Chiaro',
    'dark': 'Scuro',
    'notifications': 'Notifiche',
    'emailNotifications': 'Notifiche email',
    'smsNotifications': 'Notifiche SMS',
    'pushNotifications': 'Notifiche push',
  },
  pt: {
    // Navigation
    'dashboard': 'Painel',
    'doctors': 'Médicos',
    'patients': 'Pacientes',
    'appointments': 'Consultas',
    'finances': 'Finanças',
    'calendars': 'Calendários',
    'medicalFile': 'Prontuário',
    'profile': 'Meu perfil',
    'logout': 'Sair',
    
    // Actions
    'edit': 'Editar',
    'save': 'Salvar',
    'cancel': 'Cancelar',
    'delete': 'Excluir',
    'confirm': 'Confirmar',
    'search': 'Pesquisar',
    'filter': 'Filtros',
    'export': 'Exportar',
    'import': 'Importar',
    'add': 'Adicionar',
    'create': 'Criar',
    'update': 'Atualizar',
    'view': 'Visualizar',
    'details': 'Detalhes',
    'back': 'Voltar',
    
    // Status
    'pending': 'Pendente',
    'confirmed': 'Confirmado',
    'completed': 'Concluído',
    'cancelled': 'Cancelado',
    'no_show': 'Não compareceu',
    'active': 'Ativo',
    'inactive': 'Inativo',
    'success': 'Sucesso',
    'error': 'Erro',
    'warning': 'Aviso',
    'info': 'Informação',
    
    // Doctors
    'doctor': 'Médico',
    'specialty': 'Especialidade',
    'licenseNumber': 'Número de licença',
    'consultationPrice': 'Preço da consulta',
    'available': 'Disponível',
    'notAvailable': 'Indisponível',
    
    // Patients
    'patient': 'Paciente',
    'dateOfBirth': 'Data de nascimento',
    'gender': 'Sexo',
    'bloodType': 'Tipo sanguíneo',
    'phoneNumber': 'Telefone',
    'email': 'Email',
    'address': 'Endereço',
    'emergencyContact': 'Contato de emergência',
    
    // Appointments
    'appointmentDate': 'Data da consulta',
    'appointmentTime': 'Hora',
    'duration': 'Duração',
    'reason': 'Motivo',
    'type': 'Tipo',
    'in_person': 'Presencial',
    'teleconsultation': 'Teleconsulta',
    'home_visit': 'Visita domiciliar',
    
    // Finances
    'totalRevenue': 'Receita total',
    'commission': 'Comissão',
    'netRevenue': 'Receita líquida',
    'transactions': 'Transações',
    'paymentMethod': 'Método de pagamento',
    'paymentStatus': 'Status do pagamento',
    
    // Messages
    'welcome': 'Bem-vindo',
    'loading': 'Carregando...',
    'noData': 'Nenhum dado disponível',
    'confirmDelete': 'Tem certeza que deseja excluir?',
    'operationSuccessful': 'Operação bem-sucedida',
    'operationFailed': 'Operação falhou',
    
    // Profile
    'personalInfo': 'Informações pessoais',
    'security': 'Segurança',
    'preferences': 'Preferências',
    'changePassword': 'Alterar senha',
    'currentPassword': 'Senha atual',
    'newPassword': 'Nova senha',
    'confirmPassword': 'Confirmar senha',
    'language': 'Idioma',
    'theme': 'Tema',
    'light': 'Claro',
    'dark': 'Escuro',
    'notifications': 'Notificações',
    'emailNotifications': 'Notificações por email',
    'smsNotifications': 'Notificações por SMS',
    'pushNotifications': 'Notificações push',
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    // Charger les préférences depuis le localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedLanguage = localStorage.getItem('language') as Language | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Appliquer le thème
    const root = document.documentElement;
    
    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#f9fafb');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#6b7280');
      root.style.setProperty('--border-color', '#e5e7eb');
      root.style.setProperty('--hover-bg', '#f3f4f6');
      
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.className = 'bg-gray-50';
    } else {
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--bg-card', '#1e293b');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#94a3b8');
      root.style.setProperty('--border-color', '#334155');
      root.style.setProperty('--hover-bg', '#2d3748');
      
      root.classList.remove('light');
      root.classList.add('dark');
      document.body.className = 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900';
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Appliquer la langue
    localStorage.setItem('language', language);
    
    // Changer la direction du texte si nécessaire
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <ThemeContext.Provider value={{ theme, language, setTheme, setLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
