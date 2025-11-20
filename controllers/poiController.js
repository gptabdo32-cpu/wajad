// controllers/poiController.js
const supabase = require('../config/supabase');
const ErrorResponse = require('../utils/ErrorResponse');
const gisService = require('../services/gisService');

// @desc    جلب جميع نقاط الاهتمام
// @route   GET /api/v1/poi
// @access  عام
exports.getPois = async (req, res, next) => {
    try {
        const { data: pois, error } = await supabase
            .from('pois')
            .select('*');

        if (error) {
            return next(new ErrorResponse('فشل في جلب نقاط الاهتمام.', 500));
        }

        res.status(200).json({ success: true, count: pois.length, data: pois });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ غير متوقع.' });
    }
};

// @desc    جلب نقاط الاهتمام ضمن نطاق جغرافي
// @route   GET /api/v1/poi/radius/:distance/:lat/:lng
// @access  عام
exports.getPoisInRadius = async (req, res, next) => {
    try {
        const { distance, lat, lng } = req.params;

        if (!distance || !lat || !lng) {
            return next(new ErrorResponse('الرجاء توفير المسافة وخطوط الطول والعرض.', 400));
        }

        const result = await gisService.getPoisInRadius(parseFloat(distance), parseFloat(lat), parseFloat(lng));

        if (result.success) {
            res.status(200).json(result);
        } else {
            return next(new ErrorResponse(result.error || 'خطأ في خدمة GIS', 500));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    إنشاء نقطة اهتمام
// @route   POST /api/v1/poi
// @access  خاص (admin/guide)
exports.createPoi = async (req, res, next) => {
    try {
        // يجب أن يحتوي req.body على lat و lng بالإضافة إلى البيانات الأخرى
        const result = await gisService.createPOI(req.body);

        if (result.success) {
            res.status(201).json(result);
        } else {
            // إذا فشلت الخدمة، افترض خطأ في البيانات أو خطأ في قاعدة البيانات
            return next(new ErrorResponse(result.error || 'فشل في إنشاء نقطة الاهتمام', 400));
        }
    } catch (error) {
        next(error); // تمرير الخطأ إلى وسيط معالجة الأخطاء
    }
};

// @desc    البحث الموحد عن نقاط الاهتمام
// @route   GET /api/v1/poi/search
// @access  عام
exports.searchPois = async (req, res, next) => {
    try {
        const { query, category } = req.query;

        const result = await gisService.searchPOI(query, category);

        if (result.success) {
            res.status(200).json(result);
        } else {
            return next(new ErrorResponse(result.error || 'فشل في البحث عن نقاط الاهتمام', 500));
        }
    } catch (error) {
        next(error);
    }
};
