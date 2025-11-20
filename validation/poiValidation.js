// wajad/validation/poiValidation.js
const Joi = require('joi');

const createPOISchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.min': 'يجب أن يحتوي الاسم على 3 أحرف على الأقل.',
        'string.max': 'يجب ألا يتجاوز الاسم 100 حرف.',
        'any.required': 'اسم نقطة الاهتمام مطلوب.'
    }),
    description: Joi.string().min(10).required().messages({
        'string.min': 'يجب أن يحتوي الوصف على 10 أحرف على الأقل.',
        'any.required': 'الوصف مطلوب.'
    }),
    address: Joi.string().required().messages({
        'any.required': 'العنوان مطلوب.'
    }),
    lat: Joi.number().min(-90).max(90).required().messages({
        'number.base': 'خط العرض يجب أن يكون رقمًا.',
        'number.min': 'خط العرض يجب أن يكون بين -90 و 90.',
        'any.required': 'خط العرض مطلوب.'
    }),
    lng: Joi.number().min(-180).max(180).required().messages({
        'number.base': 'خط الطول يجب أن يكون رقمًا.',
        'number.min': 'خط الطول يجب أن يكون بين -180 و 180.',
        'any.required': 'خط الطول مطلوب.'
    }),
    category: Joi.string().required().messages({
        'any.required': 'الفئة مطلوبة.'
    }),
    licenseNumber: Joi.string().allow(null, ''),
    isVerified: Joi.boolean().default(false),
});

module.exports = {
    createPOISchema,
};
