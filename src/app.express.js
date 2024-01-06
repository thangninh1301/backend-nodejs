const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const config = require("config");

const accountsRoute = require("./routes/accounts.route");
const adminRoute = require("./routes/admin.route");
const productCategoryRoute = require("./routes/product_category.route");
const productRoute = require("./routes/product.route");
const cartRoute = require("./routes/cart.route");
const cors = require('cors')

const appExpress = express();
// framework

appExpress.use(bodyParser.json());
appExpress.use(bodyParser.urlencoded({extended: false}));
appExpress.use(morgan('combined'));
appExpress.use(cors());

//main routing
appExpress.use("/api/v1/users/", accountsRoute);
appExpress.use("/api/v1/admin/", adminRoute);
appExpress.use("/api/v1/product/", productRoute);
appExpress.use("/api/v1/cart/", cartRoute);


appExpress.use("/api/v1", (req, res) => {
    res.send("ddl-backend");
});

module.exports = appExpress;