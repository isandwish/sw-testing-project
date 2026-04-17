const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

// API prefix
app.use('/api', require('./routes/public.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/reservations', require('./routes/reservation.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/users', require('./routes/user.routes'));

app.listen(5000, () => {
    console.log('Mock API running on http://localhost:5000');
});