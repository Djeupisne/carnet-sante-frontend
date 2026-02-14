import React, { useState, useEffect } from 'react';
import { User, Search, Edit, Trash, Eye, X, Check, UserPlus, Filter, ChevronDown, Mail, Phone, Calendar, Award, Activity, AlertCircle } from 'lucide-react';
import { adminService, User as UserType } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';

interface UserManagementProps {
  userType: 'doctor' | 'patient' | 'all';
}

const UserManagement: React.FC<UserManagementProps> = ({ userType }) => {
  const { showNotification } = useNotification();
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: userType === 'all' ? 'patient' : userType,
    phoneNumber: '',
    specialty: '',
    isActive: true,
    dateOfBirth: '',
    gender: '',
    address: '',
    bloodType: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      let filtered = response.data;
      if (userType !== 'all') {
        filtered = filtered.filter(u => u.role === userType);
      }
      setUsers(filtered);
      setFilteredUsers(filtered);
    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error);
      showNotification('Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        u =>
          u.firstName.toLowerCase().includes(term) ||
          u.lastName.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          (u.phoneNumber && u.phoneNumber.toLowerCase().includes(term))
      );
    }
    if (filterStatus === 'active') {
      filtered = filtered.filter(u => u.isActive);
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter(u => !u.isActive);
    }
    setFilteredUsers(filtered);
  };

  const handleCreateUser = async () => {
    try {
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
      }
      const response = await adminService.createUser(formData);
      if (response.success) {
        showNotification('✅ Utilisateur créé avec succès', 'success');
        setIsCreating(false);
        resetForm();
        fetchUsers();
      }
    } catch (error) {
      console.error('Erreur création:', error);
      showNotification('❌ Erreur lors de la création', 'error');
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const response = await adminService.updateUser(selectedUser.id, formData);
      if (response.success) {
        showNotification('✅ Utilisateur mis à jour avec succès', 'success');
        setShowUserModal(false);
        setIsEditing(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      showNotification('❌ Erreur lors de la mise à jour', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      const response = await adminService.deleteUser(userId);
      if (response.success) {
        showNotification('✅ Utilisateur supprimé avec succès', 'success');
        fetchUsers();
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      showNotification('❌ Erreur lors de la suppression', 'error');
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const response = await adminService.toggleUserStatus(userId);
      if (response.success) {
        showNotification(`✅ Utilisateur ${response.data.isActive ? 'activé' : 'désactivé'}`, 'success');
        fetchUsers();
      }
    } catch (error) {
      console.error('Erreur changement statut:', error);
      showNotification('❌ Erreur lors du changement de statut', 'error');
    }
  };

  const handleViewUser = async (user: UserType) => {
    try {
      const response = await adminService.getUserById(user.id);
      setSelectedUser(response.data);
      setFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        password: '',
        role: response.data.role,
        phoneNumber: response.data.phoneNumber || '',
        specialty: response.data.specialty || '',
        isActive: response.data.isActive,
        dateOfBirth: response.data.dateOfBirth || '',
        gender: response.data.gender || '',
        address: response.data.address || '',
        bloodType: response.data.bloodType || ''
      });
      setShowUserModal(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur récupération détails:', error);
      showNotification('❌ Erreur lors du chargement des détails', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: userType === 'all' ? 'patient' : userType,
      phoneNumber: '',
      specialty: '',
      isActive: true,
      dateOfBirth: '',
      gender: '',
      address: '',
      bloodType: ''
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              {userType === 'doctor' ? 'Gestion des médecins' : 
               userType === 'patient' ? 'Gestion des patients' : 
               'Gestion des utilisateurs'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative group">
              <button className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                      filterStatus === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setFilterStatus('active')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                      filterStatus === 'active' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    Actifs
                  </button>
                  <button
                    onClick={() => setFilterStatus('inactive')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                      filterStatus === 'inactive' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    Inactifs
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsCreating(true);
                setShowUserModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Nouvel utilisateur
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Aucun résultat pour votre recherche' : 'Commencez par créer un nouvel utilisateur'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Utilisateur</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Rôle</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Date inscription</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          {user.specialty && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {user.specialty}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {user.email}
                        </p>
                        {user.phoneNumber && (
                          <p className="text-sm text-gray-700 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {user.phoneNumber}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'doctor' ? 'bg-green-100 text-green-700' :
                        user.role === 'patient' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {user.role === 'doctor' ? 'Médecin' :
                         user.role === 'patient' ? 'Patient' : 'Admin'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setFormData({
                              firstName: user.firstName,
                              lastName: user.lastName,
                              email: user.email,
                              password: '',
                              role: user.role,
                              phoneNumber: user.phoneNumber || '',
                              specialty: user.specialty || '',
                              isActive: user.isActive,
                              dateOfBirth: '',
                              gender: '',
                              address: '',
                              bloodType: ''
                            });
                            setIsEditing(true);
                            setShowUserModal(true);
                          }}
                          className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`p-2 rounded-lg transition ${
                            user.isActive 
                              ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          title={user.isActive ? 'Désactiver' : 'Activer'}
                        >
                          {user.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Supprimer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal création/édition */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isCreating ? 'Créer un utilisateur' : isEditing ? 'Modifier l\'utilisateur' : 'Détails de l\'utilisateur'}
                </h2>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setIsEditing(false);
                    setIsCreating(false);
                  }}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing && !isCreating}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                {(isCreating || isEditing) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isCreating ? 'Mot de passe *' : 'Nouveau mot de passe (laisser vide pour ne pas changer)'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Médecin</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {formData.role === 'doctor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                    <input
                      type="text"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      disabled={!isEditing && !isCreating}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Non spécifié</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing && !isCreating}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Groupe sanguin</label>
                  <input
                    type="text"
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    disabled={!isEditing && !isCreating}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                {(isEditing || !isCreating) && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Statut actif:</label>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      formData.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {formData.isActive ? 'Actif' : 'Inactif'}
                    </span>
                    {isEditing && (
                      <button
                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                        className={`ml-2 px-3 py-1 rounded-lg text-xs font-semibold ${
                          formData.isActive 
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {formData.isActive ? 'Désactiver' : 'Activer'}
                      </button>
                    )}
                  </div>
                )}

                {(isEditing || isCreating) && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={isCreating ? handleCreateUser : handleUpdateUser}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105"
                    >
                      {isCreating ? 'Créer' : 'Mettre à jour'}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserModal(false);
                        setIsEditing(false);
                        setIsCreating(false);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
