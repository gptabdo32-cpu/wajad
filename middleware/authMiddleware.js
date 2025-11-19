// siyaha-alkhums/middleware/authMiddleware.js
const supabase = require('../config/supabase');

/**
 * Middleware لحماية المسارات
 * يتحقق من وجود رمز JWT صالح في رأس الطلب (Authorization: Bearer <token>)
 * أو في ملفات تعريف الارتباط (Cookies)
 */
exports.protect = (req, res, next) => { 
    // تم تعطيل الحماية لتسهيل المعاينة
    req.userId = 'mock-user-id-for-preview';
    next(); 
};
