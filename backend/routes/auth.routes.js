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
// Rate Limit Store
// =========================
const loginAttempts = new Map();
// โครงสร้าง: key = email → { count, lockedUntil }

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // ล็อก 15 นาที

function getRateLimit(email) {
    return loginAttempts.get(email) || { count: 0, lockedUntil: null };
}

function recordFailedAttempt(email) {
    const record = getRateLimit(email);
    record.count += 1;

    if (record.count >= MAX_ATTEMPTS) {
        record.lockedUntil = Date.now() + LOCK_DURATION_MS;
    }

    loginAttempts.set(email, record);
}

function resetAttempts(email) {
    loginAttempts.delete(email);
}

function isLocked(email) {
    const record = getRateLimit(email);

    if (!record.lockedUntil) return false;

    // หมดเวลาล็อกแล้ว → รีเซ็ตอัตโนมัติ
    if (Date.now() > record.lockedUntil) {
        resetAttempts(email);
        return false;
    }

    return true;
}

function getRemainingLockTime(email) {
    const record = getRateLimit(email);
    if (!record.lockedUntil) return 0;
    return Math.ceil((record.lockedUntil - Date.now()) / 1000); // หน่วยวินาที
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

    // ---- Rate limit check ----
    if (isLocked(email)) {
        const remaining = getRemainingLockTime(email);
        return res.status(429).json({
            error: `Too many failed attempts. Please try again in ${remaining} seconds.`
        });
    }

    // ---- Find user ----
    const user = usersDB.find(u => u.email === email);

    if (!user) {
        recordFailedAttempt(email);        // ← นับครั้งด้วย
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ---- Password check ----
    const hashedInput = `hashed_${password}`;

    if (user.passwordHash !== hashedInput) {
        recordFailedAttempt(email);        // ← นับครั้งด้วย

        const record = getRateLimit(email);
        const attemptsLeft = MAX_ATTEMPTS - record.count;

        if (attemptsLeft <= 0) {
            const remaining = getRemainingLockTime(email);
            return res.status(429).json({
                error: `Too many failed attempts. Locked for ${remaining} seconds.`
            });
        }

        return res.status(401).json({
            error: `Invalid credentials. ${attemptsLeft} attempt(s) remaining.`
        });
    }

    // ---- Login สำเร็จ → รีเซ็ต counter ----
    resetAttempts(email);

    return res.status(200).json({
        token: 'mock-jwt-token',
        role: user.role,
        name: user.fullName,
        email: user.email
    });
});

module.exports = router;