const express = require('express');
const router = express.Router();

const { detectXSS } = require('../middleware/validate.middleware');

// create reservation
router.post('/', (req, res) => {
    const { specialRequest } = req.body;

    if (specialRequest && detectXSS(specialRequest)) {
        return res.status(400).json({ error: 'XSS detected' });
    }

    res.status(201).json({ message: 'Reservation created' });
});

module.exports = router;