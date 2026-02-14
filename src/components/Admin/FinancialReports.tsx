import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Search,
  Users,
  Calendar as CalendarIcon,
  CreditCard,
  PieChart,
  BarChart3,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Percent,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  FileText,
  Printer,
  Mail,
  RefreshCw,
  Eye,
  ChevronRight,
  User,
  Stethoscope
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';

// Données de test
const MOCK_DOCTOR_STATS = [
  {
    doctorId: '1',
    doctorName: 'Dr. Jean Dupont',
    specialty: 'Cardiologie',
    totalRevenue: 4500,
    commission: 450,
    netRevenue: 4050,
    totalAppointments: 15,
    completedAppointments: 12,
    averagePerAppointment: 375
  },
  {
    doctorId: '2',
    doctorName: 'Dr. Marie Martin',
    specialty: 'Dermatologie',
    totalRevenue: 3800,
    commission: 380,
    netRevenue: 3420,
    totalAppointments: 10,
    completedAppointments: 8,
    averagePerAppointment: 475
  }
];

const MOCK_PAYMENTS = [
  {
    id: 'pay1',
    amount: 150,
    currency: 'EUR',
    status: 'completed',
    paymentMethod: 'Carte bancaire',
    transactionId: 'TR-ABC123',
    createdAt: new Date().toISOString(),
    appointment: {
      id: 'apt1',
      appointmentDate: new Date().toISOString(),
      doctor: {
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        specialty: 'Cardiologie'
      },
      patient: {
        id: 'pat1',
        firstName: 'Pierre',
        lastName: 'Durand'
      }
    }
  },
  {
    id: 'pay2',
    amount: 200,
    currency: 'EUR',
    status: 'completed',
    paymentMethod: 'PayPal',
    transactionId: 'TR-DEF456',
    createdAt: new Date().toISOString(),
    appointment: {
      id: 'apt2',
      appointmentDate: new Date().toISOString(),
      doctor: {
        id: '2',
        firstName: 'Marie',
        lastName: 'Martin',
        specialty: 'Dermatologie'
      },
      patient: {
        id: 'pat2',
        firstName: 'Sophie',
        lastName: 'Leroy'
      }
    }
  },
  {
    id: 'pay3',
    amount: 180,
    currency: 'EUR',
    status: 'pending',
    paymentMethod: 'Virement',
    transactionId: 'TR-GHI789',
    createdAt: new Date().toISOString(),
    appointment: {
      id: 'apt3',
      appointmentDate: new Date().toISOString(),
      doctor: {
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        specialty: 'Cardiologie'
      },
      patient: {
        id: 'pat3',
        firstName: 'Paul',
        lastName: 'Martin'
      }
    }
  }
];

