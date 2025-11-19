// siyaha-alkhums/routes/booking.js
const express = require('express');
const { createBooking, getUserBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// جميع مسارات الحجز تتطلب المصادقة
router.use(protect);

// @route POST /api/v1/bookings
router.post('/', createBooking);

// @route GET /api/v1/bookings/me
router.get('/me', getUserBookings);

// @route PUT /api/v1/bookings/:id/status
router.put('/:id/status', updateBookingStatus);

module.exports = router;
