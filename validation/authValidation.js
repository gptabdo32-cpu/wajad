const Joi = require('joi');

// مخطط التحقق من صحة بيانات التسجيل
const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
        'string.min': 'اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل.',
        'string.max': 'اسم المستخدم يجب أن لا يتجاوز 30 حرفًا.',
        'any.required': 'اسم المستخدم مطلوب.'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'يجب أن يكون البريد الإلكتروني صالحًا.',
        'any.required': 'البريد الإلكتروني مطلوب.'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.',
        'any.required': 'كلمة المرور مطلوبة.'
    }),
});

module.exports = {
    registerSchema,
};
