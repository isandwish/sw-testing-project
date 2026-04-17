const express = require('express');
const router = express.Router();

const { usersDB } = require('../data/mockDB');


// =========================
// Get User Profile
// =========================
router.get('/profile', (req, res) => {
    // mock current user (temporary: first user in DB)
    const user = usersDB[0];

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