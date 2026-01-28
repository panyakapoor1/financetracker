const express = require('express');
const router = express.Router();
const {
  exportCSV,
  getReportSummary,
  getIncomeExpenseReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.get('/csv', exportCSV);
router.get('/summary', getReportSummary);
router.get('/income-expense', getIncomeExpenseReport);

module.exports = router;
