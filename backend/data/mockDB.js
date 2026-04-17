// mock database
const usersDB = [
    { id: 1, email: "admin@admin.com", passwordHash: "hashed_Admin1234", role: "admin" },
    { id: 2, email: "staff@staff.com", passwordHash: "hashed_Staff1234", role: "staff" },
    { id: 3, email: "customer@customer.com", passwordHash: "hashed_Customer1234", role: "customer" },
    { id: 4, email: "customer@test.com", passwordHash: "hashed_P@ssw0rd123", role: "customer" }
];

// tables
const tablesDB = [
    { id: 1, capacity: 2, status: 'AVAILABLE' },
    { id: 2, capacity: 4, status: 'AVAILABLE' },
    { id: 3, capacity: 4, status: 'AVAILABLE' },
    { id: 4, capacity: 6, status: 'AVAILABLE' }
];

// existing reservations (mock)
const reservationsDB = [];

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