// wajad/middleware/errorMiddleware.js
const ErrorResponse = require('../utils/ErrorResponse');

/**
 * وسيط لمعالجة الأخطاء المركزية
 * @param {Error} err - كائن الخطأ
 * @param {object} req - كائن الطلب
 * @param {object} res - كائن الاستجابة
 * @param {function} next - الدالة التالية
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // تسجيل الخطأ في وحدة التحكم
    console.error(err.stack);

    // خطأ Joi للتحقق من الصحة
    if (err.isJoi) {
        const message = err.details.map(i => i.message).join(', ');
        error = new ErrorResponse(message, 400);
    }

    // خطأ Supabase (يمكن تخصيصه أكثر بناءً على رموز أخطاء Supabase)
    if (err.code && err.code.startsWith('PGRST')) {
        error = new ErrorResponse(`خطأ في قاعدة البيانات: ${err.message}`, 500);
    }

    // خطأ JWT غير صالح
    if (err.name === 'JsonWebTokenError') {
        error = new ErrorResponse('رمز وصول غير صالح', 401);
    }

    // خطأ JWT منتهي الصلاحية
    if (err.name === 'TokenExpiredError') {
        error = new ErrorResponse('رمز الوصول منتهي الصلاحية', 401);
    }

    // إرسال الاستجابة الموحدة
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'خطأ في الخادم',
    });
};

module.exports = errorHandler;
