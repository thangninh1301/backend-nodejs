const express = require("express");
const router = express.Router();
const token = require("../middleware/tokenLogin");
const adminController = require("../controllers/admin.controller");
const adminOrderController = require("../controllers/adminorder.controller");
router.post("/login", adminController.login);
router.get("/order",token.admin_verify, adminOrderController.getAllOrder);

module.exports = router;