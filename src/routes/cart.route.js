const express = require("express");
const router = express.Router();
const token = require("../middleware/tokenLogin");
const cartController = require("../controllers/cart.controller");

router.post("/",token.verify, cartController.createCart);
router.delete("/:id",token.verify, cartController.deleteCart);
router.get("/",token.verify, cartController.getAllCart);

module.exports = router;