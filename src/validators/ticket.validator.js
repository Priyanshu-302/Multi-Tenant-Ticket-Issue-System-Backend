const { body } = require("express-validator");

exports.createTicket = [
  body("title")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long"),

  body("description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),

  body("org_id")
    .notEmpty()
    .withMessage("Organization ID is required")
    .isInt()
    .withMessage("Organization ID must be an integer"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"])
    .withMessage("Status must be either OPEN, IN_PROGRESS or CLOSED"),

  body("priority")
    .notEmpty()
    .withMessage("Priority is required")
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Priority must be either LOW, MEDIUM or HIGH"),
];

exports.getTickets = [
  body("org_id")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Organization ID is required")
    .isInt()
    .withMessage("Organization ID must be an integer"),
];

exports.assignTicket = [
  body("ticket_id").notEmpty().withMessage("Ticket ID is required"),

  body("created_by")
    .notEmpty()
    .withMessage("User id is required")
    .isInt()
    .withMessage("Created by must be an integer"),

  body("assigned_to")
    .notEmpty()
    .withMessage("Agent id is required")
    .isInt()
    .withMessage("Assigned to must be an integer"),
];

exports.updateTicketStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"])
    .withMessage("Status must be either OPEN, IN_PROGRESS or CLOSED"),

  body("ticket_id").notEmpty().withMessage("Ticket ID is required"),
];

exports.updateTicket = [
  body("title")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long"),

  body("description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),

  body("ticket_id").notEmpty().withMessage("Ticket ID is required"),
];

exports.deleteTicket = [
  body("ticket_id").notEmpty().withMessage("Ticket ID is required"),
];

exports.addTicketMessage = [
  body("ticket_id").notEmpty().withMessage("Ticket ID is required"),

  body("new_status")
    .notEmpty()
    .withMessage("Status is required")
    .trim()
    .escape()
    .isIn(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"])
    .withMessage("Status must be either OPEN, IN_PROGRESS or CLOSED"),

  body("user_id")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User ID must be an integer"),
];

exports.getTicketMessage = [
  body("ticket_id").notEmpty().withMessage("Ticket ID is required"),
];
