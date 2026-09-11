const pool = require('../config/db');

// GET /api/exhibitors/fee
// Public: the registration form calls this to display the current fee.
async function getExhibitorFee(req, res) {
    try {
        const result = await pool.query("SELECT value FROM settings WHERE key = 'exhibitor_fee'");

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Exhibitor fee has not been set yet' });
        }

        res.json({ fee: parseFloat(result.rows[0].value) });
    } catch (err) {
        console.error('Get exhibitor fee error:', err);
        res.status(500).json({ error: 'Something went wrong fetching the exhibitor fee' });
    }
}

// PATCH /api/admin/settings/exhibitor-fee
// Admin only: set or update the fee once it's decided.
async function setExhibitorFee(req, res) {
    const { fee } = req.body;

    if (fee === undefined || isNaN(fee)) {
        return res.status(400).json({ error: 'A numeric fee is required' });
    }

    try {
        await pool.query(
            `INSERT INTO settings (key, value, updated_at)
             VALUES ('exhibitor_fee', $1, NOW())
             ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
            [fee.toString()]
        );

        res.json({ message: 'Exhibitor fee updated', fee: parseFloat(fee) });
    } catch (err) {
        console.error('Set exhibitor fee error:', err);
        res.status(500).json({ error: 'Something went wrong updating the exhibitor fee' });
    }
}

module.exports = { getExhibitorFee, setExhibitorFee };
