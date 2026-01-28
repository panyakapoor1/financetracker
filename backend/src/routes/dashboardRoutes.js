const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getAnalytics,
  getSpendingTrends
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.get('/summary', getDashboardSummary);
router.get('/analytics', getAnalytics);
router.get('/trends', getSpendingTrends);

module.exports = router;
