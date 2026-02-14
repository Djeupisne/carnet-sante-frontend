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
  Eye
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';

interface FinancialSummary {
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  pendingPayments: number;
  completedPayments: number;
}

interface DoctorFinancialStat {
  doctorId: string;
  doctorName: string;
  specialty: string;
  totalRevenue: number;
  commission: number;
  netRevenue: number;
  totalAppointments: number;
  completedAppointments: number;
  averagePerAppointment: number;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  appointment?: {
    id: string;
    appointmentDate: string;
    doctor?: {
      id: string;
      firstName: string;
      lastName: string;
    };
    patient?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

const FinancialReports: React.FC = () => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalRevenue: 0,
    totalCommission: 0,
    netRevenue: 0,
    totalTransactions: 0,
    averageTransaction: 0,
    pendingPayments: 0,
    completedPayments: 0
  });
  const [doctorStats, setDoctorStats] = useState<DoctorFinancialStat[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'overview' | 'doctors' | 'transactions'>('overview');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    fetchFinancialData();
  }, [dateRange, customStartDate, customEndDate]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, statusFilter, selectedDoctor]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les statistiques financières globales
      const statsResponse = await adminService.getFinancialReports();
      if (statsResponse.success) {
        setSummary(statsResponse.data.summary);
        setDoctorStats(statsResponse.data.byDoctor || []);
        setTransactions(statsResponse.data.payments || []);
        setFilteredTransactions(statsResponse.data.payments || []);
      }

    } catch (error) {
      console.error('❌ Erreur récupération données financières:', error);
      showNotification('Erreur lors du chargement des données financières', 'error');
      
      // Données de démonstration
      const mockSummary = {
        totalRevenue: 15750,
        totalCommission: 1575,
        netRevenue: 14175,
        totalTransactions: 45,
        averageTransaction: 350,
        pendingPayments: 1250,
        completedPayments: 14500
      };
      setSummary(mockSummary);
      
      const mockDoctorStats = [
        { doctorId: '1', doctorName: 'Dr. Jean Dupont', specialty: 'Cardiologie', totalRevenue: 4500, commission: 450, netRevenue: 4050, totalAppointments: 12, completedAppointments: 10, averagePerAppointment: 375 },
        { doctorId: '2', doctorName: 'Dr. Marie Martin', specialty: 'Dermatologie', totalRevenue: 3800, commission: 380, netRevenue: 3420, totalAppointments: 9, completedAppointments: 8, averagePerAppointment: 422 },
        { doctorId: '3', doctorName: 'Dr. Pierre Dubois', specialty: 'Gynécologie', totalRevenue: 5200, commission: 520, netRevenue: 4680, totalAppointments: 14, completedAppointments: 12, averagePerAppointment: 371 },
        { doctorId: '4', doctorName: 'Dr. Sophie Bernard', specialty: 'Pédiatrie', totalRevenue: 2250, commission: 225, netRevenue: 2025, totalAppointments: 10, completedAppointments: 8, averagePerAppointment: 225 }
      ];
      setDoctorStats(mockDoctorStats);
      
      const mockTransactions = generateMockTransactions();
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTransactions = () => {
    const statuses: Array<'pending' | 'completed' | 'failed' | 'refunded'> = ['pending', 'completed', 'failed', 'refunded'];
    const methods = ['Carte bancaire', 'PayPal', 'Virement', 'Espèces'];
    const doctors = [
      { id: '1', firstName: 'Jean', lastName: 'Dupont' },
      { id: '2', firstName: 'Marie', lastName: 'Martin' },
      { id: '3', firstName: 'Pierre', lastName: 'Dubois' },
      { id: '4', firstName: 'Sophie', lastName: 'Bernard' }
    ];
    const patients = [
      { id: 'p1', firstName: 'Paul', lastName: 'Durand' },
      { id: 'p2', firstName: 'Julie', lastName: 'Leroy' },
      { id: 'p3', firstName: 'Thomas', lastName: 'Petit' },
      { id: 'p4', firstName: 'Emma', lastName: 'Moreau' }
    ];

    return Array.from({ length: 50 }, (_, i) => {
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const amount = Math.floor(Math.random() * 300) + 50;
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));
      
      return {
        id: `tx-${i + 1}`,
        amount,
        currency: 'EUR',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        paymentMethod: methods[Math.floor(Math.random() * methods.length)],
        transactionId: `TR-${Date.now().toString(36)}-${i}`,
        createdAt: date.toISOString(),
        appointment: {
          id: `apt-${i + 1}`,
          appointmentDate: date.toISOString(),
          doctor,
          patient
        }
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.transactionId.toLowerCase().includes(term) ||
          t.appointment?.doctor?.firstName.toLowerCase().includes(term) ||
          t.appointment?.doctor?.lastName.toLowerCase().includes(term) ||
          t.appointment?.patient?.firstName.toLowerCase().includes(term) ||
          t.appointment?.patient?.lastName.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (selectedDoctor !== 'all') {
      filtered = filtered.filter(t => t.appointment?.doctor?.id === selectedDoctor);
    }

    setFilteredTransactions(filtered);
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

  const exportToCSV = () => {
    try {
      const headers = ['Date', 'Transaction ID', 'Médecin', 'Patient', 'Montant', 'Statut', 'Méthode'];
      const rows = filteredTransactions.map(t => [
        formatDate(t.createdAt),
        t.transactionId,
        `${t.appointment?.doctor?.firstName} ${t.appointment?.doctor?.lastName}`,
        `${t.appointment?.patient?.firstName} ${t.appointment?.patient?.lastName}`,
        t.amount,
        t.status,
        t.paymentMethod
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `rapport_financier_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('✅ Rapport exporté avec succès', 'success');
    } catch (error) {
      console.error('❌ Erreur export:', error);
      showNotification('❌ Erreur lors de l\'export', 'error');
    }
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
              Aperçu complet des performances financières
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Sélecteur de période */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm appearance-none pr-10"
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
              <option value="custom">Personnalisé</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Bouton export */}
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Période personnalisée */}
      {dateRange === 'custom' && (
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Du</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Au</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={fetchFinancialData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Appliquer
          </button>
        </div>
      )}

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

      {/* Onglets de navigation */}
      <div className="border-b border-gray-200 bg-white rounded-t-xl">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setViewMode('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition ${
              viewMode === 'overview'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Aperçu
          </button>
          <button
            onClick={() => setViewMode('doctors')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition ${
              viewMode === 'doctors'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4" />
            Par médecin
          </button>
          <button
            onClick={() => setViewMode('transactions')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition ${
              viewMode === 'transactions'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Transactions
          </button>
        </nav>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="text-center py-16">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Chargement des données financières...</p>
        </div>
      ) : viewMode === 'overview' ? (
        <div className="space-y-6">
          {/* Graphiques et statistiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition des revenus */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-green-600" />
                Répartition des revenus
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commission</span>
                  <span className="font-semibold text-purple-600">{formatCurrency(summary.totalCommission)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${(summary.totalCommission / summary.totalRevenue) * 100}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenu net</span>
                  <span className="font-semibold text-green-600">{formatCurrency(summary.netRevenue)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(summary.netRevenue / summary.totalRevenue) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Statistiques des paiements */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-600" />
                Statut des paiements
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Terminés
                  </span>
                  <span className="font-bold text-green-600">{formatCurrency(summary.completedPayments)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    En attente
                  </span>
                  <span className="font-bold text-yellow-600">{formatCurrency(summary.pendingPayments)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    Moyenne transaction
                  </span>
                  <span className="font-bold text-blue-600">{formatCurrency(summary.averageTransaction)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top médecins */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Top médecins par revenus
            </h3>
            <div className="space-y-4">
              {doctorStats
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .slice(0, 5)
                .map((doctor, index) => (
                  <div key={doctor.doctorId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
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
                        <p className="font-medium text-gray-900">{doctor.doctorName}</p>
                        <p className="text-sm text-gray-500">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(doctor.totalRevenue)}</p>
                      <p className="text-xs text-gray-500">{doctor.completedAppointments}/{doctor.totalAppointments} consultations</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : viewMode === 'doctors' ? (
        /* Tableau des médecins */
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Médecin</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Spécialité</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Consultations</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Revenu brut</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Commission</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Revenu net</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Moyenne</th>
                </tr>
              </thead>
              <tbody>
                {doctorStats.map((doctor) => (
                  <tr key={doctor.doctorId} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{doctor.doctorName}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{doctor.specialty}</td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-medium text-gray-900">{doctor.completedAppointments}</span>
                      <span className="text-xs text-gray-500 ml-1">/ {doctor.totalAppointments}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-gray-900">{formatCurrency(doctor.totalRevenue)}</td>
                    <td className="py-4 px-6 text-right text-purple-600 font-medium">{formatCurrency(doctor.commission)}</td>
                    <td className="py-4 px-6 text-right text-green-600 font-medium">{formatCurrency(doctor.netRevenue)}</td>
                    <td className="py-4 px-6 text-right text-blue-600 font-medium">{formatCurrency(doctor.averagePerAppointment)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan={3} className="py-4 px-6 font-semibold text-gray-900">Totaux</td>
                  <td className="py-4 px-6 text-right font-bold text-gray-900">{formatCurrency(doctorStats.reduce((sum, d) => sum + d.totalRevenue, 0))}</td>
                  <td className="py-4 px-6 text-right font-bold text-purple-600">{formatCurrency(doctorStats.reduce((sum, d) => sum + d.commission, 0))}</td>
                  <td className="py-4 px-6 text-right font-bold text-green-600">{formatCurrency(doctorStats.reduce((sum, d) => sum + d.netRevenue, 0))}</td>
                  <td className="py-4 px-6 text-right font-bold text-blue-600">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        /* Transactions */
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          {/* Filtres transactions */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher transaction, médecin, patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Complétés</option>
              <option value="failed">Échoués</option>
              <option value="refunded">Remboursés</option>
            </select>

            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tous les médecins</option>
              {doctorStats.map(doctor => (
                <option key={doctor.doctorId} value={doctor.doctorId}>{doctor.doctorName}</option>
              ))}
            </select>

            <button
              onClick={fetchFinancialData}
              className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>

          {/* Liste des transactions */}
          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune transaction trouvée</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition hover:border-green-200"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(transaction.status)}
                        <span className="text-xs text-gray-400">
                          ID: {transaction.transactionId}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Médecin</p>
                          <p className="font-medium text-gray-900">
                            Dr. {transaction.appointment?.doctor?.firstName} {transaction.appointment?.doctor?.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Patient</p>
                          <p className="text-gray-700">
                            {transaction.appointment?.patient?.firstName} {transaction.appointment?.patient?.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Montant</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(transaction.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {transaction.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setShowTransactionModal(true);
                      }}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal détails transaction */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Détails de la transaction
              </h2>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Montant</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(selectedTransaction.amount)}</p>
                </div>
                {getStatusBadge(selectedTransaction.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedTransaction.transactionId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-gray-700">{formatDate(selectedTransaction.createdAt)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Médecin</h3>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">
                    Dr. {selectedTransaction.appointment?.doctor?.firstName} {selectedTransaction.appointment?.doctor?.lastName}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Patient</h3>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">
                    {selectedTransaction.appointment?.patient?.firstName} {selectedTransaction.appointment?.patient?.lastName}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Détails du paiement</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Méthode</p>
                    <p className="text-gray-700">{selectedTransaction.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Devise</p>
                    <p className="text-gray-700">{selectedTransaction.currency}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReports;
