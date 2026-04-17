const jwt = require('jsonwebtoken');

const SECRET_KEY = "super-secret-key-for-restaurants";

// verify JWT
function verifyToken(req, res, next) {
    const role = req.headers["x-role"];
    const userId = req.headers["x-user-id"];
    const email = req.headers["x-email"];

    if (!role) {
        return res.status(401).json({ error: "Missing role" });
    }

    req.user = {
        role,
        userId: userId || null,
        email: email || null
    };

    next();
}

module.exports = { verifyToken, SECRET_KEY };