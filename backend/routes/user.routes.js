const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/auth.middleware');


// =========================
// Get User Profile
// =========================
router.get('/profile', verifyToken, (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
        id: user.id,
        email: user.email,
        role: user.role
    });
});

module.exports = router;