// wajad/validation/paymentValidation.js
const Joi = require('joi');

const createPaymentSchema = Joi.object({
    bookingId: Joi.string().uuid().required().messages({
        'string.uuid': 'معرف الحجز يجب أن يكون UUID صالحًا.',
        'any.required': 'معرف الحجز مطلوب.'
    }),
    amount: Joi.number().min(0.01).required().messages({
        'number.min': 'المبلغ يجب أن يكون أكبر من الصفر.',
        'any.required': 'المبلغ مطلوب.'
    }),
    currency: Joi.string().length(3).default('LYD').messages({
        'string.length': 'العملة يجب أن تكون 3 أحرف (مثل LYD).'
    }),
    paymentMethod: Joi.string().required().messages({
        'any.required': 'طريقة الدفع مطلوبة.'
    }),
    transactionId: Joi.string().required().messages({
        'any.required': 'معرف المعاملة مطلوب.'
    }),
});

module.exports = {
    createPaymentSchema,
};
