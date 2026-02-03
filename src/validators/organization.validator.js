const { body } = require("express-validator");

exports.createOrganization = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 20 })
    .notEmpty()
    .withMessage("Organization name is required")
    .escape()
    .withMessage("Organization name must be between 3 and 20 characters"),
];

exports.addMember = [
  body("org_id")
    .notEmpty()
    .withMessage("Organization ID is required")
    .isInt()
    .withMessage("Organization ID must be an integer"),

  body("user_id")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User ID must be an integer"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["ADMIN", "AGENT"])
    .withMessage("Role must be either ADMIN or AGENT"),
];

exports.getUserOrganizations = [
  body("user_id")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User ID must be an integer"),
];

exports.changeUserRole = [
  body("user_id")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User ID must be an integer"),

  body("org_id")
    .notEmpty()
    .withMessage("Organization ID is required")
    .isInt()
    .withMessage("Organization ID must be an integer"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["ADMIN", "AGENT"])
    .withMessage("Role must be either ADMIN or AGENT"),
];
