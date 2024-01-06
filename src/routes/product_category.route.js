const express = require("express");
const router = express.Router();
const token = require("../middleware/tokenLogin");
const categoryController = require("../controllers/product_category.controller");


router.get("/", token.admin_verify, categoryController.getCategory);
router.post("/", token.admin_verify, categoryController.createCategory);
router.delete("/:id", token.admin_verify, categoryController.removeCategory);

module.exports = router;