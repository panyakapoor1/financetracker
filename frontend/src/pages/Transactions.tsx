import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Filter } from 'lucide-react';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services';
import { Transaction, Category } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import ConfirmModal from '../components/ConfirmModal';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'' | 'income' | 'expense'>('');
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as 'income' | 'expense',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, catRes] = await Promise.all([
        transactionService.getTransactions({ limit: 50 }),
        categoryService.getCategories()
      ]);
      setTransactions(txRes.data?.transactions || []);
      setCategories(catRes.data?.categories || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transactionService.createTransaction({
        amount: Number(formData.amount),
        type: formData.type,
        categoryId: formData.categoryId,
        date: new Date(formData.date).toISOString(),
        description: formData.description,
      });
      toast.success('Transaction created successfully');
      setIsModalOpen(false);
      fetchData();
      setFormData({
        amount: '',
        type: 'expense',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    } catch (error) {
      toast.error('Failed to create transaction');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionService.deleteTransaction(id);
      toast.success('Transaction deleted');
      fetchData();
    } catch (error) {
      // API error handled by interceptor, but we still catch to prevent unhandled rejection
      console.error('Delete error:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  // Apply local filters
  const displayedTransactions = transactions.filter((t: any) => {
    if (filterType && t.type !== filterType) return false;
    if (filterCategory && t.categoryId?._id !== filterCategory) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchCategory = (t.categoryId?.name || '').toLowerCase().includes(term);
      const matchDesc = (t.description || '').toLowerCase().includes(term);
      const matchAmount = String(t.amount).includes(term);
      if (!matchCategory && !matchDesc && !matchAmount) return false;
    }
    return true;
  });

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full animate-fade-in flex flex-col">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Transactions</h2>
          <p className="text-white/60 mt-1">Manage your income and expenses.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl flex items-center transition-colors shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by category, description, or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors placeholder:text-white/30"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="bg-surface border border-white/10 rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-surface border border-white/10 rounded-xl py-2 px-4 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>

      <div className="glass-panel rounded-2xl flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto custom-scrollbar flex-1 p-6">
          {displayedTransactions.length > 0 ? (
            <div className="space-y-3">
              {displayedTransactions.map((transaction: any) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                      style={{ backgroundColor: `${transaction.categoryId?.color || '#ccc'}20`, color: transaction.categoryId?.color || '#ccc' }}
                    >
                      <span className="text-2xl">{transaction.categoryId?.icon || '💰'}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {transaction.categoryId?.name || 'Unknown Category'}
                      </p>
                      <div className="flex items-center text-sm text-white/50 mt-1">
                        <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                        {transaction.description && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="truncate max-w-[200px]">{transaction.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`font-bold text-lg mr-6 ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-white'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm({ open: true, id: transaction._id });
                      }}
                      className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors relative z-10"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💸</span>
              </div>
              <p className="text-white/60 mb-4">No transactions found.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                Create your first transaction
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10 animate-fade-in">
            <h3 className="text-2xl font-bold text-white mb-6">New Transaction</h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-xl border ${formData.type === 'expense' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-white/60'} transition-colors`}
                    onClick={() => setFormData({ ...formData, type: 'expense', categoryId: '' })}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-xl border ${formData.type === 'income' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-white/60'} transition-colors`}
                    onClick={() => setFormData({ ...formData, type: 'income', categoryId: '' })}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
                <select
                  required
                  className="w-full bg-surface border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {filteredCategories.map(c => (
                    <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
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
                  Save Transaction
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
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
};

export default Transactions;
