const createOrganization = require("../controllers/organization.controller");
const addMember = require("../controllers/organization.controller");
const getUserOrganizations = require("../controllers/organization.controller");
const changeUserRole = require("../controllers/organization.controller");
const roleHandler = require("../middlewares/role.middleware");

const router = require("express").Router();

router.post("/create", createOrganization);
router.post("/add-member", roleHandler('ADMIN'), addMember);
router.post("/get-user-orgs", getUserOrganizations);
router.post("/change-user-role", roleHandler('ADMIN'), changeUserRole);

module.exports = router;