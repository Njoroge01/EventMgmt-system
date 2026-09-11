const express = require('express');
const router = express.Router();

const participantController = require('../controllers/participantController');
const categoryController = require('../controllers/categoryController');

// GET /api/participants/categories - list categories for the registration form
router.get('/categories', categoryController.list);

// POST /api/participants - submit a registration
router.post('/', participantController.register);
// PATCH /api/participants/:id/submit-payment - registrant reports payment reference
router.patch('/:id/submit-payment', participantController.submitPayment);
module.exports = router;
