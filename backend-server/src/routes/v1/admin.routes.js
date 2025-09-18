const express = require("express");
const auth = require("../../middlewares/auth");
const { adminController } = require("../../controllers");

const router = express.Router();

router.route("/all-users").get(auth("common"), adminController.getAllUsers);

module.exports = router;
