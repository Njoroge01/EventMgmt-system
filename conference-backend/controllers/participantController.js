const pool = require('../config/db');
const { sendPaymentReceivedEmail, sendPaymentConfirmedEmail } = require('../services/emailService');
// POST /api/participants
// Public: anyone registering picks a category and fills that category's fields.
async function register(req, res) {
    const {
        id_passport,
        full_name,
        email,
        phone,
        country,
        organization,
        position,
        category_id,
        answers,
    } = req.body;

    if (!id_passport || !full_name || !email || !phone || !category_id) {
        return res
            .status(400)
            .json({ error: 'id_passport, full_name, email, phone, and category_id are required' });
    }

    try {
        const category = await pool.query(
            'SELECT * FROM participant_categories WHERE id = $1',
            [category_id]
        );

        if (category.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid category_id' });
        }

        const result = await pool.query(
            `INSERT INTO participants
                (id_passport, full_name, email, phone, country, organization, position, category_id, answers)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id, full_name, email, status, created_at`,
            [
                id_passport,
                full_name,
                email,
                phone,
                country || null,
                organization || null,
                position || null,
                category_id,
                answers || {},
            ]
        );

        res.status(201).json({
            message: 'Registration received and pending verification',
            participant: result.rows[0],
            amount_due: category.rows[0].price,
        });
    } catch (err) {
        console.error('Participant registration error:', err);
        res.status(500).json({ error: 'Something went wrong during registration' });
    }
}
// GET /api/admin/participants?status=pending
// Admin only: list registrations, optionally filtered by status.
async function list(req, res) {
    const { status } = req.query;

    try {
        const query = status
            ? 'SELECT * FROM participants WHERE status = $1 ORDER BY created_at DESC'
            : 'SELECT * FROM participants ORDER BY created_at DESC';
        const params = status ? [status] : [];

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('List participants error:', err);
        res.status(500).json({ error: 'Something went wrong fetching participants' });
    }
}

// PATCH /api/participants/:id/submit-payment
// Public: registrant reports their M-Pesa/bank payment reference after paying.
// This does NOT confirm payment - just acknowledges we received the reference.
async function submitPayment(req, res) {
    const { id } = req.params;
    const { payment_reference } = req.body;

    if (!payment_reference) {
        return res.status(400).json({ error: 'payment_reference is required' });
    }

    try {
        const updated = await pool.query(
            `UPDATE participants
             SET status = 'payment_submitted', payment_reference = $1
             WHERE id = $2 RETURNING *`,
            [payment_reference, id]
        );

        if (updated.rows.length === 0) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        sendPaymentReceivedEmail(
            updated.rows[0].email,
            updated.rows[0].full_name,
            'participant'
        ).catch((err) => console.error('Failed to send payment-received email:', err));

        res.json({
            message: 'Payment reference received. We will confirm shortly.',
            participant: updated.rows[0],
        });
    } catch (err) {
        console.error('Submit payment error:', err);
        res.status(500).json({ error: 'Something went wrong submitting payment' });
    }
}

// PATCH /api/admin/participants/:id/verify
// Admin only: confirms the payment actually landed (checked against the
// paybill/bank statement), flips status to verified. No ticket is issued -
// tickets are handed out at the gate by looking up the confirmed record.
async function verify(req, res) {
    const { id } = req.params;
    const { payment_reference } = req.body; // optional manual override

    try {
        const existing = await pool.query('SELECT payment_reference FROM participants WHERE id = $1', [id]);

        if (existing.rows.length === 0) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        const finalReference = payment_reference || existing.rows[0].payment_reference;

        const updated = await pool.query(
            `UPDATE participants
             SET status = 'verified', payment_reference = $1
             WHERE id = $2 RETURNING *`,
            [finalReference || null, id]
        );

        sendPaymentConfirmedEmail(
            updated.rows[0].email,
            updated.rows[0].full_name,
            'participant'
        ).catch((err) => console.error('Failed to send payment-confirmed email:', err));

        res.json({ participant: updated.rows[0] });
    } catch (err) {
        console.error('Verify participant error:', err);
        res.status(500).json({ error: 'Something went wrong during verification' });
    }
}

// PATCH /api/admin/participants/:id/reject
async function reject(req, res) {
    const { id } = req.params;

    try {
        const updated = await pool.query(
            `UPDATE participants SET status = 'rejected' WHERE id = $1 RETURNING *`,
            [id]
        );

        if (updated.rows.length === 0) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        res.json({ participant: updated.rows[0] });
    } catch (err) {
        console.error('Reject participant error:', err);
        res.status(500).json({ error: 'Something went wrong during rejection' });
    }
}

module.exports = { register, list, submitPayment, verify, reject };
