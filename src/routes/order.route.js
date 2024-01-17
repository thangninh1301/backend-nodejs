const express = require("express");
const router = express.Router();
const token = require("../middleware/tokenLogin");
const orderController = require("../controllers/order.controller");

router.post("/",token.verify, orderController.createOrder);
router.get("/:id",token.verify, orderController.getOrder);
router.get("/",token.verify, orderController.getAllOrder);
module.exports = router;