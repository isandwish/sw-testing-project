const express = require('express');
const router = express.Router();

const { tablesDB, reservationsDB } = require('../data/mockDB');

function createNotification(type, reservation) {
    notificationsDB.push({
        id: Date.now(),
        type, // CREATED / UPDATED / CANCELLED
        reservationId: reservation.id,
        message: `Reservation ${type}`,
        createdAt: new Date()
    });
}

// FR-03 View Availability
router.get('/availability', (req, res) => {
    const { date, time, guestCount } = req.query;

    // ---------- validation ----------
    if (!date || !time || !guestCount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (guestCount < 1 || guestCount > 10) {
        return res.status(400).json({ error: 'Invalid guest count' });
    }

    // ---------- filter tables by capacity ----------
    const suitableTables = tablesDB.filter(
        table => table.capacity >= guestCount
    );

    // ---------- remove reserved tables ----------
    const availableTables = suitableTables.filter(table => {
        const isReserved = reservationsDB.some(r =>
            r.tableId === table.id &&
            r.date === date &&
            r.time === time
        );

        return !isReserved;
    });

    // ---------- response ----------
    res.status(200).json({
        date,
        time,
        guestCount,
        availableTables
    });
});

// FR-04 Make Reservation
router.post('/', (req, res) => {
    const { date, time, guestCount, specialRequest } = req.body;

    // ---------- required ----------
    if (!date || !time || !guestCount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // ---------- guest count ----------
    if (guestCount < 1 || guestCount > 10) {
        return res.status(400).json({ error: 'Invalid guest count' });
    }

    // ---------- future date ----------
    const now = new Date();
    const inputDateTime = new Date(`${date}T${time}:00`);

    if (inputDateTime <= now) {
        return res.status(400).json({ error: 'Reservation must be in the future' });
    }

    // ---------- restaurant hours ----------
    const hour = parseInt(time.split(':')[0]);
    if (hour < 10 || hour >= 22) {
        return res.status(400).json({ error: 'Outside operating hours' });
    }

    // ---------- special request ----------
    if (specialRequest && specialRequest.length > 200) {
        return res.status(400).json({ error: 'Special request too long' });
    }

    // ---------- find suitable tables ----------
    const suitableTables = tablesDB.filter(
        t => t.capacity >= guestCount
    );

    // ---------- find available table ----------
    const availableTable = suitableTables.find(table => {
        const isReserved = reservationsDB.some(r =>
            r.tableId === table.id &&
            r.date === date &&
            r.time === time
        );

        return !isReserved;
    });

    if (!availableTable) {
        return res.status(409).json({ error: 'Table not available' });
    }

    // ---------- create reservation ----------
    const newReservation = {
        id: Date.now(),
        tableId: availableTable.id,
        date,
        time,
        guestCount,
        specialRequest: specialRequest || null,
        status: 'CONFIRMED'
    };

    reservationsDB.push(newReservation);

    // ---------- response ----------
    // FR-05 Reservation Confirmation
    res.status(201).json({
        reservationId: newReservation.id,
        status: newReservation.status
    });
    
    createNotification('CREATED', newReservation);
});

// FR-06 Modify Reservation
router.put('/:id', (req, res) => {
    const reservationId = parseInt(req.params.id);
    const { date, time, guestCount, specialRequest } = req.body;

    const reservation = reservationsDB.find(r => r.id === reservationId);

    if (!reservation) {
        return res.status(404).json({ error: 'Reservation not found' });
    }

    // ---------- check time (must be before reservation time) ----------
    const now = new Date();
    const reservationDateTime = new Date(`${reservation.date}T${reservation.time}:00`);

    if (now >= reservationDateTime) {
        return res.status(400).json({ error: 'Cannot modify past reservation' });
    }

    // ---------- reuse validation ----------
    if (guestCount && (guestCount < 1 || guestCount > 10)) {
        return res.status(400).json({ error: 'Invalid guest count' });
    }

    // ---------- check new table availability ----------
    if (date && time && guestCount) {
        const suitableTables = tablesDB.filter(t => t.capacity >= guestCount);

        const availableTable = suitableTables.find(table => {
            const isReserved = reservationsDB.some(r =>
                r.tableId === table.id &&
                r.date === date &&
                r.time === time &&
                r.id !== reservationId // exclude itself
            );

            const isUnavailable = table.status !== 'AVAILABLE';

            return !isReserved && !isUnavailable;
        });

        if (!availableTable) {
            return res.status(409).json({ error: 'Table not available' });
        }

        reservation.tableId = availableTable.id;
    }

    // ---------- update fields ----------
    if (date) reservation.date = date;
    if (time) reservation.time = time;
    if (guestCount) reservation.guestCount = guestCount;
    if (specialRequest !== undefined) reservation.specialRequest = specialRequest;

    res.status(200).json({
        message: 'Reservation updated',
        reservation
    });

    createNotification('UPDATED', reservation);
});

// FR-07 Cancel Reservation
router.delete('/:id', (req, res) => {
    const reservationId = parseInt(req.params.id);

    const index = reservationsDB.findIndex(r => r.id === reservationId);

    if (index === -1) {
        return res.status(404).json({ error: 'Reservation not found' });
    }

    const reservation = reservationsDB[index];

    // ---------- check 1 hour before ----------
    const now = new Date();
    const reservationDateTime = new Date(`${reservation.date}T${reservation.time}:00`);

    const diffMs = reservationDateTime - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) {
        return res.status(400).json({
            error: 'Cannot cancel less than 1 hour before reservation'
        });
    }

    // ---------- remove reservation ----------
    reservationsDB.splice(index, 1);

    res.status(200).json({
        message: 'Reservation cancelled'
    });
    
    createNotification('CANCELLED', reservation);
});

// FR-11 Walk-in Reservation (Staff)
router.post('/walk-in', verifyToken, (req, res) => {
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { customerName, date, time, guestCount, specialRequest } = req.body;

    // ---------- required ----------
    if (!customerName || !date || !time || !guestCount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // ---------- guest count ----------
    if (guestCount < 1 || guestCount > 10) {
        return res.status(400).json({ error: 'Invalid guest count' });
    }

    // ---------- restaurant hours ----------
    const hour = parseInt(time.split(':')[0]);
    if (hour < 10 || hour >= 22) {
        return res.status(400).json({ error: 'Outside operating hours' });
    }

    // ---------- find table ----------
    const suitableTables = tablesDB.filter(
        t => t.capacity >= guestCount
    );

    const availableTable = suitableTables.find(table => {
        const isReserved = reservationsDB.some(r =>
            r.tableId === table.id &&
            r.date === date &&
            r.time === time
        );

        const isUnavailable = table.status !== 'AVAILABLE';

        return !isReserved && !isUnavailable;
    });

    if (!availableTable) {
        return res.status(409).json({ error: 'Table not available' });
    }

    // ---------- create reservation ----------
    const newReservation = {
        id: Date.now(),
        tableId: availableTable.id,
        customerName,
        date,
        time,
        guestCount,
        specialRequest: specialRequest || null,
        status: 'CONFIRMED',
        createdBy: 'staff'
    };

    reservationsDB.push(newReservation);

    // ---------- notification ----------
    createNotification('CREATED', newReservation);

    res.status(201).json({
        reservationId: newReservation.id,
        status: newReservation.status
    });
});

module.exports = router;