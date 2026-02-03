const { register } = require("../controllers/auth.controller");
const { login } = require("../controllers/auth.controller");
const { logout } = require("../controllers/auth.controller");
const authValidator = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");

const router = require("express").Router();
router.use(validate);

router.post("/register", authValidator.register, register);
router.post("/login", authValidator.login, login);
router.post("/logout", logout);

module.exports = router;
