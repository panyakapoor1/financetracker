const Joi = require('joi');

/**
 * Validation middleware factory
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors
      });
    }

    req.body = value;
    next();
  };
};

/**
 * Validation schemas
 */
const schemas = {
  // Auth schemas
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Transaction schemas
  createTransaction: Joi.object({
    amount: Joi.number().positive().required(),
    type: Joi.string().valid('income', 'expense').required(),
    categoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    date: Joi.date().optional(),
    description: Joi.string().max(500).optional().allow('')
  }),

  updateTransaction: Joi.object({
    amount: Joi.number().positive().optional(),
    type: Joi.string().valid('income', 'expense').optional(),
    categoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    date: Joi.date().optional(),
    description: Joi.string().max(500).optional().allow('')
  }).min(1),

  // Category schemas
  createCategory: Joi.object({
    name: Joi.string().max(50).required(),
    type: Joi.string().valid('income', 'expense').required(),
    icon: Joi.string().optional(),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional()
  }),

  updateCategory: Joi.object({
    name: Joi.string().max(50).optional(),
    icon: Joi.string().optional(),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional()
  }).min(1),

  // Budget schemas
  createBudget: Joi.object({
    categoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    month: Joi.string().pattern(/^\d{4}-\d{2}$/).required(),
    limit: Joi.number().min(0).required()
  }),

  updateBudget: Joi.object({
    limit: Joi.number().min(0).required()
  })
};

module.exports = {
  validate,
  schemas
};
