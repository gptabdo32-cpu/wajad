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
 * جلب حجوزات المستخدم مع دعم الترحيل (Pagination)
 * @param {string} userId - معرف المستخدم
 * @param {number} limit - الحد الأقصى لعدد الحجوزات المراد جلبها
 * @param {number} offset - الإزاحة (لتخطي عدد معين من الحجوزات)
 * @returns {Object} قائمة الحجوزات أو خطأ
 */
exports.getUserBookings = async (userId, limit = 10, offset = 0) => {
    try {
        // جلب الحجوزات المحدودة
        const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', userId)
            .order('booking_date', { ascending: false })
            .range(offset, offset + limit - 1); // Supabase range is inclusive

        if (bookingsError) throw bookingsError;

        // جلب العدد الإجمالي للحجوزات (لأغراض الترحيل)
        const { count, error: countError } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (countError) throw countError;

        return { bookings: bookings, totalCount: count };
    } catch (error) {
        return { error: error.message };
    }
};
