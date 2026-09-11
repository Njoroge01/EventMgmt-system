require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const path = require('path');

const authRoutes = require('./routes/auth');
const participantRoutes = require('./routes/participants');
const exhibitorRoutes = require('./routes/exhibitors');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check - confirms the server is up AND the database connection works.
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'ok',
            message: 'Server is running and connected to the database',
            db_time: result.rows[0].now,
        });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({
            status: 'error',
            message: 'Server is running but could not connect to the database',
            error: err.message,
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/exhibitors', exhibitorRoutes);
app.use('/api/admin', adminRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
