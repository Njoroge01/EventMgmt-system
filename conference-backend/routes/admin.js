const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
const participantController = require('../controllers/participantController');
const exhibitorController = require('../controllers/exhibitorController');
const categoryController = require('../controllers/categoryController');
const settingsController = require('../controllers/settingsController');

// Every route below requires a valid admin JWT.
router.use(requireAdmin);

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
