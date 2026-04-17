const express = require('express');
const router = express.Router();

const { loginAttempts } = require('../data/mockDB');
const { validatePassword, detectSQLi } = require('../middleware/validate.middleware');

// register
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    if (detectSQLi(email)) {
        return res.status(400).json({ error: 'SQL Injection detected' });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ error: passwordError });
    }

    res.status(201).json({ message: 'Register success (mock)' });
});

// login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (detectSQLi(email) || detectSQLi(password)) {
        return res.status(400).json({ error: 'Invalid characters detected' });
    }

    if (loginAttempts[email] >= 3) {
        return res.status(429).json({ error: 'Too many attempts' });
    }

    if (email === "customer@test.com" && password === "P@ssw0rd123") {
        loginAttempts[email] = 0;
        return res.json({ message: 'Login success', token: 'mock-token' });
    }

    loginAttempts[email] = (loginAttempts[email] || 0) + 1;

    return res.status(401).json({
        error: 'Invalid credentials',
        attemptsLeft: 3 - loginAttempts[email]
    });
});

module.exports = router;