const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const Budget = require('../models/Budget');

/**
 * @desc    Get all transactions for logged-in user
 * @route   GET /api/transactions
 * @access  Private
 */
const getTransactions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    type,
    categoryId,
    startDate,
    endDate,
    sortBy = 'date',
    order = 'desc'
  } = req.query;


  const query = { userId: req.user._id };

  if (type && ['income', 'expense'].includes(type)) {
    query.type = type;
  }

  if (categoryId) {
    query.categoryId = categoryId;
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }


  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === 'asc' ? 1 : -1;


  const transactions = await Transaction.find(query)
    .populate('categoryId', 'name icon color type')
    .sort({ [sortBy]: sortOrder })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Transaction.countDocuments(query);

  res.status(200).json({
    status: 'success',
    data: {
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

/**
 * @desc    Get single transaction
 * @route   GET /api/transactions/:id
 * @access  Private
 */
const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('categoryId', 'name icon color type');

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }


  if (transaction.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access this transaction');
  }

  res.status(200).json({
    status: 'success',
    data: {
      transaction
    }
  });
});

/**
 * @desc    Create new transaction
 * @route   POST /api/transactions
 * @access  Private
 */
const createTransaction = asyncHandler(async (req, res) => {
  const { amount, type, categoryId, date, description } = req.body;


  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (category.userId && category.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to use this category');
  }


  if (category.type !== type) {
    res.status(400);
    throw new Error(`Category type (${category.type}) does not match transaction type (${type})`);
  }


  const transaction = await Transaction.create({
    userId: req.user._id,
    amount,
    type,
    categoryId,
    date: date || new Date(),
    description
  });

  // TODO: Maybe move this budget update logic into a separate background queue if it gets slow
  if (type === 'expense') {
    const transactionDate = new Date(transaction.date);
    const month = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
    
    const budget = await Budget.findOne({
      userId: req.user._id,
      categoryId,
      month
    });

    if (budget) {
      budget.spent += amount;
      await budget.save();
    }
  }

  const populatedTransaction = await Transaction.findById(transaction._id)
    .populate('categoryId', 'name icon color type');

  res.status(201).json({
    status: 'success',
    message: 'Transaction created successfully',
    data: {
      transaction: populatedTransaction
    }
  });
});

/**
 * @desc    Update transaction
 * @route   PUT /api/transactions/:id
 * @access  Private
 */
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }


  if (transaction.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this transaction');
  }

  const { amount, type, categoryId, date, description } = req.body;


  if (categoryId && categoryId !== transaction.categoryId.toString()) {
    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    if (category.userId && category.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to use this category');
    }

    const newType = type || transaction.type;
    if (category.type !== newType) {
      res.status(400);
      throw new Error(`Category type does not match transaction type`);
    }
  }


  if (transaction.type === 'expense') {
    const oldDate = new Date(transaction.date);
    const oldMonth = `${oldDate.getFullYear()}-${String(oldDate.getMonth() + 1).padStart(2, '0')}`;
    
    const oldBudget = await Budget.findOne({
      userId: req.user._id,
      categoryId: transaction.categoryId,
      month: oldMonth
    });

    if (oldBudget) {
      oldBudget.spent -= transaction.amount;
      await oldBudget.save();
    }


    const newDate = new Date(date || transaction.date);
    const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    const newCategoryId = categoryId || transaction.categoryId;
    const newAmount = amount || transaction.amount;

    const newBudget = await Budget.findOne({
      userId: req.user._id,
      categoryId: newCategoryId,
      month: newMonth
    });

    if (newBudget) {
      newBudget.spent += newAmount;
      await newBudget.save();
    }
  }


  transaction.amount = amount || transaction.amount;
  transaction.type = type || transaction.type;
  transaction.categoryId = categoryId || transaction.categoryId;
  transaction.date = date || transaction.date;
  transaction.description = description !== undefined ? description : transaction.description;

  await transaction.save();

  const updatedTransaction = await Transaction.findById(transaction._id)
    .populate('categoryId', 'name icon color type');

  res.status(200).json({
    status: 'success',
    message: 'Transaction updated successfully',
    data: {
      transaction: updatedTransaction
    }
  });
});

/**
 * @desc    Delete transaction
 * @route   DELETE /api/transactions/:id
 * @access  Private
 */
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }


  if (transaction.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this transaction');
  }


  if (transaction.type === 'expense') {
    const transactionDate = new Date(transaction.date);
    const month = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
    
    const budget = await Budget.findOne({
      userId: req.user._id,
      categoryId: transaction.categoryId,
      month
    });

    if (budget) {
      budget.spent = Math.max(0, budget.spent - transaction.amount);
      await budget.save();
    }
  }

  await transaction.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Transaction deleted successfully'
  });
});

/**
 * @desc    Get transaction statistics
 * @route   GET /api/transactions/stats/summary
 * @access  Private
 */
const getTransactionStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchStage = { userId: req.user._id };
  
  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  const stats = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const income = stats.find(s => s._id === 'income') || { total: 0, count: 0 };
  const expense = stats.find(s => s._id === 'expense') || { total: 0, count: 0 };

  res.status(200).json({
    status: 'success',
    data: {
      income: {
        total: income.total,
        count: income.count
      },
      expense: {
        total: expense.total,
        count: expense.count
      },
      balance: income.total - expense.total
    }
  });
});

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
};
