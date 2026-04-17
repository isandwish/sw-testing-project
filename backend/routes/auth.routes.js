const express = require('express');
const router = express.Router();

const { usersDB } = require('../data/mockDB');
const {
    validatePassword,
    detectSQLi
} = require('../middleware/validate.middleware');


// =========================
// Helpers
// =========================
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
    return emailRegex.test(email);
}

function isValidFullName(fullName) {
    return /^[A-Za-z ]{2,60}$/.test(fullName);
}

function isValidPhone(phoneNumber) {
    return /^[0-9]{10,15}$/.test(phoneNumber);
}


// =========================
// FR-01 Registration
// =========================
router.post('/register', (req, res) => {
    const { fullName, email, password, phoneNumber } = req.body;

    // ---- Email validation ----
    if (!email || email.length < 5 || email.length > 100) {
        return res.status(400).json({ error: 'Invalid email length' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    if (detectSQLi(email)) {
        return res.status(400).json({ error: 'Invalid characters in email' });
    }

    const exists = usersDB.find(u => u.email === email);
    if (exists) {
        return res.status(409).json({ error: 'Email already exists' });
    }

    // ---- Password validation ----
    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ error: passwordError });
    }

    // ---- Full name validation ----
    if (!fullName || !isValidFullName(fullName)) {
        return res.status(400).json({ error: 'Invalid full name' });
    }

    // ---- Phone validation ----
    if (phoneNumber && !isValidPhone(phoneNumber)) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }

    // ---- Create user ----
    const newUser = {
        id: Date.now(),
        fullName,
        email,
        passwordHash: `hashed_${password}`,
        phoneNumber: phoneNumber || null,
        role: 'customer'
    };

    usersDB.push(newUser);

    // ---- Response ----
    res.status(201).json({
        userId: newUser.id,
        message: 'Registration successful'
    });
});


// =========================
// FR-02 Login
// =========================
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // ---- Basic validation ----
    if (!email || !password) {
        return res.status(400).json({
            error: 'Email and password are required'
        });
    }

    // ---- Security check ----
    if (detectSQLi(email) || detectSQLi(password)) {
        return res.status(400).json({
            error: 'Invalid characters detected'
        });
    }

    // ---- Find user ----
    const user = usersDB.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ---- Password check (mock) ----
    const hashedInput = `hashed_${password}`;

    if (user.passwordHash !== hashedInput) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ---- Success response ----
    return res.status(200).json({
        token: 'mock-jwt-token',
        role: user.role,
        name: user.fullName,
        email: user.email
    });
});

module.exports = router;