const FinancialReports: React.FC = () => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [doctorStats, setDoctorStats] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionStats, setTransactionStats] = useState({
    totalAmount: 0,
    averageAmount: 0,
    count: 0,
    byStatus: {
      pending: 0,
      completed: 0,
      failed: 0,
      refunded: 0
    },
    byPaymentMethod: {} as Record<string, number>,
    topDoctorsByAppointments: [] as Array<{
      name: string;
      specialty: string;
      appointmentCount: number;
      revenue: number;
    }>
  });
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalCommission: 0,
    netRevenue: 0,
    totalTransactions: 0,
    averageTransaction: 0,
    pendingPayments: 0,
    completedPayments: 0
  });

  useEffect(() => {
    // Utiliser les données de test pour vérifier l'affichage
    setTimeout(() => {
      setDoctorStats(MOCK_DOCTOR_STATS);
      setPayments(MOCK_PAYMENTS);
      setFilteredPayments(MOCK_PAYMENTS);
      setLoading(false);
      
      // Calculer les statistiques
      calculateAllStats(MOCK_PAYMENTS, MOCK_DOCTOR_STATS);
    }, 1000);
  }, []);

  const calculateAllStats = (paymentsData: any[], doctorsData: any[]) => {
    // Calculer le résumé
    const totalRevenue = paymentsData.reduce((sum, p) => sum + p.amount, 0);
    const totalCommission = totalRevenue * 0.1;
    const completedPayments = paymentsData
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = paymentsData
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    setSummary({
      totalRevenue,
      totalCommission,
      netRevenue: totalRevenue - totalCommission,
      totalTransactions: paymentsData.length,
      averageTransaction: paymentsData.length ? totalRevenue / paymentsData.length : 0,
      pendingPayments,
      completedPayments
    });

    // Calculer les statistiques par statut
    const byStatus = {
      pending: paymentsData.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
      completed: paymentsData.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
      failed: 0,
      refunded: 0
    };

    // Calculer les méthodes de paiement (uniquement complétés)
    const byPaymentMethod: Record<string, number> = {};
    paymentsData
      .filter(p => p.status === 'completed')
      .forEach(p => {
        const method = p.paymentMethod;
        byPaymentMethod[method] = (byPaymentMethod[method] || 0) + p.amount;
      });

    // Calculer les top médecins par nombre de rendez-vous confirmés
    const doctorMap = new Map();
    paymentsData
      .filter(p => p.status === 'completed' && p.appointment?.doctor)
      .forEach(p => {
        const doctorId = p.appointment.doctor.id;
        const doctorName = `Dr. ${p.appointment.doctor.firstName} ${p.appointment.doctor.lastName}`;
        const specialty = p.appointment.doctor.specialty;
        
        const current = doctorMap.get(doctorId) || {
          name: doctorName,
          specialty,
          appointmentCount: 0,
          revenue: 0
        };
        
        doctorMap.set(doctorId, {
          name: doctorName,
          specialty,
          appointmentCount: current.appointmentCount + 1,
          revenue: current.revenue + p.amount
        });
      });

    const topDoctorsByAppointments = Array.from(doctorMap.values())
      .sort((a, b) => b.appointmentCount - a.appointmentCount)
      .slice(0, 5);

    setTransactionStats({
      totalAmount: totalRevenue,
      averageAmount: paymentsData.length ? totalRevenue / paymentsData.length : 0,
      count: paymentsData.length,
      byStatus,
      byPaymentMethod,
      topDoctorsByAppointments
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock, label: 'En attente' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle, label: 'Complété' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: XCircle, label: 'Échoué' },
      refunded: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: ArrowUpRight, label: 'Remboursé' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border} shadow-sm`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Rapports financiers
            </h2>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {payments.length} transactions trouvées
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher transaction, médecin, patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Bouton Filtre */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all hover:shadow-lg flex items-center gap-2 shadow-md"
            >
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filtres</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showFilterMenu ? 'rotate-180' : ''}`} />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-slide-down">
                <div className="p-5 space-y-6">
                  {/* Période */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      Période
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'all', label: 'Toutes' },
                        { value: 'today', label: 'Aujourd\'hui' },
                        { value: 'week', label: '7 jours' },
                        { value: 'month', label: '30 jours' },
                        { value: 'year', label: 'Cette année' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setDateRange(option.value as any);
                            setShowFilterMenu(false);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm transition ${
                            dateRange === option.value
                              ? 'bg-green-100 text-green-700 border border-green-200 font-medium'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Statut */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      Statut
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'all', label: 'Tous' },
                        { value: 'pending', label: 'En attente' },
                        { value: 'completed', label: 'Complétés' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setStatusFilter(option.value);
                            setShowFilterMenu(false);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm transition ${
                            statusFilter === option.value
                              ? 'bg-green-100 text-green-700 border border-green-200 font-medium'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
          <p className="text-sm text-gray-500">Revenus totaux</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Percent className="w-5 h-5 text-purple-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalCommission)}</p>
          <p className="text-sm text-gray-500">Commission (10%)</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
            <ArrowDownRight className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.netRevenue)}</p>
          <p className="text-sm text-gray-500">Revenu net</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-orange-600" />
            </div>
            <PieChart className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{summary.totalTransactions}</p>
          <p className="text-sm text-gray-500">Transactions</p>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Répartition par statut */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            Répartition par statut
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  En attente
                </span>
                <span className="font-medium text-gray-900">{formatCurrency(transactionStats.byStatus.pending)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" 
                     style={{ width: `${transactionStats.totalAmount ? (transactionStats.byStatus.pending / transactionStats.totalAmount) * 100 : 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Complétés
                </span>
                <span className="font-medium text-gray-900">{formatCurrency(transactionStats.byStatus.completed)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" 
                     style={{ width: `${transactionStats.totalAmount ? (transactionStats.byStatus.completed / transactionStats.totalAmount) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Méthodes de paiement */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Méthodes de paiement
          </h3>
          <div className="space-y-4">
            {Object.keys(transactionStats.byPaymentMethod).length > 0 ? (
              Object.entries(transactionStats.byPaymentMethod).map(([method, amount]) => (
                <div key={method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{method}</span>
                    <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" 
                         style={{ width: `${transactionStats.totalAmount ? (amount / transactionStats.totalAmount) * 100 : 0}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun paiement complété</p>
            )}
          </div>
        </div>

        {/* Top médecins */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Top médecins (par rendez-vous)
          </h3>
          <div className="space-y-4">
            {transactionStats.topDoctorsByAppointments.length > 0 ? (
              transactionStats.topDoctorsByAppointments.map((doctor, index) => (
                <div key={doctor.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{doctor.name}</p>
                      <p className="text-xs text-gray-500">{doctor.specialty}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">
                        {doctor.appointmentCount} rendez-vous confirmés
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(doctor.revenue)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun rendez-vous confirmé</p>
            )}
          </div>
        </div>
      </div>

      {/* Liste des médecins */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Statistiques par médecin
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Chargement des données...</p>
          </div>
        ) : doctorStats.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune donnée disponible</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Médecin</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Spécialité</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Consultations</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenu brut</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Commission</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenu net</th>
                </tr>
              </thead>
              <tbody>
                {doctorStats.map((doctor) => (
                  <tr key={doctor.doctorId} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium text-gray-900">{doctor.doctorName}</td>
                    <td className="py-3 px-4 text-gray-600">{doctor.specialty}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-medium text-gray-900">{doctor.completedAppointments}</span>
                      <span className="text-xs text-gray-500 ml-1">/ {doctor.totalAppointments}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(doctor.totalRevenue)}</td>
                    <td className="py-3 px-4 text-right text-purple-600 font-medium">{formatCurrency(doctor.commission)}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-medium">{formatCurrency(doctor.netRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialReports;
