const authRoutes = require("./auth.routes");
const organizationRoutes = require("./organization.routes");
const ticketRoutes = require("./ticket.routes");

const router = require("express").Router();

router.use("/auth", authRoutes);
router.use("/organization", organizationRoutes);
router.use("/ticket", ticketRoutes);

module.exports = router;