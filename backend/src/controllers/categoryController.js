const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

/**
 * @desc    Get all categories for logged-in user
 * @route   GET /api/categories
 * @access  Private
 */
const getCategories = asyncHandler(async (req, res) => {
  const { type } = req.query;

  const query = {
    $or: [
      { userId: req.user._id },
      { isDefault: true, userId: null }
    ]
  };

  if (type && ['income', 'expense'].includes(type)) {
    query.type = type;
  }

  const categories = await Category.find(query).sort({ name: 1 });

  res.status(200).json({
    status: 'success',
    data: {
      categories
    }
  });
});

/**
 * @desc    Get single category
 * @route   GET /api/categories/:id
 * @access  Private
 */
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check access
  if (category.userId && category.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to access this category');
  }

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, type, icon, color } = req.body;

  // Check if category name already exists for this user and type
  const existingCategory = await Category.findOne({
    userId: req.user._id,
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    type
  });

  if (existingCategory) {
    res.status(400);
    throw new Error(`Category "${name}" already exists for ${type}`);
  }

  const category = await Category.create({
    userId: req.user._id,
    name,
    type,
    icon: icon || '📁',
    color: color || '#6366f1',
    isDefault: false
  });

  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    data: {
      category
    }
  });
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private
 */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check ownership
  if (!category.userId || category.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Cannot modify default categories or categories you do not own');
  }

  const { name, icon, color } = req.body;

  // If name is being updated, check for duplicates
  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({
      userId: req.user._id,
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      type: category.type,
      _id: { $ne: category._id }
    });

    if (existingCategory) {
      res.status(400);
      throw new Error(`Category "${name}" already exists`);
    }
  }

  category.name = name || category.name;
  category.icon = icon || category.icon;
  category.color = color || category.color;

  await category.save();

  res.status(200).json({
    status: 'success',
    message: 'Category updated successfully',
    data: {
      category
    }
  });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check ownership
  if (!category.userId || category.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Cannot delete default categories or categories you do not own');
  }

  // Check if category is being used in transactions
  const transactionCount = await Transaction.countDocuments({
    categoryId: category._id
  });

  if (transactionCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete category. It is used in ${transactionCount} transaction(s)`);
  }

  await category.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Category deleted successfully'
  });
});

/**
 * @desc    Get category spending statistics
 * @route   GET /api/categories/:id/stats
 * @access  Private
 */
const getCategoryStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check access
  if (category.userId && category.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this category');
  }

  const matchStage = {
    userId: req.user._id,
    categoryId: category._id
  };

  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  const stats = await Transaction.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
        count: { $sum: 1 },
        avg: { $avg: '$amount' }
      }
    }
  ]);

  const result = stats.length > 0 ? stats[0] : { total: 0, count: 0, avg: 0 };

  res.status(200).json({
    status: 'success',
    data: {
      category: {
        id: category._id,
        name: category.name,
        type: category.type
      },
      stats: {
        total: result.total,
        count: result.count,
        average: result.avg
      }
    }
  });
});

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
};
