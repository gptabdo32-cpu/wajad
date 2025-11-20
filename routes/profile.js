// wajad/routes/profile.js
const express = require('express');
const { getProfileData } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// جميع المسارات هنا تتطلب مصادقة
router.use(protect);

// @route GET /api/v1/profile/data
router.route('/data').get(getProfileData);

module.exports = router;
