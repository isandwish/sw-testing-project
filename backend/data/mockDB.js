// mock database
const usersDB = [
    { id: 1, email: "customer@test.com", passwordHash: "hashed_P@ssw0rd123", role: "customer" }
];

// tables
const tablesDB = [
    { id: 1, capacity: 2, status: 'AVAILABLE' },
    { id: 2, capacity: 4, status: 'AVAILABLE' },
    { id: 3, capacity: 4, status: 'AVAILABLE' },
    { id: 4, capacity: 6, status: 'AVAILABLE' }
];

// existing reservations (mock)
const reservationsDB = [
    {
        id: 1001,
        tableId: 2,
        date: "2026-05-20",
        time: "18:00",
        guestCount: 4
    }
];

const notificationsDB = [];

const restaurantDB = {
    name: "My Restaurant",
    openingHour: "10:00",
    closingHour: "22:00",
    contact: {
        phone: "0812345678",
        email: "contact@restaurant.com"
    }
};

const loginAttempts = {};

module.exports = {
    usersDB,
    tablesDB,
    reservationsDB,
    notificationsDB,
    restaurantDB,
    loginAttempts
};