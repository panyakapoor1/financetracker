import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Download, Calendar, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import { dashboardService, reportService } from '../services';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [reportSummary, setReportSummary] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);

  // date range filter
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const [analyticsRes, summaryRes] = await Promise.all([
        dashboardService.getAnalytics(params),
        reportService.getSummary(params),
      ]);
      setAnalytics(analyticsRes.data);
      setReportSummary(summaryRes.data);
    } catch (error) {
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    setDownloading(true);
    try {
      const params: any = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const blob = await reportService.exportCSV(params);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded successfully');
    } catch (error) {
      toast.error('Failed to download CSV');
    } finally {
      setDownloading(false);
    }
  };

  const handleApplyFilter = () => {
    fetchAnalytics();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Monthly Trend Chart
  const trendData = {
    labels: analytics.monthlyTrends.map((t: any) => t.month),
    datasets: [
      {
        label: 'Income',
        data: analytics.monthlyTrends.map((t: any) => t.income),
        borderColor: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expense',
        data: analytics.monthlyTrends.map((t: any) => t.expense),
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'rgba(255, 255, 255, 0.7)' }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      }
    }
  };

  const categoryData = {
    labels: analytics.categorySpending.map((c: any) => c.categoryName || 'Unknown'),
    datasets: [
      {
        data: analytics.categorySpending.map((c: any) => c.total),
        backgroundColor: analytics.categorySpending.map((c: any) => c.color || '#ccc'),
        borderWidth: 0,
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 20
        }
      }
    },
    cutout: '75%'
  };

  const savingsRate = reportSummary?.summary?.savingsRate || 0;
  const totalIncome = reportSummary?.summary?.income?.total || 0;
  const totalExpense = reportSummary?.summary?.expense?.total || 0;
  const avgIncome = reportSummary?.summary?.income?.average || 0;
  const avgExpense = reportSummary?.summary?.expense?.average || 0;

  return (
    <div className="p-6 h-full animate-fade-in flex flex-col overflow-y-auto custom-scrollbar">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Reports</h2>
          <p className="text-white/60 mt-1">Analyze your financial health over time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-white/40" />
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="bg-transparent text-white text-sm focus:outline-none w-[130px]"
              placeholder="Start"
            />
            <span className="text-white/30">–</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="bg-transparent text-white text-sm focus:outline-none w-[130px]"
            />
          </div>
          <button
            onClick={handleApplyFilter}
            className="bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-xl text-sm transition-colors border border-white/10"
          >
            Apply
          </button>
          <button
            onClick={handleDownloadCSV}
            disabled={downloading}
            className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl flex items-center transition-colors shadow-lg shadow-primary-500/20 text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            {downloading ? 'Downloading...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Summary insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50 uppercase tracking-wider">Total Income</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-white/40 mt-1">Avg: {formatCurrency(avgIncome)} per txn</p>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50 uppercase tracking-wider">Total Expense</span>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpense)}</p>
          <p className="text-xs text-white/40 mt-1">Avg: {formatCurrency(avgExpense)} per txn</p>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50 uppercase tracking-wider">Net Savings</span>
            <TrendingUp className="w-5 h-5 text-primary-400" />
          </div>
          <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-primary-400' : 'text-red-400'}`}>
            {formatCurrency(totalIncome - totalExpense)}
          </p>
          <p className="text-xs text-white/40 mt-1">Income minus expenses</p>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/50 uppercase tracking-wider">Savings Rate</span>
            <Percent className="w-5 h-5 text-purple-400" />
          </div>
          <p className={`text-2xl font-bold ${Number(savingsRate) >= 20 ? 'text-green-400' : Number(savingsRate) >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
            {Number(savingsRate).toFixed(1)}%
          </p>
          <p className="text-xs text-white/40 mt-1">
            {Number(savingsRate) >= 20 ? 'Great job saving!' : Number(savingsRate) >= 0 ? 'Try to save more' : 'Spending exceeds income'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Trend Chart */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 min-h-[350px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4">Income vs Expense Trend</h3>
          <div className="flex-1 relative">
            {analytics.monthlyTrends.length > 0 ? (
              <Line data={trendData} options={chartOptions} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/50">
                Not enough data to display trends
              </div>
            )}
          </div>
        </div>

        {/* Category Chart */}
        <div className="glass-panel rounded-2xl p-6 min-h-[350px] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4">Expenses by Category</h3>
          <div className="flex-1 relative">
            {analytics.categorySpending.length > 0 ? (
              <Doughnut data={categoryData} options={doughnutOptions} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/50 text-center">
                No expenses recorded
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Category Breakdown</h3>
        {analytics.categorySpending.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-sm uppercase">
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium text-right">Transactions</th>
                  <th className="pb-3 font-medium text-right">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {analytics.categorySpending.map((item: any, index: number) => {
                  const totalExpenses = analytics.categorySpending.reduce((sum: number, c: any) => sum + c.total, 0);
                  const percentage = ((item.total / totalExpenses) * 100).toFixed(1);

                  return (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-white/5"
                            style={{ color: item.color || '#ccc' }}
                          >
                            <span className="text-sm">{item.icon || '🏷️'}</span>
                          </div>
                          <span className="text-white font-medium">{item.categoryName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right font-bold text-white">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="py-4 text-right text-white/60">
                        {item.count}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${percentage}%`, backgroundColor: item.color || '#ccc' }}
                            />
                          </div>
                          <span className="text-white/60 text-sm w-12 text-right">{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-white/50">
            No category data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
