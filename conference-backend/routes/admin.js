const pool = require('../config/db');
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
const participantController = require('../controllers/participantController');
const exhibitorController = require('../controllers/exhibitorController');
const categoryController = require('../controllers/categoryController');
const settingsController = require('../controllers/settingsController');

// Every route below requires a valid admin JWT.
router.use(requireAdmin);
router.get('/participants/:id/payment-proof', async (req, res) => {
    try {
        const participantId = Number(req.params.id);

        const result = await pool.query(
            'SELECT payment_proof_url FROM participants WHERE id = $1',
            [participantId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        const paymentProofUrl = result.rows[0].payment_proof_url;

        if (!paymentProofUrl) {
            return res.status(404).json({ error: 'Payment proof not found' });
        }

        const filename = path.basename(paymentProofUrl);
        const filePath = path.join(
            __dirname,
            '..',
            'uploads',
            'payments',
            filename
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Payment proof file not found' });
        }

        res.sendFile(filePath);
    } catch (error) {
        console.error('Error serving participant payment proof:', error);
        res.status(500).json({ error: 'Failed to retrieve payment proof' });
    }
});

router.get('/exhibitors/:id/payment-proof', async (req, res) => {
    try {
        const exhibitorId = Number(req.params.id);

        const result = await pool.query(
            'SELECT payment_proof_url FROM exhibitors WHERE id = $1',
            [exhibitorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Exhibitor not found' });
        }

        const paymentProofUrl = result.rows[0].payment_proof_url;

        if (!paymentProofUrl) {
            return res.status(404).json({ error: 'Payment proof not found' });
        }

        const filename = path.basename(paymentProofUrl);
        const filePath = path.join(
            __dirname,
            '..',
            'uploads',
            'payments',
            filename
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Payment proof file not found' });
        }

        res.sendFile(filePath);
    } catch (error) {
        console.error('Error serving exhibitor payment proof:', error);
        res.status(500).json({ error: 'Failed to retrieve payment proof' });
    }
});

// Settings (e.g. the exhibitor fee, once decided)
router.patch('/settings/exhibitor-fee', settingsController.setExhibitorFee);

// Participants
router.get('/participants', participantController.list);
router.patch('/participants/:id/verify', participantController.verify);
router.patch('/participants/:id/reject', participantController.reject);

// Exhibitors
router.get('/exhibitors', exhibitorController.list);
router.patch('/exhibitors/:id/verify', exhibitorController.verify);
router.patch('/exhibitors/:id/reject', exhibitorController.reject);

// Categories (price/fields management)
router.post('/categories', categoryController.create);
router.patch('/categories/:id', categoryController.update);

module.exports = router;
