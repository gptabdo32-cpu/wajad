// wajad/validation/bookingValidation.js
const Joi = require('joi');

const createBookingSchema = Joi.object({
    guideId: Joi.string().uuid().required().messages({
        'string.uuid': 'معرف المرشد يجب أن يكون UUID صالحًا.',
        'any.required': 'معرف المرشد مطلوب.'
    }),
    bookingDate: Joi.date().iso().min('now').required().messages({
        'date.iso': 'تاريخ الحجز يجب أن يكون بتنسيق ISO 8601.',
        'date.min': 'تاريخ الحجز يجب أن يكون في المستقبل.',
        'any.required': 'تاريخ الحجز مطلوب.'
    }),
    durationHours: Joi.number().min(0.5).max(24).required().messages({
        'number.min': 'المدة يجب أن تكون 0.5 ساعة على الأقل.',
        'number.max': 'المدة يجب ألا تتجاوز 24 ساعة.',
        'any.required': 'مدة الحجز مطلوبة.'
    }),
    totalPrice: Joi.number().min(0).required().messages({
        'number.min': 'السعر الإجمالي يجب أن يكون موجبًا.',
        'any.required': 'السعر الإجمالي مطلوب.'
    }),
});

module.exports = {
    createBookingSchema,
};
