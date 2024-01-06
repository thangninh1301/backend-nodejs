const dbPool = require("../db");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const responseUtil = require("../utils/response.util");

async function searchAccounts(req, res) {
    try {
        const {keywords} = req.query;
        const [users] = await dbPool.query(`SELECT users.user_name, users.id from users
                                             where MATCH(user_name)
                                             AGAINST('+${keywords}*' IN boolean MODE)
                                             limit 6`);
        res.send(responseUtil.success({data: {users}}));
    } catch (err) {
        res.send(responseUtil.fail({reason: err.message}))
    }
}


// jwt
async function login(req, res) {
    const {
        user_name,
        password
    } = req.body;

    try {
        let [user] = await dbPool.query(`select * from users where user_name = "${user_name}"`);

        if (!user.length) throw new Error("user_name or password is incorrect");
        user = user[0];
        const hashPassword = user.password;
        const checkPass = bcrypt.compareSync(password, hashPassword);

        if (!checkPass) throw new Error("user_name or password is incorrect");

        const twentyFourHours = 24 * 60 * 60 * 30;

        const token = jwt.sign({
                id: user.id,
                email: user.email
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

async function register(req, res) {
    const {
        user_name,
        password
    } = req.body;

    try {
        if (user_name.length < 8) throw new Error("user_name must greater than 8 characters");
        if (password.length < 8) throw new Error("password must greater than 8 characters");

        const [existUsers] = await dbPool.query(`select * from users where user_name = "${user_name}"`);
        if (existUsers.length) throw new Error("user_name existed");
        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(password, salt);
        await dbPool.query(`insert into users (user_name, password) 
        values ("${user_name}", "${hashPassword}")`);

        res.json(responseUtil.success({data: {}}))

    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}



async function changeNewPassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    try {
        const {id} = req.tokenData;
        if(!oldPassword) throw new Error("oldPassword fields is missing");
        if(!newPassword) throw new Error("newPassword fields is missing");
        if (newPassword.length < 8) throw new Error("password must greater than 8 characters");
        let salt = await bcrypt.genSalt(10);
        const [userInformation] = await dbPool.query(`select * from users where id = ${id}`);
        const validatePW = await bcrypt.compare( oldPassword, userInformation[0].password);
        if(!validatePW) throw new Error("oldPassword is wrong");
        let hashPassword = await bcrypt.hash(newPassword, salt);
        await dbPool.query(`update users set password = "${hashPassword}" where id = ${id}`);
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    searchAccounts,
    register,
    login,
    changeNewPassword
};