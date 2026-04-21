import React, { useState, useEffect } from 'react';
import { Plus, Trash2, PieChart, AlertCircle, TrendingUp } from 'lucide-react';
import { budgetService, categoryService } from '../services';
import { Category, Budget } from '../types';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [formData, setFormData] = useState({
    categoryId: '',
    limit: '',
  });

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetsRes, catRes] = await Promise.all([
        budgetService.getBudgets(selectedMonth),
        categoryService.getCategories('expense')
      ]);
      setBudgets(budgetsRes.data?.budgets || []);
      setCategories(catRes.data?.categories || []);
    } catch (error) {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await budgetService.createBudget({
        categoryId: formData.categoryId,
        limit: Number(formData.limit),
        month: selectedMonth,
      });
      toast.success('Budget created successfully');
      setIsModalOpen(false);
      fetchData();
      setFormData({ categoryId: '', limit: '' });
    } catch (error) {
      toast.error('Failed to create budget');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await budgetService.deleteBudget(id);
      toast.success('Budget deleted');
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  if (loading && budgets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full animate-fade-in flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Budgets</h2>
          <p className="text-white/60 mt-1">Track and manage your spending limits.</p>
        </div>
        <div className="flex space-x-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl flex items-center transition-colors shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Budget
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget: any) => {
              const percentage = Math.min(100, Math.round((budget.spent / budget.limit) * 100));
              const isOverBudget = budget.spent > budget.limit;
              const isNearBudget = percentage >= 80 && !isOverBudget;
              
              let progressColor = 'bg-primary-500';
              if (isOverBudget) progressColor = 'bg-red-500';
              else if (isNearBudget) progressColor = 'bg-yellow-500';

              return (
                <div key={budget._id} className="glass-panel rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-white/5"
                        style={{ color: budget.categoryId?.color || '#ccc' }}
                      >
                        <span className="text-xl">{budget.categoryId?.icon || '📊'}</span>
                      </div>
                      <h3 className="font-semibold text-white text-lg">
                        {budget.categoryId?.name || 'Unknown'}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm({ open: true, id: budget._id });
                      }}
                      className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors relative z-10"
                      title="Delete budget"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-2 flex justify-between items-end">
                    <div className="text-sm text-white/60">
                      Spent: <span className="text-white font-medium">{formatCurrency(budget.spent)}</span>
                    </div>
                    <div className="text-sm text-white/60">
                      Limit: <span className="text-white font-medium">{formatCurrency(budget.limit)}</span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="text-right text-xs font-medium">
                    {isOverBudget ? (
                      <span className="text-red-400">Over budget by {formatCurrency(budget.spent - budget.limit)}</span>
                    ) : (
                      <span className="text-white/50">{percentage}% used</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl h-full flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-white/60 mb-4 text-lg">No budgets set for {selectedMonth}.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-primary-400 hover:text-primary-300 font-medium text-lg"
            >
              Set up your first budget
            </button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">New Budget Limit</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
                <select
                  required
                  className="w-full bg-surface border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Monthly Limit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4 mt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition-colors"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
        onConfirm={() => deleteConfirm.id && handleDelete(deleteConfirm.id)}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? You can always recreate it later."
      />
    </div>
  );
};

export default Budgets;
