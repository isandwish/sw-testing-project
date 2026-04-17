const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/auth.middleware');
const { restaurantDB, notificationsDB } = require('../data/mockDB');

// Admin: View Reservations
router.get('/reservations', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    res.json([
        { reservationId: 5001, status: 'CONFIRMED' }
    ]);
});

// FR-08: View Notifications
router.get('/notifications', verifyToken, (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    res.status(200).json({
        notifications: notificationsDB
    });
});

// FR-09 Update Table Status
router.put('/tables/:id/status', verifyToken, (req, res) => {
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const tableId = parseInt(req.params.id);
    const { status } = req.body;

    const validStatus = ['AVAILABLE', 'OCCUPIED', 'OUT_OF_SERVICE'];

    if (!validStatus.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    const table = tablesDB.find(t => t.id === tableId);

    if (!table) {
        return res.status(404).json({ error: 'Table not found' });
    }

    table.status = status;

    res.status(200).json({
        message: 'Table status updated',
        table
    });
});

// Get Restaurant Info
router.get('/restaurant', (req, res) => {
    res.status(200).json(restaurantDB);
});

// FR-12 Update Restaurant Info
router.put('/restaurant', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { name, openingHour, closingHour, contact } = req.body;

    // ---------- validation ----------
    if (name && name.length < 2) {
        return res.status(400).json({ error: 'Invalid restaurant name' });
    }

    if (openingHour && closingHour) {
        const open = parseInt(openingHour.split(':')[0]);
        const close = parseInt(closingHour.split(':')[0]);

        if (open >= close) {
            return res.status(400).json({ error: 'Invalid operating hours' });
        }
    }

    if (contact) {
        if (contact.phone && !/^[0-9]{10,15}$/.test(contact.phone)) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }
    }

    // ---------- update ----------
    if (name) restaurantDB.name = name;
    if (openingHour) restaurantDB.openingHour = openingHour;
    if (closingHour) restaurantDB.closingHour = closingHour;

    if (contact) {
        restaurantDB.contact = {
            ...restaurantDB.contact,
            ...contact
        };
    }

    res.status(200).json({
        message: 'Restaurant info updated',
        restaurant: restaurantDB
    });
});

module.exports = router;