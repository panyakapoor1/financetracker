const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');

/**
 * @desc    Export transactions as CSV
 * @route   GET /api/reports/csv
 * @access  Private
 */
const exportCSV = asyncHandler(async (req, res) => {
  const { startDate, endDate, type } = req.query;

  const query = { userId: req.user._id };

  if (type && ['income', 'expense'].includes(type)) {
    query.type = type;
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const transactions = await Transaction.find(query)
    .populate('categoryId', 'name type')
    .sort({ date: -1 });


  const csvRows = [];
  

  csvRows.push('Date,Type,Category,Amount,Description');


  transactions.forEach(transaction => {
    const date = new Date(transaction.date).toISOString().split('T')[0];
    const type = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
    const category = transaction.categoryId ? transaction.categoryId.name : 'N/A';
    const amount = transaction.amount.toFixed(2);
    const description = (transaction.description || '').replace(/,/g, ';'); // Escape commas
    
    csvRows.push(`${date},${type},${category},${amount},"${description}"`);
  });

  const csvContent = csvRows.join('\n');


  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=transactions_${Date.now()}.csv`);
  res.status(200).send(csvContent);
});

/**
 * @desc    Export transactions summary as JSON
 * @route   GET /api/reports/summary
 * @access  Private
 */
const getReportSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchStage = { userId: req.user._id };

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }


  const overallStats = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avg: { $avg: '$amount' }
      }
    }
  ]);


  const categoryBreakdown = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          type: '$type',
          categoryId: '$categoryId'
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id.categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        type: '$_id.type',
        categoryName: '$category.name',
        total: 1,
        count: 1
      }
    },
    { $sort: { total: -1 } }
  ]);


  const monthlyBreakdown = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type'
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const income = overallStats.find(s => s._id === 'income') || { total: 0, count: 0, avg: 0 };
  const expense = overallStats.find(s => s._id === 'expense') || { total: 0, count: 0, avg: 0 };

  res.status(200).json({
    status: 'success',
    data: {
      period: {
        startDate: startDate || 'Beginning',
        endDate: endDate || 'Now'
      },
      summary: {
        income: {
          total: income.total,
          count: income.count,
          average: income.avg
        },
        expense: {
          total: expense.total,
          count: expense.count,
          average: expense.avg
        },
        balance: income.total - expense.total,
        savingsRate: income.total > 0 ? ((income.total - expense.total) / income.total * 100).toFixed(2) : 0
      },
      categoryBreakdown,
      monthlyBreakdown
    }
  });
});

/**
 * @desc    Get income vs expense report
 * @route   GET /api/reports/income-expense
 * @access  Private
 */
const getIncomeExpenseReport = asyncHandler(async (req, res) => {
  const { year } = req.query;
  const currentYear = year ? parseInt(year) : new Date().getFullYear();

  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

  const monthlyData = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          month: { $month: '$date' },
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.month': 1 } }
  ]);


  const report = [];
  for (let month = 1; month <= 12; month++) {
    const monthName = new Date(currentYear, month - 1).toLocaleString('default', { month: 'long' });
    const income = monthlyData.find(d => d._id.month === month && d._id.type === 'income')?.total || 0;
    const expense = monthlyData.find(d => d._id.month === month && d._id.type === 'expense')?.total || 0;

    report.push({
      month: monthName,
      monthNumber: month,
      income,
      expense,
      balance: income - expense
    });
  }

  const yearTotal = report.reduce((acc, month) => ({
    income: acc.income + month.income,
    expense: acc.expense + month.expense,
    balance: acc.balance + month.balance
  }), { income: 0, expense: 0, balance: 0 });

  res.status(200).json({
    status: 'success',
    data: {
      year: currentYear,
      monthlyReport: report,
      yearTotal
    }
  });
});

module.exports = {
  exportCSV,
  getReportSummary,
  getIncomeExpenseReport
};
