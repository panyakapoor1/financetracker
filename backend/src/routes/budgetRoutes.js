const express = require('express');
const router = express.Router();
const {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetAlerts
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validator');

// All routes are protected
router.use(protect);

// Alerts route (must be before :id route)
router.get('/alerts', getBudgetAlerts);

router.route('/')
  .get(getBudgets)
  .post(validate(schemas.createBudget), createBudget);

router.route('/:id')
  .get(getBudget)
  .put(validate(schemas.updateBudget), updateBudget)
  .delete(deleteBudget);

module.exports = router;
