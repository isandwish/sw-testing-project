const express = require('express');
const router = express.Router();

const { restaurantDB } = require('../data/mockDB');


// =========================
// Get Restaurant Info (Public)
// =========================
router.get('/restaurant', (req, res) => {
    res.status(200).json(restaurantDB);
});

module.exports = router;