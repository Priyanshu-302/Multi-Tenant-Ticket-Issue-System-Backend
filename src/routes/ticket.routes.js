const createTicket = require("../controllers/ticket.controller");
const getTickets = require("../controllers/ticket.controller");
const assignTicket = require("../controllers/ticket.controller");
const updateTicketStatus = require("../controllers/ticket.controller");
const updateTicket = require("../controllers/ticket.controller");
const deleteTicket = require("../controllers/ticket.controller");
const addTicketMessage = require("../controllers/ticket.controller");
const getTicketMessage = require("../controllers/ticket.controller");
const roleHandler = require("../middlewares/role.middleware");

const router = require("express").Router();

router.post("/create", createTicket);
router.post("/get-tickets", getTickets);
router.post("/assign-ticket", roleHandler('ADMIN'), assignTicket);
router.post("/update-ticket-status", roleHandler('ADMIN'), updateTicketStatus);
router.post("/update-ticket", roleHandler('ADMIN'), updateTicket);
router.post("/delete-ticket", roleHandler('ADMIN'), deleteTicket);
router.post("/add-ticket-message", roleHandler('AGENT'), addTicketMessage);
router.post("/get-ticket-message", roleHandler('AGENT'), getTicketMessage);

module.exports = router;