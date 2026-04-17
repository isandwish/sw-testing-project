// simple attack patterns
const sqlInjectionRegex = /'|"|;|--|\b(OR|AND|SELECT|DROP|INSERT|UPDATE)\b/i;
const xssRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<img|onerror|onload/i;

module.exports = { sqlInjectionRegex, xssRegex };