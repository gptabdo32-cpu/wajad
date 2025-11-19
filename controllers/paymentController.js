// siyaha-alkhums/controllers/paymentController.js
const paymentService = require('../services/paymentService');
const bookingService = require('../services/bookingService');

/**
 * @route POST /api/v1/payments/process
 * @desc معالجة الدفع لحجز معين
 * @access Private (Authenticated User)
 */
exports.processPayment = async (req, res) => {
    const userId = req.userId; 
    const { bookingId, paymentMethod } = req.body;

    if (!userId || !bookingId || !paymentMethod) {
        return res.status(400).json({ success: false, msg: 'الرجاء إدخال معرف الحجز وطريقة الدفع.' });
    }

    try {
        // 1. جلب تفاصيل الحجز للحصول على المبلغ
        // ملاحظة: يجب أن يكون هناك دالة لجلب حجز واحد بدلاً من جلب كل الحجوزات
        // سنستخدم هنا دالة مساعدة مؤقتة
        const { bookings, error: bookingError } = await bookingService.getUserBookings(userId);
        const booking = bookings.find(b => b.id === bookingId);

        if (bookingError || !booking) {
            return res.status(404).json({ success: false, msg: 'لم يتم العثور على الحجز أو لا تملك صلاحية الوصول إليه.' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, msg: `الحجز بالفعل في حالة ${booking.status}.` });
        }

        const amount = booking.total_price;

        // 2. معالجة الدفع
        const result = await paymentService.processPayment(userId, bookingId, amount, paymentMethod);

        if (result.success) {
            res.status(200).json({ success: true, msg: 'تم الدفع بنجاح وتأكيد الحجز.', payment: result.payment });
        } else {
            res.status(400).json({ success: false, msg: 'فشل عملية الدفع.', payment: result.payment, error: result.error });
        }

    } catch (error) {
        res.status(500).json({ success: false, msg: 'حدث خطأ في الخادم.' });
    }
};
