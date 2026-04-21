const express = require('express');
const router = express.Router();
const {
  getRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction
} = require('../controllers/recurringController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getRecurringTransactions)
  .post(createRecurringTransaction);

router.route('/:id')
  .put(updateRecurringTransaction)
  .delete(deleteRecurringTransaction);

module.exports = router;
