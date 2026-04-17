// Reservation
// {
//   id,
//   userId,        // owner id
//   customerName,  // for walk-in / display
//   customerEmail, // optional but useful
//   tableId,
//   date,
//   time,
//   guestCount,
//   specialRequest,
//   status,
//   createdByRole  // customer / staff / admin
// }

const express = require('express');
const router = express.Router();

const { tablesDB, reservationsDB } = require('../data/mockDB');
const { verifyToken } = require('../middleware/auth.middleware');

// ------------------------------
// Helpers
// ------------------------------
function isTableAvailable(tableId, date, time) {
    return !reservationsDB.some(r =>
        r.tableId === tableId &&
        r.date === date &&
        r.time === time
    );
}

// ------------------------------
// FR-03 View Availability
// ------------------------------
router.get('/availability', (req, res) => {
    const { date, time, guestCount } = req.query;

    // Validate input
    if (!date || !time || !guestCount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const guests = Number(guestCount);

    if (guests < 1 || guests > 10) {
        return res.status(400).json({ error: 'Invalid guest count' });
    }

    // Filter tables by capacity
    const availableTables = tablesDB
        .filter(t => t.capacity >= guests)
        .filter(t => isTableAvailable(t.id, date, time));

    res.json({
        date,
        time,
        guestCount: guests,
        availableTables
    });
});

// ------------------------------
// FR-04 Make Reservation
// ------------------------------
router.post('/', verifyToken, (req, res) => {
    if (req.user.role !== 'customer') {
        return res.status(403).json({ error: 'Customers only' });
    }

    const { date, time, guestCount, specialRequest } = req.body;

    if (!date || !time || !guestCount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const table = tablesDB.find(t =>
        t.capacity >= guestCount && isTableAvailable(t.id, date, time)
    );

    if (!table) {
        return res.status(409).json({ error: 'No table available' });
    }

    const reservation = {
        id: Date.now(),
        userId: req.user.id,
        customerName: req.user.name || req.user.email,
        customerEmail: req.user.email,
        tableId: table.id,
        date,
        time,
        guestCount,
        specialRequest: specialRequest || null,
        status: 'CONFIRMED',
        createdByRole: req.user.role
    };

    reservationsDB.push(reservation);

    res.status(201).json(reservation);
});

// ------------------------------
// FR-06 Modify Reservation
// ------------------------------
router.put('/:id', verifyToken, (req, res) => {
    const id = Number(req.params.id);

    const reservation = reservationsDB.find(r => r.id === id);
    if (!reservation) {
        return res.status(404).json({ error: 'Not found' });
    }

    const isOwner = reservation.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    Object.assign(reservation, req.body);

    res.json({
        message: 'Updated',
        reservation
    });
});

// ------------------------------
// FR-07 Cancel Reservation
// ------------------------------
router.delete('/:id', verifyToken, (req, res) => {
    const id = Number(req.params.id);

    const index = reservationsDB.findIndex(r => r.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Not found' });
    }

    const reservation = reservationsDB[index];

    const isOwner = reservation.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    reservationsDB.splice(index, 1);

    res.json({ message: 'Deleted' });
});

// ------------------------------
// FR-11 Walk-in Reservation (Staff)
// ------------------------------
router.post('/walk-in', verifyToken, (req, res) => {
    if (!['staff', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { customerName, date, time, guestCount } = req.body;

    const table = tablesDB.find(t =>
        t.capacity >= guestCount && isTableAvailable(t.id, date, time)
    );

    if (!table) {
        return res.status(409).json({ error: 'No table available' });
    }

    const reservation = {
        id: Date.now(),
        userId: null,
        customerName,
        tableId: table.id,
        date,
        time,
        guestCount,
        status: 'CONFIRMED',
        createdByRole: req.user.role
    };

    reservationsDB.push(reservation);

    res.status(201).json(reservation);
});

// ------------------------------
// FR-10 View History (User scoped)
// ------------------------------
// ------------------------------
// FR-10 View Customer History
// ------------------------------
router.get('/history', verifyToken, (req, res) => {
    const { role, id } = req.user;

    // Allow only customer
    if (role !== 'customer') {
        return res.status(403).json({
            error: 'Access denied. Use admin API instead.'
        });
    }

    // Get only own reservations
    const result = reservationsDB.filter(r => r.userId === id);

    res.status(200).json({
        count: result.length,
        reservations: result
    });
});

// FR-12 Admin/Staff View All
router.get('/all', verifyToken, (req, res) => {
    if (!['staff', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(reservationsDB);
});

module.exports = router;