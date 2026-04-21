const asyncHandler = require('express-async-handler');
const RecurringTransaction = require('../models/RecurringTransaction');
const Category = require('../models/Category');

const getRecurringTransactions = asyncHandler(async (req, res) => {
  const transactions = await RecurringTransaction.find({ userId: req.user._id })
    .populate('categoryId', 'name icon color type')
    .sort({ nextDate: 1 });

  res.status(200).json({
    status: 'success',
    data: { recurringTransactions: transactions }
  });
});

const createRecurringTransaction = asyncHandler(async (req, res) => {
  const { amount, type, categoryId, description, frequency, nextDate } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (category.type !== type) {
    res.status(400);
    throw new Error('Category type does not match transaction type');
  }

  const recurring = await RecurringTransaction.create({
    userId: req.user._id,
    amount,
    type,
    categoryId,
    description,
    frequency,
    nextDate: new Date(nextDate),
  });

  const populated = await RecurringTransaction.findById(recurring._id)
    .populate('categoryId', 'name icon color type');

  res.status(201).json({
    status: 'success',
    message: 'Recurring transaction created',
    data: { recurringTransaction: populated }
  });
});

const updateRecurringTransaction = asyncHandler(async (req, res) => {
  const recurring = await RecurringTransaction.findById(req.params.id);

  if (!recurring) {
    res.status(404);
    throw new Error('Recurring transaction not found');
  }

  if (recurring.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const { amount, description, frequency, nextDate, isActive } = req.body;

  if (amount !== undefined) recurring.amount = amount;
  if (description !== undefined) recurring.description = description;
  if (frequency !== undefined) recurring.frequency = frequency;
  if (nextDate !== undefined) recurring.nextDate = new Date(nextDate);
  if (isActive !== undefined) recurring.isActive = isActive;

  await recurring.save();

  const updated = await RecurringTransaction.findById(recurring._id)
    .populate('categoryId', 'name icon color type');

  res.status(200).json({
    status: 'success',
    data: { recurringTransaction: updated }
  });
});

const deleteRecurringTransaction = asyncHandler(async (req, res) => {
  const recurring = await RecurringTransaction.findById(req.params.id);

  if (!recurring) {
    res.status(404);
    throw new Error('Recurring transaction not found');
  }

  if (recurring.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await recurring.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Recurring transaction deleted'
  });
});

// TODO: Add bulk delete option? People might want to clear old scheduled stuff

module.exports = {
  getRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction
};
