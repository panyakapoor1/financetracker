import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from 'lucide-react';
import { dashboardService } from '../../services';
import { DashboardSummary as DashboardSummaryType } from '../../types';
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
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!summary) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month Income</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {formatCurrency(summary.currentMonth.income)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month Expense</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                {formatCurrency(summary.currentMonth.expense)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month Balance</p>
              <p className={`text-2xl font-bold mt-2 ${summary.currentMonth.balance >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
                {formatCurrency(summary.currentMonth.balance)}
              </p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <Wallet className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {summary.budgetAlerts && summary.budgetAlerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Budget Alerts</h3>
              <div className="space-y-2">
                {summary.budgetAlerts.map((budget) => (
                  <div key={budget._id} className="flex items-center justify-between">
                    <span className="text-sm text-yellow-700">
                      {budget.categoryId.name}: {budget.percentageUsed}% used
                    </span>
                    <span className="text-sm font-medium text-yellow-800">
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        {summary.recentTransactions && summary.recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {summary.recentTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${transaction.categoryId.color}20` }}
                  >
                    <span className="text-xl">{transaction.categoryId.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.categoryId.name}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent transactions</p>
        )}
      </div>

      {/* All-Time Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All-Time Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Income</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(summary.allTime.income)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Expense</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(summary.allTime.expense)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Net Balance</p>
            <p className={`text-xl font-bold ${summary.allTime.balance >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
              {formatCurrency(summary.allTime.balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
