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
  CreditCard,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Percent,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  FileText,
  RefreshCw,
  Eye,
  Stethoscope
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';

interface DoctorStat {
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
  status: string;
  paymentMethod: string;
  createdAt: string;
  doctorName?: string;
  patientName?: string;
}

const FinancialReports: React.FC = () => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [doctorStats, setDoctorStats] = useState<DoctorStat[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalCommission: 0,
    netRevenue: 0,
    totalTransactions: 0
  });
  const [stats, setStats] = useState({
    byStatus: { pending: 0, completed: 0, failed: 0, refunded: 0 },
    byPaymentMethod: {} as Record<string, number>,
    topDoctors: [] as Array<{ name: string; count: number; revenue: number }>
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndCalculate();
  }, [payments, searchTerm, statusFilter, selectedDoctor, dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les stats des médecins
      const statsRes = await adminService.getDoctorFinancialStats();
      if (statsRes.success) {
        setDoctorStats(statsRes.data || []);
      }

      // Récupérer les rendez-vous
      const appointmentsRes = await adminService.getAllAppointments({ limit: 1000 });
      if (appointmentsRes.success) {
        const paymentsData = (appointmentsRes.data || [])
          .filter((apt: any) => apt.payment)
          .map((apt: any) => ({
            id: apt.payment.id,
            amount: apt.payment.amount || 0,
            status: apt.payment.status || 'pending',
            paymentMethod: apt.payment.paymentMethod || 'Carte bancaire',
            createdAt: apt.payment.createdAt || apt.createdAt,
            doctorName: apt.doctor ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}` : undefined,
            patientName: apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : undefined
          }));
        setPayments(paymentsData);
        setFilteredPayments(paymentsData);
      }

    } catch (error) {
      console.error('❌ Erreur:', error);
      showNotification('Erreur de chargement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAndCalculate = () => {
    let filtered = [...payments];

    // Filtre recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.doctorName?.toLowerCase().includes(term) ||
        p.patientName?.toLowerCase().includes(term)
      );
    }

    // Filtre statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Filtre date
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.setHours(0,0,0,0));
      filtered = filtered.filter(p => {
        const date = new Date(p.createdAt);
        switch(dateRange) {
          case 'today': return date.toDateString() === today.toDateString();
          case 'week': return date >= new Date(today.getTime() - 7*24*60*60*1000);
          case 'month': return date >= new Date(today.getFullYear(), today.getMonth()-1, today.getDate());
          default: return true;
        }
      });
    }

    setFilteredPayments(filtered);

    // Calculs
    const total = filtered.reduce((s, p) => s + p.amount, 0);
    setSummary({
      totalRevenue: total,
      totalCommission: total * 0.1,
      netRevenue: total * 0.9,
      totalTransactions: filtered.length
    });

    // Stats par statut
    const byStatus = {
      pending: filtered.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0),
      completed: filtered.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0),
      failed: filtered.filter(p => p.status === 'failed').reduce((s, p) => s + p.amount, 0),
      refunded: filtered.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0)
    };

    // Stats par méthode de paiement
    const byPaymentMethod: Record<string, number> = {};
    filtered.forEach(p => {
      if (p.status === 'completed') {
        byPaymentMethod[p.paymentMethod] = (byPaymentMethod[p.paymentMethod] || 0) + p.amount;
      }
    });

    // Top médecins
    const doctorMap = new Map<string, { count: number; revenue: number }>();
    filtered.forEach(p => {
      if (p.status === 'completed' && p.doctorName) {
        const current = doctorMap.get(p.doctorName) || { count: 0, revenue: 0 };
        doctorMap.set(p.doctorName, {
          count: current.count + 1,
          revenue: current.revenue + p.amount
        });
      }
    });

    const topDoctors = Array.from(doctorMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({ byStatus, byPaymentMethod, topDoctors });
  };

  const formatMoney = (n: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-600 rounded-xl">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Rapports financiers</h2>
            <p className="text-gray-500">{payments.length} transactions</p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
          </div>

          {/* Filtres */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-50">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Période</label>
                    <select 
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="all">Toutes</option>
                      <option value="today">Aujourd'hui</option>
                      <option value="week">7 jours</option>
                      <option value="month">30 jours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Statut</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="all">Tous</option>
                      <option value="pending">En attente</option>
                      <option value="completed">Complétés</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cartes résumé */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500">Revenus totaux</div>
          <div className="text-2xl font-bold">{formatMoney(summary.totalRevenue)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500">Commission</div>
          <div className="text-2xl font-bold text-purple-600">{formatMoney(summary.totalCommission)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500">Revenu net</div>
          <div className="text-2xl font-bold text-green-600">{formatMoney(summary.netRevenue)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500">Transactions</div>
          <div className="text-2xl font-bold">{summary.totalTransactions}</div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-6">
        {/* Par statut */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Par statut
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span>En attente</span>
                <span className="font-medium">{formatMoney(stats.byStatus.pending)}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded mt-1">
                <div className="bg-yellow-500 h-2 rounded" style={{ width: `${(stats.byStatus.pending / summary.totalRevenue) * 100 || 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Complétés</span>
                <span className="font-medium">{formatMoney(stats.byStatus.completed)}</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded mt-1">
                <div className="bg-green-500 h-2 rounded" style={{ width: `${(stats.byStatus.completed / summary.totalRevenue) * 100 || 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Méthodes de paiement */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Méthodes de paiement
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byPaymentMethod).map(([method, amount]) => (
              <div key={method}>
                <div className="flex justify-between text-sm">
                  <span>{method}</span>
                  <span className="font-medium">{formatMoney(amount)}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded mt-1">
                  <div className="bg-green-500 h-2 rounded" style={{ width: `${(amount / summary.totalRevenue) * 100 || 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top médecins */}
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Top médecins
          </h3>
          <div className="space-y-3">
            {stats.topDoctors.map((doc, i) => (
              <div key={doc.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-yellow-500 text-white' : 'bg-gray-200'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="text-sm">{doc.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{doc.count} RDV</div>
                  <div className="text-xs text-gray-500">{formatMoney(doc.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Médecins stats */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Médecins
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Médecin</th>
                <th className="text-left p-3">Spécialité</th>
                <th className="text-right p-3">Consultations</th>
                <th className="text-right p-3">Revenu brut</th>
                <th className="text-right p-3">Commission</th>
                <th className="text-right p-3">Revenu net</th>
              </tr>
            </thead>
            <tbody>
              {doctorStats.map(d => (
                <tr key={d.doctorId} className="border-t">
                  <td className="p-3 font-medium">{d.doctorName}</td>
                  <td className="p-3 text-gray-600">{d.specialty}</td>
                  <td className="p-3 text-right">{d.completedAppointments}/{d.totalAppointments}</td>
                  <td className="p-3 text-right">{formatMoney(d.totalRevenue)}</td>
                  <td className="p-3 text-right text-purple-600">{formatMoney(d.commission)}</td>
                  <td className="p-3 text-right text-green-600">{formatMoney(d.netRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
