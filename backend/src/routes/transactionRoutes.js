const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validator');

// All routes are protected
router.use(protect);

// Stats route (must be before :id route)
router.get('/stats/summary', getTransactionStats);

// CRUD routes
router.route('/')
  .get(getTransactions)
  .post(validate(schemas.createTransaction), createTransaction);

router.route('/:id')
  .get(getTransaction)
  .put(validate(schemas.updateTransaction), updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
