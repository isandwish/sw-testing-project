const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/auth.middleware');
const { 
  restaurantDB, 
  notificationsDB, 
  tablesDB,
  reservationsDB 
} = require('../data/mockDB');


// =========================
// Constants / Helpers
// =========================
const VALID_TABLE_STATUS = ['AVAILABLE', 'OCCUPIED', 'OUT_OF_SERVICE'];

const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) =>
    /^[0-9]{10,15}$/.test(phone);

const isAdminOrStaff = (role) =>
    ['admin', 'staff'].includes(role);

const isAdmin = (role) => role === 'admin';

// =========================
// View Reservations (Admin + Staff)
// =========================
router.get('/reservations', verifyToken, (req, res) => {
    if (!isAdminOrStaff(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const result = (reservationsDB || []).map(r => ({
        id: r.id,
        tableId: r.tableId,
        date: r.date,
        time: r.time,
        guestCount: r.guestCount,
        status: r.status,
        createdByRole: r.createdByRole,

        // customer info (supports walk-in)
        customer: {
            userId: r.userId || null,
            fullName: r.customerName || null,
            email: r.customerEmail || null,
            phoneNumber: r.customerPhone || null
        }
    }));

    res.status(200).json({
        count: result.length,
        reservations: result
    });
});

// =========================
// FR-08 View Notifications (Admin + Staff)
// =========================
router.get('/notifications', verifyToken, (req, res) => {
    if (!isAdminOrStaff(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    res.status(200).json({
        notifications: notificationsDB
    });
});


// =========================
// FR-09 Update Table Status (Admin + Staff)
// =========================
router.put('/tables/:id/status', verifyToken, (req, res) => {
    if (!isAdminOrStaff(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const tableId = Number(req.params.id);
    const { status } = req.body;

    if (!VALID_TABLE_STATUS.includes(status)) {
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

// =========================
// FR-12 Update Restaurant Info (Admin only)
// =========================
router.put('/restaurant', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { name, openingHour, closingHour, contact } = req.body;

    // ---- Validation ----
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
        if (contact.phone && !isValidPhone(contact.phone)) {
            return res.status(400).json({ error: 'Invalid phone number' });
        }

        if (contact.email && !isValidEmail(contact.email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }
    }

    // ---- Update ----
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

// Tables
router.get('/tables', verifyToken, (req, res) => {
    if (!isAdminOrStaff(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    res.status(200).json({
        count: tablesDB.length,
        tables: tablesDB
    });
});

router.post('/tables', verifyToken, (req, res) => {
    if (!isAdmin(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { capacity, status } = req.body;

    if (!capacity) {
        return res.status(400).json({ error: 'Capacity is required' });
    }

    const newTable = {
        id: Date.now(),
        capacity,
        status: status || 'AVAILABLE'
    };

    tablesDB.push(newTable);

    res.status(201).json({
        message: 'Table created',
        table: newTable
    });
});

router.put('/tables/:id', verifyToken, (req, res) => {
    if (!isAdmin(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const tableId = Number(req.params.id);
    const table = tablesDB.find(t => t.id === tableId);

    if (!table) {
        return res.status(404).json({ error: 'Table not found' });
    }

    const { capacity, status } = req.body;

    if (capacity !== undefined) table.capacity = capacity;
    if (status && VALID_TABLE_STATUS.includes(status)) {
        table.status = status;
    }

    res.status(200).json({
        message: 'Table updated',
        table
    });
});

router.delete('/tables/:id', verifyToken, (req, res) => {
    if (!isAdmin(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const tableId = Number(req.params.id);
    const index = tablesDB.findIndex(t => t.id === tableId);

    if (index === -1) {
        return res.status(404).json({ error: 'Table not found' });
    }

    const deleted = tablesDB.splice(index, 1);

    res.status(200).json({
        message: 'Table deleted',
        table: deleted[0]
    });
});

module.exports = router;