// siyaha-alkhums/services/bookingService.js
const supabase = require('../config/supabase');

/**
 * إنشاء حجز جديد
 * @param {string} userId - معرف المستخدم الذي يقوم بالحجز
 * @param {string} guideId - معرف المرشد المحجوز
 * @param {string} bookingDate - تاريخ ووقت الحجز
 * @param {number} durationHours - مدة الحجز بالساعات
 * @param {number} totalPrice - السعر الإجمالي
 * @returns {Object} بيانات الحجز أو خطأ
 */
exports.createBooking = async (userId, guideId, bookingDate, durationHours, totalPrice) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                user_id: userId,
                guide_id: guideId,
                booking_date: bookingDate,
                duration_hours: durationHours,
                total_price: totalPrice,
                status: 'pending'
            }])
            .select()
            .single();

        if (error) throw error;

        return { booking: data };
    } catch (error) {
        return { error: error.message };
    }
};

/**
 * تحديث حالة الحجز (تأكيد أو إلغاء)
 * @param {string} bookingId - معرف الحجز
 * @param {string} newStatus - الحالة الجديدة ('confirmed' أو 'cancelled')
 * @returns {Object} بيانات الحجز المحدثة أو خطأ
 */
exports.updateBookingStatus = async (bookingId, newStatus) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', bookingId)
            .select()
            .single();

        if (error) throw error;

        return { booking: data };
    } catch (error) {
        return { error: error.message };
    }
};

/**
 * جلب حجوزات المستخدم
 * @param {string} userId - معرف المستخدم
 * @returns {Object} قائمة الحجوزات أو خطأ
 */
exports.getUserBookings = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', userId)
            .order('booking_date', { ascending: false });

        if (error) throw error;

        return { bookings: data };
    } catch (error) {
        return { error: error.message };
    }
};
