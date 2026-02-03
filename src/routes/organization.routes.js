const {
  createOrganization,
} = require("../controllers/organization.controller");
const { addMember } = require("../controllers/organization.controller");
const {
  getUserOrganizations,
} = require("../controllers/organization.controller");
const { changeUserRole } = require("../controllers/organization.controller");
const orgValidator = require("../validators/organization.validator");
const validate = require("../middlewares/validate.middleware");
const authHandler = require("../middlewares/auth.middleware");

const router = require("express").Router();
router.use(validate);
router.use(authHandler);

router.post("/create", orgValidator.createOrganization, createOrganization);
router.post("/add-member", orgValidator.addMember, addMember);
router.post(
  "/get-user-orgs",
  orgValidator.getUserOrganizations,
  getUserOrganizations,
);
router.post("/change-user-role", orgValidator.changeUserRole, changeUserRole);

module.exports = router;
