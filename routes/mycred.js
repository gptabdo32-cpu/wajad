// wajad/routes/mycred.js
const express = require('express');
const { getLoyaltyPoints, getLoyaltyHistory } = require('../controllers/myCredController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// جميع المسارات هنا تتطلب مصادقة
router.use(protect);

// @route GET /api/v1/mycred/points
router.route('/points').get(getLoyaltyPoints);

// @route GET /api/v1/mycred/history
router.route('/history').get(getLoyaltyHistory);

module.exports = router;
