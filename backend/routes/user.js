const express = require ("express");
const userController = require("../controllers/user");
const router = express.Router();


router.use(express.json());
router.post("/signup", userController.signup);
router.post("/login", userController.login);

module.exports = router;