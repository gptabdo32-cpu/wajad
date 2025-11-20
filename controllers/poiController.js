// controllers/poiController.js
const supabase = require('../config/supabase');
const ErrorResponse = require('../utils/ErrorResponse');
const gisService = require('../services/gisService');

// @desc    جلب جميع نقاط الاهتمام
// @route   GET /api/v1/poi/all
// @access  عام
exports.getAllPois = async (req, res, next) => {
    try {
        const { data: pois, error } = await supabase
            .from('pois')
            .select('*');

        if (error) {
            return next(new ErrorResponse('فشل في جلب جميع نقاط الاهتمام.', 500));
        }

        res.status(200).json({ success: true, count: pois.length, data: pois });
    } catch (error) {
        next(new ErrorResponse('حدث خطأ غير متوقع أثناء جلب جميع نقاط الاهتمام.', 500));
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
        const { q, category } = req.query; // تغيير 'query' إلى 'q' ليتناسب مع الواجهة الأمامية

        const result = await gisService.searchPOI(q, category);

        if (result.success) {
            res.status(200).json(result);
        } else {
            return next(new ErrorResponse(result.error || 'فشل في البحث عن نقاط الاهتمام', 500));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    جلب عروض الإقامة مع التصفية المتقدمة
// @route   GET /api/v1/poi/accommodation
// @access  عام
exports.getAccommodation = async (req, res, next) => {
    try {
        const { minPrice, maxPrice, rating, guests, checkIn, checkOut } = req.query;

        // سنفترض أن gisService.getAccommodationFilter موجودة وتتعامل مع منطق التصفية
        // في الوقت الحالي، سنقوم فقط بتصفية بسيطة على الفئة 'Accommodation'
        let queryBuilder = supabase
            .from('pois')
            .select('*')
            .eq('category', 'Accommodation');

        if (minPrice) {
            queryBuilder = queryBuilder.gte('price', minPrice);
        }
        if (maxPrice) {
            queryBuilder = queryBuilder.lte('price', maxPrice);
        }
        if (rating) {
            queryBuilder = queryBuilder.gte('rating', rating);
        }
        // يمكن إضافة منطق معقد للضيوف والتواريخ هنا

        const { data: accommodation, error } = await queryBuilder;

        if (error) {
            return next(new ErrorResponse('فشل في جلب عروض الإقامة.', 500));
        }

        res.status(200).json({ success: true, count: accommodation.length, data: accommodation });
    } catch (error) {
        next(new ErrorResponse('حدث خطأ غير متوقع أثناء جلب عروض الإقامة.', 500));
    }
};


// @desc    جلب عروض المطاعم مع التصفية المتقدمة
// @route   GET /api/v1/poi/dining
// @access  عام
exports.getDining = async (req, res, next) => {
    try {
        const { cuisine, minRating, maxPrice } = req.query;

        let queryBuilder = supabase
            .from('pois')
            .select('*')
            .eq('category', 'Dining');

        if (cuisine) {
            queryBuilder = queryBuilder.eq('cuisine_type', cuisine); // يفترض وجود عمود cuisine_type
        }
        if (minRating) {
            queryBuilder = queryBuilder.gte('rating', minRating);
        }
        if (maxPrice) {
            queryBuilder = queryBuilder.lte('price_range', maxPrice); // يفترض وجود عمود price_range
        }

        const { data: dining, error } = await queryBuilder;

        if (error) {
            return next(new ErrorResponse('فشل في جلب عروض المطاعم.', 500));
        }

        res.status(200).json({ success: true, count: dining.length, data: dining });
    } catch (error) {
        next(new ErrorResponse('حدث خطأ غير متوقع أثناء جلب عروض المطاعم.', 500));
    }
};


// @desc    جلب عروض النقل مع التصفية المتقدمة
// @route   GET /api/v1/poi/transport
// @access  عام
exports.getTransport = async (req, res, next) => {
    try {
        const { type, capacity, maxPrice } = req.query;

        let queryBuilder = supabase
            .from('pois')
            .select('*')
            .eq('category', 'Transport');

        if (type) {
            queryBuilder = queryBuilder.eq('transport_type', type); // يفترض وجود عمود transport_type
        }
        if (capacity) {
            queryBuilder = queryBuilder.gte('capacity', capacity); // يفترض وجود عمود capacity
        }
        if (maxPrice) {
            queryBuilder = queryBuilder.lte('price_per_day', maxPrice); // يفترض وجود عمود price_per_day
        }

        const { data: transport, error } = await queryBuilder;

        if (error) {
            return next(new ErrorResponse('فشل في جلب عروض النقل.', 500));
        }

        res.status(200).json({ success: true, count: transport.length, data: transport });
    } catch (error) {
        next(new ErrorResponse('حدث خطأ غير متوقع أثناء جلب عروض النقل.', 500));
    }
};


// @desc    جلب نقاط الاهتمام للطوارئ (مستشفيات، شرطة، إلخ)
// @route   GET /api/v1/poi/emergency
// @access  عام
exports.getEmergencyPois = async (req, res, next) => {
    try {
        // يمكن استخدام الموقع الحالي للمستخدم (lat, lng) لتصفية النتائج
        const { lat, lng, radius = 10 } = req.query; // نصف قطر افتراضي 10 كم

        let queryBuilder = supabase
            .from('pois')
            .select('*')
            .eq('category', 'Emergency'); // يفترض وجود فئة 'Emergency'

        // إذا تم توفير الموقع، يمكن استخدام gisService.getPoisInRadius
        if (lat && lng) {
            // سنستخدم دالة gisService.getPoisInRadius الموجودة
            const result = await gisService.getPoisInRadius(parseFloat(radius), parseFloat(lat), parseFloat(lng), 'Emergency');
            
            if (result.success) {
                return res.status(200).json(result);
            } else {
                return next(new ErrorResponse(result.error || 'خطأ في خدمة GIS لجلب الطوارئ', 500));
            }
        }

        // إذا لم يتم توفير الموقع، جلب جميع نقاط الطوارئ
        const { data: emergencyPois, error } = await queryBuilder;

        if (error) {
            return next(new ErrorResponse('فشل في جلب نقاط الاهتمام للطوارئ.', 500));
        }

        res.status(200).json({ success: true, count: emergencyPois.length, data: emergencyPois });
    } catch (error) {
        next(new ErrorResponse('حدث خطأ غير متوقع أثناء جلب نقاط الاهتمام للطوارئ.', 500));
    }
};
