const { sqlInjectionRegex, xssRegex } = require('../utils/regex');

// password policy
function validatePassword(password) {
    if (!password) return "Password is required";
    if (password.length < 8) return "Min 8 characters";
    if (password.length > 20) return "Max 20 characters";
    if (!/[A-Z]/.test(password)) return "Need uppercase letter";
    if (!/\d/.test(password)) return "Need number";
    return null;
}

// SQLi check
function detectSQLi(input) {
    return sqlInjectionRegex.test(input);
}

// XSS check
function detectXSS(input) {
    return xssRegex.test(input);
}

module.exports = { validatePassword, detectSQLi, detectXSS };