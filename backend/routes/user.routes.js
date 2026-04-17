const express = require('express');
const router = express.Router();

const { usersDB } = require('../data/mockDB');

// profile
router.get('/profile', (req, res) => {
    res.json({
        id: usersDB[0].id,
        email: usersDB[0].email,
        role: usersDB[0].role
    });
});

module.exports = router;