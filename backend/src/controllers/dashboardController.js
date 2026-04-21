const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Category = require('../models/Category');

/**
 * @desc    Get dashboard summary
 * @route   GET /api/dashboard/summary
 * @access  Private
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);


  const monthlyStats = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth
        }
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const income = monthlyStats.find(s => s._id === 'income') || { total: 0, count: 0 };
  const expense = monthlyStats.find(s => s._id === 'expense') || { total: 0, count: 0 };


  const allTimeStats = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id
      }
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' }
      }
    }
  ]);

  const allTimeIncome = allTimeStats.find(s => s._id === 'income') || { total: 0 };
  const allTimeExpense = allTimeStats.find(s => s._id === 'expense') || { total: 0 };


  const recentTransactions = await Transaction.find({ userId: req.user._id })
    .populate('categoryId', 'name icon color type')
    .sort({ date: -1 })
    .limit(5);


  const budgets = await Budget.find({
    userId: req.user._id,
    month: currentMonth
  }).populate('categoryId', 'name icon color');

  const budgetAlerts = budgets.filter(budget => {
    const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
    return percentage >= 80;
  });

  res.status(200).json({
    status: 'success',
    data: {
      currentMonth: {
        income: income.total,
        expense: expense.total,
        balance: income.total - expense.total,
        transactions: income.count + expense.count
      },
      allTime: {
        income: allTimeIncome.total,
        expense: allTimeExpense.total,
        balance: allTimeIncome.total - allTimeExpense.total
      },
      recentTransactions,
      budgetAlerts: budgetAlerts.map(b => ({
        ...b.toObject(),
        percentageUsed: Math.round((b.spent / b.limit) * 100)
      }))
    }
  });
});

/**
 * @desc    Get analytics data
 * @route   GET /api/dashboard/analytics
 * @access  Private
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate, period = 'monthly' } = req.query;

  const matchStage = { userId: req.user._id };

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  } else {
    // default 6m fallback
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    matchStage.date = { $gte: sixMonthsAgo };
  }


  const categorySpending = await Transaction.aggregate([
    { $match: { ...matchStage, type: 'expense' } },
    {
      $group: {
        _id: '$categoryId',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        categoryId: '$_id',
        categoryName: '$category.name',
        icon: '$category.icon',
        color: '$category.color',
        total: 1,
        count: 1
      }
    },
    { $sort: { total: -1 } }
  ]);


  const monthlyTrends = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);


  const formattedTrends = monthlyTrends.reduce((acc, item) => {
    const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
    if (!acc[key]) {
      acc[key] = { month: key, income: 0, expense: 0 };
    }
    acc[key][item._id.type] = item.total;
    return acc;
  }, {});


  const incomeSources = await Transaction.aggregate([
    { $match: { ...matchStage, type: 'income' } },
    {
      $group: {
        _id: '$categoryId',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        categoryId: '$_id',
        categoryName: '$category.name',
        icon: '$category.icon',
        color: '$category.color',
        total: 1,
        count: 1
      }
    },
    { $sort: { total: -1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      categorySpending,
      monthlyTrends: Object.values(formattedTrends),
      incomeSources
    }
  });
});

/**
 * @desc    Get spending trends
 * @route   GET /api/dashboard/trends
 * @access  Private
 */
const getSpendingTrends = asyncHandler(async (req, res) => {
  const { months = 6 } = req.query;

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - parseInt(months));

  const trends = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' },
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      trends
    }
  });
});

module.exports = {
  getDashboardSummary,
  getAnalytics,
  getSpendingTrends
};
