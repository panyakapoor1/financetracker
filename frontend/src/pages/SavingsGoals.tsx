import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Target, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { savingsService } from '../services';
import { format, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const goalIcons = ['🎯', '🏠', '✈️', '🚗', '💻', '📚', '🎓', '💍', '🏥', '🎮'];
const goalColors = ['#38bdf8', '#4ade80', '#f87171', '#facc15', '#a78bfa', '#fb923c', '#2dd4bf', '#f472b6', '#818cf8', '#34d399'];

const SavingsGoals: React.FC = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const [fundModal, setFundModal] = useState<{ open: boolean; goalId: string; goalName: string }>({ open: false, goalId: '', goalName: '' });
  const [fundAmount, setFundAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    icon: '🎯',
    color: '#38bdf8',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await savingsService.getGoals();
      setGoals(res.data?.goals || []);
    } catch (error) {
      toast.error('Failed to load savings goals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await savingsService.createGoal({
        name: formData.name,
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount) || 0,
        deadline: formData.deadline || undefined,
        icon: formData.icon,
        color: formData.color,
      });
      toast.success('Savings goal created');
      setIsModalOpen(false);
      fetchGoals();
      setFormData({ name: '', targetAmount: '', currentAmount: '', deadline: '', icon: '🎯', color: '#38bdf8' });
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await savingsService.fundGoal(fundModal.goalId, Number(fundAmount));
      toast.success(`${Number(fundAmount) >= 0 ? 'Added' : 'Withdrawn'} ${formatCurrency(Math.abs(Number(fundAmount)))}`);
      setFundModal({ open: false, goalId: '', goalName: '' });
      setFundAmount('');
      fetchGoals();
    } catch (error) {
      toast.error('Failed to update goal');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await savingsService.deleteGoal(id);
      toast.success('Goal deleted');
      fetchGoals();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  if (loading && goals.length === 0) {
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
          <h2 className="text-3xl font-bold text-white tracking-tight">Savings Goals</h2>
          <p className="text-white/60 mt-1">Set targets and track your progress.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl flex items-center transition-colors shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Goal
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal: any) => {
              const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              const isComplete = goal.currentAmount >= goal.targetAmount;
              const daysLeft = goal.deadline ? differenceInDays(new Date(goal.deadline), new Date()) : null;

              return (
                <div key={goal._id} className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
                  {isComplete && (
                    <div className="absolute top-3 right-3 bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                      ✓ Complete
                    </div>
                  )}

                  <div className="flex items-center mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
                      style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
                    >
                      <span className="text-3xl">{goal.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-lg truncate">{goal.name}</p>
                      {goal.deadline && (
                        <p className={`text-sm ${daysLeft !== null && daysLeft < 30 ? 'text-yellow-400' : 'text-white/40'}`}>
                          {daysLeft !== null && daysLeft > 0
                            ? `${daysLeft} days left`
                            : daysLeft === 0
                            ? 'Due today'
                            : 'Past deadline'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-white font-semibold">{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-white/50">of {formatCurrency(goal.targetAmount)}</span>
                  </div>

                  <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: isComplete ? '#4ade80' : goal.color,
                      }}
                    />
                  </div>

                  <p className="text-right text-xs font-medium text-white/50 mb-4">{percentage}% saved</p>

                  <div className="flex gap-2 pt-3 border-t border-white/10">
                    <button
                      onClick={() => setFundModal({ open: true, goalId: goal._id, goalName: goal.name })}
                      className="flex-1 py-1.5 rounded-lg text-sm flex items-center justify-center text-primary-400 hover:bg-primary-500/10 border border-primary-500/20 transition-colors"
                    >
                      <ArrowUpCircle className="w-4 h-4 mr-1.5" />
                      Add Funds
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm({ open: true, id: goal._id });
                      }}
                      className="py-1.5 px-3 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors relative z-10"
                      title="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl h-full flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-white/30" />
            </div>
            <p className="text-white/60 mb-4 text-lg">No savings goals yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-primary-400 hover:text-primary-300 font-medium text-lg"
            >
              Create your first goal
            </button>
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10 animate-fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">New Savings Goal</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Goal Name</label>
                <input type="text" required
                  placeholder="e.g., Emergency Fund, New Car..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors placeholder:text-white/20"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Target Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                    <input type="number" required step="0.01" min="1"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Already Saved</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                    <input type="number" step="0.01" min="0"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Deadline (Optional)</label>
                <input type="date"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {goalIcons.map(icon => (
                    <button key={icon} type="button"
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${formData.icon === icon ? 'bg-primary-500/20 border-2 border-primary-500 scale-110' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                      onClick={() => setFormData({ ...formData, icon })}
                    >{icon}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {goalColors.map(color => (
                    <button key={color} type="button"
                      className={`w-8 h-8 rounded-full transition-all ${formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-surface scale-110' : 'hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4 mt-6 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors"
                >Cancel</button>
                <button type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition-colors"
                >Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fund Goal Modal */}
      {fundModal.open && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-white/10 animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-2">Add Funds</h3>
            <p className="text-white/50 mb-6 text-sm">To: {fundModal.goalName}</p>
            <form onSubmit={handleFund} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Amount (negative to withdraw)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                  <input type="number" required step="0.01"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-4 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button type="button" onClick={() => { setFundModal({ open: false, goalId: '', goalName: '' }); setFundAmount(''); }}
                  className="flex-1 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors"
                >Cancel</button>
                <button type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition-colors"
                >Confirm</button>
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
        title="Delete Goal"
        message="Are you sure you want to delete this savings goal? All tracked progress for this goal will be lost."
      />
    </div>
  );
};

export default SavingsGoals;
