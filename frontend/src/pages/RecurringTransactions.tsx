import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw, Pause, Play } from 'lucide-react';
import { recurringService, categoryService } from '../services';
import { Category } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const frequencyLabels: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

const RecurringTransactions: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as 'income' | 'expense',
    categoryId: '',
    description: '',
    frequency: 'monthly',
    nextDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recRes, catRes] = await Promise.all([
        recurringService.getAll(),
        categoryService.getCategories(),
      ]);
      setItems(recRes.data?.recurringTransactions || []);
      setCategories(catRes.data?.categories || []);
    } catch (error) {
      toast.error('Failed to load recurring transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recurringService.create({
        amount: Number(formData.amount),
        type: formData.type,
        categoryId: formData.categoryId,
        description: formData.description,
        frequency: formData.frequency as any,
        nextDate: formData.nextDate,
      });
      toast.success('Recurring transaction created');
      setIsModalOpen(false);
      fetchData();
      setFormData({
        amount: '',
        type: 'expense',
        categoryId: '',
        description: '',
        frequency: 'monthly',
        nextDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      toast.error('Failed to create recurring transaction');
    }
  };

  const handleToggle = async (id: string, currentlyActive: boolean) => {
    try {
      await recurringService.update(id, { isActive: !currentlyActive });
      toast.success(currentlyActive ? 'Paused' : 'Resumed');
      fetchData();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await recurringService.delete(id);
      toast.success('Deleted');
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const filteredCategories = categories.filter((c: Category) => c.type === formData.type);

  if (loading && items.length === 0) {
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
          <h2 className="text-3xl font-bold text-white tracking-tight">Recurring</h2>
          <p className="text-white/60 mt-1">Automate your regular bills and income.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl flex items-center transition-colors shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Recurring
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => (
              <div key={item._id} className={`glass-panel rounded-2xl p-6 relative overflow-hidden ${!item.isActive ? 'opacity-60' : ''}`}>
                {!item.isActive && (
                  <div className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full font-medium">
                    Paused
                  </div>
                )}
                <div className="flex items-center mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-white/5"
                    style={{ color: item.categoryId?.color || '#ccc' }}
                  >
                    <span className="text-2xl">{item.categoryId?.icon || '🔄'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{item.categoryId?.name || 'Unknown'}</p>
                    {item.description && (
                      <p className="text-sm text-white/50 truncate">{item.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className={`text-2xl font-bold ${item.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                    {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-white/50 mb-4">
                  <div className="flex items-center">
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    {frequencyLabels[item.frequency] || item.frequency}
                  </div>
                  <span>Next: {format(new Date(item.nextDate), 'MMM dd, yyyy')}</span>
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleToggle(item._id, item.isActive)}
                    className={`flex-1 py-1.5 rounded-lg text-sm flex items-center justify-center transition-colors ${
                      item.isActive
                        ? 'text-yellow-400 hover:bg-yellow-500/10 border border-yellow-500/20'
                        : 'text-green-400 hover:bg-green-500/10 border border-green-500/20'
                    }`}
                  >
                    {item.isActive ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
                    {item.isActive ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm({ open: true, id: item._id });
                    }}
                    className="py-1.5 px-3 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors relative z-10"
                    title="Delete recurring transaction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl h-full flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 text-white/30" />
            </div>
            <p className="text-white/60 mb-4 text-lg">No recurring transactions set up.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-primary-400 hover:text-primary-300 font-medium text-lg"
            >
              Create your first recurring transaction
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">New Recurring Transaction</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button"
                    className={`py-2 px-4 rounded-xl border ${formData.type === 'expense' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-white/60'} transition-colors`}
                    onClick={() => setFormData({ ...formData, type: 'expense', categoryId: '' })}
                  >Expense</button>
                  <button type="button"
                    className={`py-2 px-4 rounded-xl border ${formData.type === 'income' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-white/60'} transition-colors`}
                    onClick={() => setFormData({ ...formData, type: 'income', categoryId: '' })}
                  >Income</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                  <input type="number" required step="0.01" min="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
                <select required
                  className="w-full bg-surface border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {filteredCategories.map((c: Category) => (
                    <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Frequency</label>
                <select
                  className="w-full bg-surface border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Next Date</label>
                <input type="date" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.nextDate}
                  onChange={(e) => setFormData({ ...formData, nextDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Description (Optional)</label>
                <input type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex space-x-4 pt-4 mt-6 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors"
                >Cancel</button>
                <button type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition-colors"
                >Save</button>
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
        title="Delete Recurring"
        message="Stop this recurring transaction? Future entries will no longer be generated automatically."
      />
    </div>
  );
};

export default RecurringTransactions;
