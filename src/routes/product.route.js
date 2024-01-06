const express = require("express");
const router = express.Router();
const token = require("../middleware/tokenLogin");
const productController = require("../controllers/product.controller");

router.get("/details", productController.getProductDetail);
router.post("/", productController.createProduct);
router.get("/:id", productController.getProduct);
router.get("/", productController.getAllProduct);

module.exports = router;