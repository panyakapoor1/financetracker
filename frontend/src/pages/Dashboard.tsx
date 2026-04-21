import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from 'lucide-react';
import { dashboardService } from '../services';
import { DashboardSummary as DashboardSummaryType } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummaryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await dashboardService.getSummary();
      setSummary(response.data || null);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!summary) {
    return <div className="p-6 text-white/60">No data available</div>;
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in h-full overflow-y-auto custom-scrollbar">
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
        <p className="text-white/60 mt-1">Welcome back! Here's your financial summary.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-white/60">This Month Income</p>
              <p className="text-3xl font-bold text-green-400 mt-2 tracking-tight">
                {formatCurrency(summary.currentMonth.income)}
              </p>
            </div>
            <div className="bg-green-500/20 p-4 rounded-full border border-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
              <TrendingUp className="w-7 h-7 text-green-400" />
            </div>
          </div>
        </div>

        {/* Expense Card */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-white/60">This Month Expense</p>
              <p className="text-3xl font-bold text-red-400 mt-2 tracking-tight">
                {formatCurrency(summary.currentMonth.expense)}
              </p>
            </div>
            <div className="bg-red-500/20 p-4 rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(248,113,113,0.2)]">
              <TrendingDown className="w-7 h-7 text-red-400" />
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-white/60">This Month Balance</p>
              <p className={`text-3xl font-bold mt-2 tracking-tight ${summary.currentMonth.balance >= 0 ? 'text-primary-400' : 'text-red-400'}`}>
                {formatCurrency(summary.currentMonth.balance)}
              </p>
            </div>
            <div className="bg-primary-500/20 p-4 rounded-full border border-primary-500/20 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <Wallet className="w-7 h-7 text-primary-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {summary.budgetAlerts && summary.budgetAlerts.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-400 mr-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">Budget Alerts</h3>
              <div className="space-y-3">
                {summary.budgetAlerts.map((budget: any) => (
                  <div key={budget._id} className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-yellow-500/10">
                    <span className="text-sm text-yellow-100/80 font-medium">
                      {budget.categoryId.name}: {budget.percentageUsed}% used
                    </span>
                    <span className="text-sm font-bold text-yellow-400">
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
        {summary.recentTransactions && summary.recentTransactions.length > 0 ? (
          <div className="space-y-1">
            {summary.recentTransactions.map((transaction: any) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between py-4 px-2 hover:bg-white/5 rounded-xl transition-colors border-b border-white/5 last:border-0"
              >
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-lg border border-white/10"
                    style={{ backgroundColor: `${transaction.categoryId.color}20`, color: transaction.categoryId.color }}
                  >
                    <span className="text-2xl drop-shadow-md">{transaction.categoryId.icon}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{transaction.categoryId.name}</p>
                    <p className="text-sm text-white/50 mt-0.5">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold text-lg ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-white'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-white/60">No recent transactions</p>
          </div>
        )}
      </div>

      {/* All-Time Stats */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">All-Time Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-xl p-5 border border-white/5 text-center">
            <p className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Total Income</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(summary.allTime.income)}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/5 text-center">
            <p className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Total Expense</p>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(summary.allTime.expense)}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/5 text-center">
            <p className="text-sm font-medium text-white/50 mb-2 uppercase tracking-wider">Net Balance</p>
            <p className={`text-2xl font-bold ${summary.allTime.balance >= 0 ? 'text-primary-400' : 'text-red-400'}`}>
              {formatCurrency(summary.allTime.balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
