// wajad/utils/ErrorResponse.js
/**
 * فئة خطأ مخصصة لتوحيد استجابات الأخطاء في الواجهة الخلفية.
 * ترث من فئة Error الأساسية.
 */
class ErrorResponse extends Error {
    /**
     * @param {string} message - رسالة الخطأ
     * @param {number} statusCode - رمز حالة HTTP (مثل 404, 401, 500)
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // لضمان أن هذا الخطأ هو مثيل من ErrorResponse
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorResponse;
