// siyaha-alkhums/services/paymentService.js
const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

/**
 * محاكاة عملية الدفع عبر بوابة T-Lync أو أي بوابة أخرى
 * في بيئة الإنتاج، سيتم استبدال هذا بالاتصال الفعلي بـ API البوابة
 * @param {string} userId - معرف المستخدم
 * @param {string} bookingId - معرف الحجز
 * @param {number} amount - المبلغ
 * @param {string} paymentMethod - طريقة الدفع
 * @returns {Object} حالة الدفع
 */
exports.processPayment = async (userId, bookingId, amount, paymentMethod) => {
    try {
        // 1. محاكاة الاتصال ببوابة الدفع الخارجية (T-Lync)
        console.log(`Processing payment for Booking ${bookingId} via ${paymentMethod} with amount ${amount}...`);
        
        // محاكاة نجاح الدفع بنسبة 90%
        const isSuccess = Math.random() > 0.1;
        const transactionId = uuidv4();
        const status = isSuccess ? 'succeeded' : 'failed';

        // 2. تسجيل المعاملة في جدول المدفوعات
        const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .insert([{
                booking_id: bookingId,
                user_id: userId,
                amount: amount,
                payment_method: paymentMethod,
                transaction_id: transactionId,
                status: status
            }])
            .select()
            .single();

        if (paymentError) throw paymentError;

        // 3. تحديث حالة الحجز إذا نجح الدفع
        if (isSuccess) {
            const { error: bookingError } = await supabase
                .from('bookings')
                .update({ status: 'confirmed', payment_id: payment.id })
                .eq('id', bookingId);

            if (bookingError) throw bookingError;

            // 4. منح نقاط الولاء
            const loyaltyService = require('./loyaltyService');
            await loyaltyService.awardPointsForBooking(userId, bookingId, amount);
        }

        return { success: isSuccess, payment: payment, transactionId: transactionId, status: status };

    } catch (error) {
        console.error('Payment Service Error:', error);
        return { success: false, error: error.message };
    }
};
