// wajad/middleware/validationMiddleware.js
const validationMiddleware = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        // تمرير خطأ Joi إلى وسيط معالجة الأخطاء الموحد
        error.isJoi = true; // علامة لوسيط معالجة الأخطاء
        return next(error);
    }

    next();
};

module.exports = validationMiddleware;
