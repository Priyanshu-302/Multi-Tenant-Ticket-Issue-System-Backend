const { createTicket } = require("../controllers/ticket.controller");
const { getTickets } = require("../controllers/ticket.controller");
const { assignTicket } = require("../controllers/ticket.controller");
const { updateTicketStatus } = require("../controllers/ticket.controller");
const { updateTicket } = require("../controllers/ticket.controller");
const { deleteTicket } = require("../controllers/ticket.controller");
const { addTicketMessage } = require("../controllers/ticket.controller");
const { getTicketMessage } = require("../controllers/ticket.controller");
const ticketValidator = require("../validators/ticket.validator");
const validate = require("../middlewares/validate.middleware");
const roleHandler = require("../middlewares/role.middleware");
const authHandler = require("../middlewares/auth.middleware");

const router = require("express").Router();
router.use(validate);
router.use(authHandler);

router.post("/create", ticketValidator.createTicket, createTicket);
router.post("/get-tickets", ticketValidator.getTickets, getTickets);
router.post(
  "/assign-ticket",
  ticketValidator.assignTicket,
  roleHandler("ADMIN"),
  assignTicket,
);
router.post(
  "/update-ticket-status",
  ticketValidator.updateTicketStatus,
  roleHandler("ADMIN"),
  updateTicketStatus,
);
router.post(
  "/update-ticket",
  ticketValidator.updateTicket,
  roleHandler("ADMIN"),
  updateTicket,
);
router.post(
  "/delete-ticket",
  ticketValidator.deleteTicket,
  roleHandler("ADMIN"),
  deleteTicket,
);
router.post(
  "/add-ticket-message",
  ticketValidator.addTicketMessage,
  roleHandler("AGENT"),
  addTicketMessage,
);
router.post(
  "/get-ticket-message",
  ticketValidator.getTicketMessage,
  roleHandler("AGENT"),
  getTicketMessage,
);

module.exports = router;
