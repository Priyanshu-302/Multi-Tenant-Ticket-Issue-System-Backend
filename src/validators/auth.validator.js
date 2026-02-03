const { body } = require("express-validator");

exports.register = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 20 })
    .notEmpty()
    .withMessage("Name is required")
    .escape()
    .withMessage("Name must be between 3 and 20 characters"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Email is required"),

  body("password")
    .trim()
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be between 6 and 10 characters")
    .escape()
    .notEmpty()
    .withMessage("Password is required"),
];

exports.login = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Email is required"),

  body("password")
    .trim()
    .isLength({ min: 6, max: 10 })
    .withMessage("Password must be between 6 and 10 characters")
    .escape()
    .notEmpty()
    .withMessage("Password is required"),
];