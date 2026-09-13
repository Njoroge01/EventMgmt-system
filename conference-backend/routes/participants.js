const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const participantController = require('../controllers/participantController');
const categoryController = require('../controllers/categoryController');

// Make sure the payment upload directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'payments');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();

        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
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
            cb(
                new Error(
                    'Only JPG, PNG, WEBP and PDF files are allowed.'
                )
            );
        }
    }
});

// Get participant categories
router.get('/categories', categoryController.list);

// Register participant
router.post('/', participantController.register);

// Submit payment reference + payment proof
router.patch(
    '/:id/submit-payment',
    upload.single('payment_proof'),
    participantController.submitPayment
);

module.exports = router;