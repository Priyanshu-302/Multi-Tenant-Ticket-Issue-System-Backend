const { register } = require("../controllers/auth.controller");
const { login } = require("../controllers/auth.controller");
const { logout } = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
