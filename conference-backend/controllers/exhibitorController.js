const pool = require('../config/db');
const { sendPaymentReceivedEmail, sendPaymentConfirmedEmail } = require('../services/emailService');
// POST /api/exhibitors
async function register(req, res) {
    const {
        id_passport,
        full_name,
        email,
        phone,
        organization,
        address,
        country,
        description,
        payment_method,
        website_link,
    } = req.body;

    if (
        !id_passport ||
        !full_name ||
        !email ||
        !phone ||
        !organization ||
        !address ||
        !country ||
        !description ||
        !payment_method
    ) {
        return res.status(400).json({
            error:
                'id_passport, full_name, email, phone, organization, address, country, description, and payment_method are required',
        });
    }

    if (!['mpesa', 'bank'].includes(payment_method.toLowerCase())) {
        return res.status(400).json({ error: "payment_method must be 'mpesa' or 'bank'" });
    }

    try {
        const feeResult = await pool.query(
            "SELECT value FROM settings WHERE key = 'exhibitor_fee'"
        );

        if (feeResult.rows.length === 0) {
            return res.status(400).json({
                error:
                    'Exhibitor registration is not open yet - the fee has not been set. Contact the conference admin.',
            });
        }

        const fee = parseFloat(feeResult.rows[0].value);

        const result = await pool.query(
            `INSERT INTO exhibitors
                (id_passport, full_name, email, phone, organization, address, country, description,
                 payment_method, website_link, price)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING id, full_name, email, status, created_at`,
            [
                id_passport,
                full_name,
                email,
                phone,
                organization,
                address,
                country,
                description,
                payment_method.toLowerCase(),
                website_link || null,
                fee,
            ]
        );

        res.status(201).json({
            message: 'Registration received and pending verification',
            exhibitor: result.rows[0],
            amount_due: fee,
        });
    } catch (err) {
        console.error('Exhibitor registration error:', err);
        res.status(500).json({ error: 'Something went wrong during registration' });
    }
}

// GET /api/admin/exhibitors?status=pending
async function list(req, res) {
    const { status } = req.query;

    try {
        const query = status
            ? 'SELECT * FROM exhibitors WHERE status = $1 ORDER BY created_at DESC'
            : 'SELECT * FROM exhibitors ORDER BY created_at DESC';
        const params = status ? [status] : [];

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('List exhibitors error:', err);
        res.status(500).json({ error: 'Something went wrong fetching exhibitors' });
    }
}
// PATCH /api/exhibitors/:id/submit-payment
async function submitPayment(req, res) {
    const { id } = req.params;
    const { payment_reference } = req.body;

    if (!payment_reference) {
        return res.status(400).json({ error: 'payment_reference is required' });
    }

    try {
        const updated = await pool.query(
            `UPDATE exhibitors
             SET status = 'payment_submitted', payment_reference = $1
             WHERE id = $2 RETURNING *`,
            [payment_reference, id]
        );

        if (updated.rows.length === 0) {
            return res.status(404).json({ error: 'Exhibitor not found' });
        }

        sendPaymentReceivedEmail(
            updated.rows[0].email,
            updated.rows[0].full_name,
            'exhibitor'
        ).catch((err) => console.error('Failed to send payment-received email:', err));

        res.json({
            message: 'Payment reference received. We will confirm shortly.',
            exhibitor: updated.rows[0],
        });
    } catch (err) {
        console.error('Submit payment error:', err);
        res.status(500).json({ error: 'Something went wrong submitting payment' });
    }
}

// PATCH /api/admin/exhibitors/:id/verify
async function verify(req, res) {
    const { id } = req.params;
    const { payment_reference } = req.body;

    try {
        const existing = await pool.query('SELECT payment_reference FROM exhibitors WHERE id = $1', [id]);

        if (existing.rows.length === 0) {
            return res.status(404).json({ error: 'Exhibitor not found' });
        }

        const finalReference = payment_reference || existing.rows[0].payment_reference;

        const updated = await pool.query(
            `UPDATE exhibitors
             SET status = 'verified', payment_reference = $1
             WHERE id = $2 RETURNING *`,
            [finalReference || null, id]
        );

        sendPaymentConfirmedEmail(
            updated.rows[0].email,
            updated.rows[0].full_name,
            'exhibitor'
        ).catch((err) => console.error('Failed to send payment-confirmed email:', err));

        res.json({ exhibitor: updated.rows[0] });
    } catch (err) {
        console.error('Verify exhibitor error:', err);
        res.status(500).json({ error: 'Something went wrong during verification' });
    }
}
// PATCH /api/admin/exhibitors/:id/reject
async function reject(req, res) {
    const { id } = req.params;

    try {
        const updated = await pool.query(
            `UPDATE exhibitors
             SET status = 'rejected'
             WHERE id = $1 RETURNING *`,
            [id]
        );

        if (updated.rows.length === 0) {
            return res.status(404).json({ error: 'Exhibitor not found' });
        }

        res.json({ 
            message: 'Exhibitor registration rejected', 
            exhibitor: updated.rows[0] 
        });
    } catch (err) {
        console.error('Reject exhibitor error:', err);
        res.status(500).json({ error: 'Something went wrong during rejection' });
    }
}

module.exports = { register, list, submitPayment, verify, reject };
