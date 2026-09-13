const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const exhibitorController = require('../controllers/exhibitorController');
const settingsController = require('../controllers/settingsController');

// --------------------------------------------------
// Payment proof upload configuration
// --------------------------------------------------

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/payments/');
    },

    filename: (req, file, cb) => {
        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/pdf'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPG, PNG, WEBP and PDF files are allowed.'));
        }
    }
});

// --------------------------------------------------
// Exhibitor fee
// GET /api/exhibitors/fee
// --------------------------------------------------

router.get('/fee', settingsController.getExhibitorFee);

// --------------------------------------------------
// Exhibitor registration
// POST /api/exhibitors
// --------------------------------------------------

router.post('/', exhibitorController.register);

// --------------------------------------------------
// Submit payment reference + proof
// PATCH /api/exhibitors/:id/submit-payment
// --------------------------------------------------

router.patch(
    '/:id/submit-payment',
    upload.single('payment_proof'),
    exhibitorController.submitPayment
);

module.exports = router;