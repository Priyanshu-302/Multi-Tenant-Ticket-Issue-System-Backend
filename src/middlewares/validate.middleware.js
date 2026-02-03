const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validate;