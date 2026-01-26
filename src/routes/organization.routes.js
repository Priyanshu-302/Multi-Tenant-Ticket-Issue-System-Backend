const {
  createOrganization,
} = require("../controllers/organization.controller");
const { addMember } = require("../controllers/organization.controller");
const {
  getUserOrganizations,
} = require("../controllers/organization.controller");
const { changeUserRole } = require("../controllers/organization.controller");
const authHandler = require("../middlewares/auth.middleware");

const router = require("express").Router();
router.use(authHandler);

router.post("/create", createOrganization);
router.post("/add-member", addMember);
router.post("/get-user-orgs", getUserOrganizations);
router.post("/change-user-role", changeUserRole);

module.exports = router;
