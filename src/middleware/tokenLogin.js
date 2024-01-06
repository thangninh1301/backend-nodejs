const jwt = require('jsonwebtoken');
const secretKey = require('config').get("SECRET_KEY");

function verify(req, res, next) {
    const token = req.headers['token'];
    if (!token) {
        return res.status(403).json({
            success: false,
            reason: "token is missing or invalid",
        })
    }
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    status: 101,
                    reason: "token is missing or invalid"
                });
            } else {
                req.tokenData = decoded;
                next();
            }
        })
    } else {
        return res.status(403).json({
            success: false,
            reason: "token is missing or invalid",
        })
    }
}

function admin_verify(req, res, next) {
    const token = req.headers['token'];
    if (!token) {
        return res.status(403).json({
            success: false,
            reason: "token is missing or invalid",
        })
    }
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    status: 401,
                    reason: "token is missing or invalid"
                });
            } else {
                req.tokenData = decoded;
                if (!req.tokenData.is_admin) {
                    return res.json({
                        success: false,
                        status: 401,
                        reason: "unauthorized"
                    });
                }
                next();
            }
        })

    }
}



module.exports = {verify, admin_verify};