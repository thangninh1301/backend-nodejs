const express = require("express");
const router = express.Router();
const token = require("../middleware/tokenLogin");
const pictureController = require("../controllers/picture.controller");
const pictureMiddleware = require("../middleware/picture")

router.post("/",pictureMiddleware.upload.single('image'), pictureController.upload);


module.exports = router;