// siyaha-alkhums/services/loyaltyService.js
const supabase = require('../config/supabase');

/**
 * إضافة نقاط ولاء للمستخدم
 * @param {string} userId - معرف المستخدم
 * @param {number} points - عدد النقاط المراد إضافتها (موجب)
 * @param {string} reason - سبب الإضافة
 * @param {string} relatedEntityId - معرف الكيان المرتبط (مثل الحجز)
 * @returns {Object} بيانات النقطة المضافة أو خطأ
 */
exports.addPoints = async (userId, points, reason, relatedEntityId = null) => {
    try {
        const { data, error } = await supabase
            .from('loyalty_points')
            .insert([{
                user_id: userId,
                points_change: points,
                reason: reason,
                related_entity_id: relatedEntityId
            }])
            .select()
            .single();

        if (error) throw error;

        return { success: true, data: data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * جلب الرصيد الحالي لنقاط الولاء للمستخدم
 * @param {string} userId - معرف المستخدم
 * @returns {Object} الرصيد الإجمالي أو خطأ
 */
exports.getTotalPoints = async (userId) => {
    try {
        // استخدام دالة مجمعة (Aggregate Function) لحساب المجموع
        const { data, error } = await supabase
            .from('loyalty_points')
            .select('points_change')
            .eq('user_id', userId);

        if (error) throw error;

        const totalPoints = data.reduce((sum, entry) => sum + entry.points_change, 0);

        return { success: true, totalPoints: totalPoints };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * جلب سجل نقاط الولاء للمستخدم
 * @param {string} userId - معرف المستخدم
 * @returns {Object} سجل النقاط أو خطأ
 */
exports.getLoyaltyHistory = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('loyalty_points')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, history: data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

/**
 * @desc دالة مساعدة لربطها بخدمة الدفع لتمنح نقاط عند تأكيد الحجز
 * @param {string} userId - معرف المستخدم
 * @param {string} bookingId - معرف الحجز
 * @param {number} amount - المبلغ المدفوع
 */
exports.awardPointsForBooking = async (userId, bookingId, amount) => {
    // منح نقطة واحدة لكل 10 دنانير ليبية (مثال)
    const points = Math.floor(amount / 10);
    if (points > 0) {
        return exports.addPoints(userId, points, 'Booking Confirmation', bookingId);
    }
    return { success: true, msg: 'لم يتم منح نقاط (المبلغ صغير).' };
};
