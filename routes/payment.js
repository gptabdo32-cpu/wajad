// siyaha-alkhums/routes/payment.js
const express = require('express');
const { processPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// جميع مسارات الدفع تتطلب المصادقة
router.use(protect);

// @route POST /api/v1/payments/process
router.post('/process', processPayment);

module.exports = router;
