const app = require("./app.express");
const server = require("http").createServer(app);
const config = require("config");
const jwt = require("jsonwebtoken");
const dbPool = require("./db");

const port = config.get("port");
const spaceSecretKey = config.get("SPACE_SECRET_KEY");



server.listen(port,'0.0.0.0', () => {
    console.log("server is running on port: ", port);
});

module.exports = server;