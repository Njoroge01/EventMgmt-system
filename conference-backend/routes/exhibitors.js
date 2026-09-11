const express = require('express');
const router = express.Router();
const exhibitorController = require('../controllers/exhibitorController');
const settingsController = require('../controllers/settingsController');

// GET /api/exhibitors/fee - the current exhibitor fee, for the registration form to display
router.get('/fee', settingsController.getExhibitorFee);

// POST /api/exhibitors - submit a registration
router.post('/', exhibitorController.register);
// PATCH /api/exhibitors/:id/submit-payment - exhibitor reports payment reference
router.patch('/:id/submit-payment', exhibitorController.submitPayment);
module.exports = router;
