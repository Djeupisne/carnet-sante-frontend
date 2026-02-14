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

interface Payment {
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
      specialty?: string;
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
  const [doctorStats, setDoctorStats] = useState<DoctorFinancialStat[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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
    fetchFinancialData();
  }, []);

  useEffect(() => {
    filterPayments();
    calculateSummary();
  }, [payments, searchTerm, statusFilter, selectedDoctor, dateRange]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les statistiques financières par médecin
      const statsResponse = await adminService.getDoctorFinancialStats();
      if (statsResponse.success) {
        setDoctorStats(statsResponse.data);
      }

      // Récupérer toutes les transactions/paiements
      const paymentsResponse = await adminService.getAllAppointments();
      if (paymentsResponse.success) {
        // Transformer les rendez-vous en paiements (avec données de paiement)
        const transformedPayments = transformAppointmentsToPayments(paymentsResponse.data);
        setPayments(transformedPayments);
        setFilteredPayments(transformedPayments);
      }

    } catch (error) {
      console.error('❌ Erreur récupération données financières:', error);
      showNotification('Erreur lors du chargement des données financières', 'error');
    } finally {
      setLoading(false);
    }
  };

  const transformAppointmentsToPayments = (appointments: any[]): Payment[] => {
    return appointments
      .filter(apt => apt.payment) // Ne garder que les rendez-vous avec paiement
      .map(apt => ({
        id: apt.payment.id,
        amount: apt.payment.amount,
        currency: 'EUR',
        status: apt.payment.status,
        paymentMethod: apt.payment.paymentMethod || 'Carte bancaire',
        transactionId: apt.payment.transactionId || `TR-${apt.id.slice(0, 8)}`,
        createdAt: apt.payment.createdAt || apt.createdAt,
        appointment: {
          id: apt.id,
          appointmentDate: apt.appointmentDate,
          doctor: apt.doctor ? {
            id: apt.doctor.id,
            firstName: apt.doctor.firstName,
            lastName: apt.doctor.lastName,
            specialty: apt.doctor.specialty
          } : undefined,
          patient: apt.patient ? {
            id: apt.patient.id,
            firstName: apt.patient.firstName,
            lastName: apt.patient.lastName
          } : undefined
        }
      }));
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.transactionId.toLowerCase().includes(term) ||
          p.appointment?.doctor?.firstName.toLowerCase().includes(term) ||
          p.appointment?.doctor?.lastName.toLowerCase().includes(term) ||
          p.appointment?.patient?.firstName.toLowerCase().includes(term) ||
          p.appointment?.patient?.lastName.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Filtre par médecin
    if (selectedDoctor !== 'all') {
      filtered = filtered.filter(p => p.appointment?.doctor?.id === selectedDoctor);
    }

    // Filtre par date
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.createdAt);
        switch (dateRange) {
          case 'today':
            return paymentDate.toDateString() === today.toDateString();
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return paymentDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return paymentDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return paymentDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    setFilteredPayments(filtered);
  };

  const calculateSummary = () => {
    const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalCommission = totalRevenue * 0.1;
    const completedPayments = filteredPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = filteredPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    setSummary({
      totalRevenue,
      totalCommission,
      netRevenue: totalRevenue - totalCommission,
      totalTransactions: filteredPayments.length,
      averageTransaction: filteredPayments.length ? totalRevenue / filteredPayments.length : 0,
      pendingPayments,
      completedPayments
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

  const exportToCSV = () => {
    try {
      const headers = ['Date', 'Transaction ID', 'Médecin', 'Patient', 'Montant', 'Statut', 'Méthode'];
      const rows = filteredPayments.map(p => [
        formatDate(p.createdAt),
        p.transactionId,
        `${p.appointment?.doctor?.firstName || ''} ${p.appointment?.doctor?.lastName || ''}`.trim() || 'N/A',
        `${p.appointment?.patient?.firstName || ''} ${p.appointment?.patient?.lastName || ''}`.trim() || 'N/A',
        p.amount,
        p.status,
        p.paymentMethod
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
              {payments.length} transactions trouvées
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Filtre par date */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
            <option value="year">Cette année</option>
          </select>

          {/* Bouton export */}
          <button
            onClick={exportToCSV}
            disabled={filteredPayments.length === 0}
            className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium">Export CSV</span>
          </button>
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

      {/* Statistiques par médecin */}
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
            <p className="text-gray-500">Aucune donnée financière disponible</p>
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
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Moyenne</th>
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
                    <td className="py-3 px-4 text-right text-blue-600 font-medium">{formatCurrency(doctor.averagePerAppointment)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan={3} className="py-3 px-4 font-semibold text-gray-900">Totaux</td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    {formatCurrency(doctorStats.reduce((sum, d) => sum + d.totalRevenue, 0))}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-purple-600">
                    {formatCurrency(doctorStats.reduce((sum, d) => sum + d.commission, 0))}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-green-600">
                    {formatCurrency(doctorStats.reduce((sum, d) => sum + d.netRevenue, 0))}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-blue-600">-</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Liste des transactions */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 flex-1">
            <CreditCard className="w-5 h-5 text-green-600" />
            Transactions récentes
          </h3>

          {/* Filtres */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tous les médecins</option>
              {doctorStats.map(doctor => (
                <option key={doctor.doctorId} value={doctor.doctorId}>
                  {doctor.doctorName}
                </option>
              ))}
            </select>

            <button
              onClick={fetchFinancialData}
              className="p-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
              title="Actualiser"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Chargement des transactions...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune transaction trouvée</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayments.slice(0, 10).map((payment) => (
              <div
                key={payment.id}
                className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition hover:border-green-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusBadge(payment.status)}
                      <span className="text-xs text-gray-400">
                        {payment.transactionId}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Médecin</p>
                        <p className="font-medium text-gray-900">
                          {payment.appointment?.doctor ? 
                            `Dr. ${payment.appointment.doctor.firstName} ${payment.appointment.doctor.lastName}` : 
                            'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Patient</p>
                        <p className="text-gray-700">
                          {payment.appointment?.patient ? 
                            `${payment.appointment.patient.firstName} ${payment.appointment.patient.lastName}` : 
                            'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Montant</p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(payment.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        {payment.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowPaymentModal(true);
                    }}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                    title="Voir détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredPayments.length > 10 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                + {filteredPayments.length - 10} autres transactions
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal détails transaction */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Détails de la transaction
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Montant</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                {getStatusBadge(selectedPayment.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-gray-700">{formatDate(selectedPayment.createdAt)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Médecin</h3>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">
                    {selectedPayment.appointment?.doctor ? 
                      `Dr. ${selectedPayment.appointment.doctor.firstName} ${selectedPayment.appointment.doctor.lastName}` : 
                      'Non assigné'}
                  </p>
                  {selectedPayment.appointment?.doctor?.specialty && (
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedPayment.appointment.doctor.specialty}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Patient</h3>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">
                    {selectedPayment.appointment?.patient ? 
                      `${selectedPayment.appointment.patient.firstName} ${selectedPayment.appointment.patient.lastName}` : 
                      'Non assigné'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Détails du paiement</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Méthode</p>
                    <p className="text-gray-700">{selectedPayment.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Devise</p>
                    <p className="text-gray-700">{selectedPayment.currency}</p>
                  </div>
                </div>
              </div>

              {selectedPayment.appointment && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-700 mb-3">Rendez-vous associé</h3>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {new Date(selectedPayment.appointment.appointmentDate).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">ID: {selectedPayment.appointment.id}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReports;
