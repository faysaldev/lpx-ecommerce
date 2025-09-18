const express = require("express");
const auth = require("../../middlewares/auth");
const { transactionController } = require("../../controllers");

const router = express.Router();

router
  .route("/my-transaction")
  .get(auth("common"), transactionController.myTransaction);

module.exports = router;
