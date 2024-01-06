const dbPool = require("../db");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const responseUtil = require("../utils/response.util");

async function login(req, res) {
    const {
        user_name,
        password
    } = req.body;

    try {
        if (user_name !== "admin") throw new Error("user_name or password is incorrect");
        if (password !== "admin") throw new Error("user_name or password is incorrect");

        const twentyFourHours = 24 * 60 * 60 * 30;

        const token = jwt.sign({
                is_admin: true
            },
            config.get('SECRET_KEY'), {
                expiresIn: twentyFourHours
            }
        );
        res.json(responseUtil.success({data: {token}}));

    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}



module.exports = {
    login
};