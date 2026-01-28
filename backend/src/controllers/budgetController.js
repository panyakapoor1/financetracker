const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

/**
 * @desc    Get all budgets for logged-in user
 * @route   GET /api/budgets
 * @access  Private
 */
const getBudgets = asyncHandler(async (req, res) => {
  const { month } = req.query;

  const query = { userId: req.user._id };

  if (month) {
    query.month = month;
  }

  const budgets = await Budget.find(query)
    .populate('categoryId', 'name icon color type')
    .sort({ month: -1 });

  res.status(200).json({
    status: 'success',
    data: {
      budgets
    }
  });
});

/**
 * @desc    Get single budget
 * @route   GET /api/budgets/:id
 * @access  Private
 */
const getBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id)
    .populate('categoryId', 'name icon color type');

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  // Check ownership
  if (budget.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access this budget');
  }

  res.status(200).json({
    status: 'success',
    data: {
      budget
    }
  });
});

/**
 * @desc    Create new budget
 * @route   POST /api/budgets
 * @access  Private
 */
const createBudget = asyncHandler(async (req, res) => {
  const { categoryId, month, limit } = req.body;

  // Verify category exists and is expense type
  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check category access
  if (category.userId && category.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to use this category');
  }

  if (category.type !== 'expense') {
    res.status(400);
    throw new Error('Budgets can only be created for expense categories');
  }

  // Check if budget already exists for this category and month
  const existingBudget = await Budget.findOne({
    userId: req.user._id,
    categoryId,
    month
  });

  if (existingBudget) {
    res.status(400);
    throw new Error('Budget already exists for this category and month');
  }

  // Calculate current spent amount for the month
  const [year, monthNum] = month.split('-');
  const startDate = new Date(year, parseInt(monthNum) - 1, 1);
  const endDate = new Date(year, parseInt(monthNum), 0, 23, 59, 59);

  const transactions = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id,
        categoryId: category._id,
        type: 'expense',
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  const spent = transactions.length > 0 ? transactions[0].total : 0;

  const budget = await Budget.create({
    userId: req.user._id,
    categoryId,
    month,
    limit,
    spent
  });

  const populatedBudget = await Budget.findById(budget._id)
    .populate('categoryId', 'name icon color type');

  res.status(201).json({
    status: 'success',
    message: 'Budget created successfully',
    data: {
      budget: populatedBudget
    }
  });
});

/**
 * @desc    Update budget
 * @route   PUT /api/budgets/:id
 * @access  Private
 */
const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  // Check ownership
  if (budget.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this budget');
  }

  const { limit } = req.body;

  budget.limit = limit !== undefined ? limit : budget.limit;
  await budget.save();

  const updatedBudget = await Budget.findById(budget._id)
    .populate('categoryId', 'name icon color type');

  res.status(200).json({
    status: 'success',
    message: 'Budget updated successfully',
    data: {
      budget: updatedBudget
    }
  });
});

/**
 * @desc    Delete budget
 * @route   DELETE /api/budgets/:id
 * @access  Private
 */
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  // Check ownership
  if (budget.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this budget');
  }

  await budget.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Budget deleted successfully'
  });
});

/**
 * @desc    Get budget alerts (budgets at 80% or more)
 * @route   GET /api/budgets/alerts
 * @access  Private
 */
const getBudgetAlerts = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const budgets = await Budget.find({
    userId: req.user._id,
    month: currentMonth
  }).populate('categoryId', 'name icon color type');

  const alerts = budgets.filter(budget => {
    const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
    return percentage >= 80;
  }).map(budget => ({
    ...budget.toObject(),
    percentageUsed: Math.round((budget.spent / budget.limit) * 100)
  }));

  res.status(200).json({
    status: 'success',
    data: {
      alerts,
      count: alerts.length
    }
  });
});

module.exports = {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetAlerts
};
