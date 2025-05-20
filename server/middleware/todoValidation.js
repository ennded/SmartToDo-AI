// middlewares/todoValidation.js
const { body, validationResult } = require("express-validator");

exports.validateTodo = [
  // Validate fields (customize these rules)
  body("title").notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Proceed if validation passes
  },
];
