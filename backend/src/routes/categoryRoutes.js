const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validator');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getCategories)
  .post(validate(schemas.createCategory), createCategory);

router.route('/:id')
  .get(getCategory)
  .put(validate(schemas.updateCategory), updateCategory)
  .delete(deleteCategory);

router.get('/:id/stats', getCategoryStats);

module.exports = router;
