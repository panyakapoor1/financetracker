const asyncHandler = require('express-async-handler');
const SavingsGoal = require('../models/SavingsGoal');

const getSavingsGoals = asyncHandler(async (req, res) => {
  const goals = await SavingsGoal.find({ userId: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    data: { goals }
  });
});

const createSavingsGoal = asyncHandler(async (req, res) => {
  const { name, targetAmount, currentAmount, deadline, icon, color } = req.body;

  const goal = await SavingsGoal.create({
    userId: req.user._id,
    name,
    targetAmount,
    currentAmount: currentAmount || 0,
    deadline: deadline ? new Date(deadline) : undefined,
    icon: icon || '🎯',
    color: color || '#38bdf8',
  });

  res.status(201).json({
    status: 'success',
    message: 'Savings goal created',
    data: { goal }
  });
});

const updateSavingsGoal = asyncHandler(async (req, res) => {
  const goal = await SavingsGoal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Savings goal not found');
  }

  if (goal.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const { name, targetAmount, currentAmount, deadline, icon, color } = req.body;

  if (name !== undefined) goal.name = name;
  if (targetAmount !== undefined) goal.targetAmount = targetAmount;
  if (currentAmount !== undefined) goal.currentAmount = currentAmount;
  if (deadline !== undefined) goal.deadline = deadline ? new Date(deadline) : null;
  if (icon !== undefined) goal.icon = icon;
  if (color !== undefined) goal.color = color;

  await goal.save();

  res.status(200).json({
    status: 'success',
    data: { goal }
  });
});

const deleteSavingsGoal = asyncHandler(async (req, res) => {
  const goal = await SavingsGoal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Savings goal not found');
  }

  if (goal.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await goal.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Savings goal deleted'
  });
});


const updateGoalAmount = asyncHandler(async (req, res) => {
  const goal = await SavingsGoal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Savings goal not found');
  }

  if (goal.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const { amount } = req.body;
  goal.currentAmount = Math.max(0, goal.currentAmount + amount);
  await goal.save();

  res.status(200).json({
    status: 'success',
    data: { goal }
  });
});

module.exports = {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  updateGoalAmount,
};
