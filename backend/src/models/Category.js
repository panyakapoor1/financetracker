const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // null for system default categories
    index: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  type: {
    type: String,
    required: [true, 'Category type is required'],
    enum: {
      values: ['income', 'expense'],
      message: 'Type must be either income or expense'
    }
  },
  icon: {
    type: String,
    default: '📁'
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate category names per user
categorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });

// Static method to get default categories
categorySchema.statics.getDefaultCategories = function() {
  return [
    // Income categories
    { name: 'Salary', type: 'income', icon: '💼', color: '#10b981', isDefault: true },
    { name: 'Freelance', type: 'income', icon: '💻', color: '#3b82f6', isDefault: true },
    { name: 'Investment', type: 'income', icon: '📈', color: '#8b5cf6', isDefault: true },
    { name: 'Other Income', type: 'income', icon: '💰', color: '#06b6d4', isDefault: true },
    
    // Expense categories
    { name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#ef4444', isDefault: true },
    { name: 'Transportation', type: 'expense', icon: '🚗', color: '#f59e0b', isDefault: true },
    { name: 'Shopping', type: 'expense', icon: '🛒', color: '#ec4899', isDefault: true },
    { name: 'Entertainment', type: 'expense', icon: '🎬', color: '#a855f7', isDefault: true },
    { name: 'Bills & Utilities', type: 'expense', icon: '📄', color: '#6366f1', isDefault: true },
    { name: 'Healthcare', type: 'expense', icon: '🏥', color: '#14b8a6', isDefault: true },
    { name: 'Education', type: 'expense', icon: '📚', color: '#3b82f6', isDefault: true },
    { name: 'Other Expense', type: 'expense', icon: '💸', color: '#64748b', isDefault: true }
  ];
};

module.exports = mongoose.model('Category', categorySchema);
