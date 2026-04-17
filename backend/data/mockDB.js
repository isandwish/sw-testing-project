// mock database
const usersDB = [
    { id: 1, email: "customer@test.com", passwordHash: "hashed_P@ssw0rd123", role: "customer" }
];

const loginAttempts = {};

module.exports = { usersDB, loginAttempts };