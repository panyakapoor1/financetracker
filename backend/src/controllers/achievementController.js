const asyncHandler = require('express-async-handler');
const Achievement = require('../models/Achievement');
const Transaction = require('../models/Transaction');
const SavingsGoal = require('../models/SavingsGoal');

// Hardcoded list of all possible badges and their criteria details
const AVAILABLE_BADGES = [
  { id: 'first_transaction', name: 'First Steps', description: 'Log your first transaction.', icon: '👶', color: '#60a5fa' },
  { id: '100_club', name: '100 Club', description: 'Log 100 transactions.', icon: '💯', color: '#f472b6' },
  { id: 'savings_champion', name: 'Savings Champion', description: 'Fully fund a savings goal.', icon: '🏆', color: '#facc15' },
  { id: 'budget_master', name: 'Budget Master', description: 'Create your first budget limit.', icon: '🛡️', color: '#4ade80' },
  { id: 'category_king', name: 'Category King', description: 'Create a custom category.', icon: '👑', color: '#c084fc' },
];

const getAchievements = asyncHandler(async (req, res) => {
  const unlocked = await Achievement.find({ userId: req.user._id }).sort({ unlockedAt: -1 });
  
  // Map unlocked records to full badge details, and figure out locked ones
  const unlockedIds = unlocked.map(a => a.badgeId);
  
  const badges = AVAILABLE_BADGES.map(badge => {
    const isUnlocked = unlockedIds.includes(badge.id);
    const unlockRecord = unlocked.find(a => a.badgeId === badge.id);
    return {
      ...badge,
      unlocked: isUnlocked,
      unlockedAt: isUnlocked ? unlockRecord.unlockedAt : null
    };
  });

  res.status(200).json({
    status: 'success',
    data: { achievements: badges }
  });
});

// A hidden endpoint called internally (or occasionally by the frontend) to check and award badges
const evaluateAchievements = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const newUnlocks = [];

  const existing = await Achievement.find({ userId });
  const unlockedIds = existing.map(a => a.badgeId);

  const awardBadge = async (badgeId) => {
    if (!unlockedIds.includes(badgeId)) {
      await Achievement.create({ userId, badgeId });
      newUnlocks.push(AVAILABLE_BADGES.find(b => b.id === badgeId));
      unlockedIds.push(badgeId);
    }
  };

  // Check 1: First transaction
  if (!unlockedIds.includes('first_transaction')) {
    const txCount = await Transaction.countDocuments({ userId });
    if (txCount >= 1) await awardBadge('first_transaction');
  }

  // Check 2: 100 Club
  if (!unlockedIds.includes('100_club')) {
    const txCount = await Transaction.countDocuments({ userId });
    if (txCount >= 100) await awardBadge('100_club');
  }

  // Check 3: Savings Champion
  if (!unlockedIds.includes('savings_champion')) {
    const completedGoals = await SavingsGoal.findOne({ 
      userId, 
      $expr: { $gte: ["$currentAmount", "$targetAmount"] } 
    });
    if (completedGoals) await awardBadge('savings_champion');
  }

  res.status(200).json({
    status: 'success',
    data: { newUnlocks }
  });
});

module.exports = {
  getAchievements,
  evaluateAchievements
};
