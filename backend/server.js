const express = require('express');
const app = express();

app.use(express.json());

// import routes
app.use('', require('./routes/public.routes'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/reservations', require('./routes/reservation.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/users', require('./routes/user.routes'));

app.listen(5000, () => {
    console.log('Mock API running on http://localhost:5000');
});