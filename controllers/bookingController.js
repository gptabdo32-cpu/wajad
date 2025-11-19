// siyaha-alkhums/controllers/bookingController.js
const bookingService = require('../services/bookingService');

/**
 * @route POST /api/v1/bookings
 * @desc إنشاء حجز جديد
 * @access Private (Authenticated User)
 */
exports.createBooking = async (req, res) => {
    // نفترض أن middleware المصادقة قد أضاف 'userId' إلى كائن الطلب (req)
    const userId = req.userId; 
    const { guideId, bookingDate, durationHours, totalPrice } = req.body;

    if (!userId || !guideId || !bookingDate || !durationHours || !totalPrice) {
        return res.status(400).json({ success: false, msg: 'الرجاء إدخال جميع الحقول المطلوبة للحجز.' });
    }

    try {
        const result = await bookingService.createBooking(userId, guideId, bookingDate, durationHours, totalPrice);

        if (result.error) {
            return res.status(400).json({ success: false, msg: 'فشل إنشاء الحجز', error: result.error });
        }

        res.status(201).json({ success: true, msg: 'تم إنشاء الحجز بنجاح (في انتظار الدفع).', booking: result.booking });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'حدث خطأ في الخادم.' });
    }
};

/**
 * @route GET /api/v1/bookings/me
 * @desc جلب حجوزات المستخدم الحالي
 * @access Private (Authenticated User)
 */
exports.getUserBookings = async (req, res) => {
    const userId = req.userId; 

    try {
        const result = await bookingService.getUserBookings(userId);

        if (result.error) {
            return res.status(404).json({ success: false, msg: 'فشل جلب الحجوزات', error: result.error });
        }

        res.status(200).json({ success: true, count: result.bookings.length, data: result.bookings });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'حدث خطأ في الخادم.' });
    }
};

/**
 * @route PUT /api/v1/bookings/:id/status
 * @desc تحديث حالة الحجز (إلغاء/تأكيد)
 * @access Private (User or Guide)
 */
exports.updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // يجب أن تكون 'confirmed' أو 'cancelled'

    if (!status || (status !== 'confirmed' && status !== 'cancelled')) {
        return res.status(400).json({ success: false, msg: 'حالة الحجز غير صالحة.' });
    }

    try {
        // يتم التحقق من الصلاحيات (هل هو المستخدم أو المرشد) عبر RLS في Supabase
        const result = await bookingService.updateBookingStatus(id, status);

        if (result.error) {
            return res.status(403).json({ success: false, msg: 'فشل تحديث الحالة. قد لا تكون لديك الصلاحيات اللازمة.', error: result.error });
        }

        res.status(200).json({ success: true, msg: `تم تحديث حالة الحجز إلى ${status}.`, booking: result.booking });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'حدث خطأ في الخادم.' });
    }
};
