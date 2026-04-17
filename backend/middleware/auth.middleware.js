const jwt = require('jsonwebtoken');

const SECRET_KEY = "super-secret-key-for-restaurants";

// verify JWT
function verifyToken(req, res, next) {
    const auth = req.headers.authorization;

    // 👉 MOCK MODE: ถ้าไม่มี token ก็ปล่อยผ่าน
    if (!auth) {
        req.user = {
            id: 1,
            role: "customer"
        };
        return next();
    }

    req.user = {
        id: 1,
        role: "customer"
    };

    next();
}

module.exports = { verifyToken, SECRET_KEY };