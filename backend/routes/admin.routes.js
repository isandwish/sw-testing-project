const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/auth.middleware');

// admin only
router.get('/reservations', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    res.json([{ reservationId: 5001, status: 'CONFIRMED' }]);
});

module.exports = router;