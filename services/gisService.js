// services/gisService.js
const supabase = require('../config/supabase');
const config = require('../config/config');

// @desc    جلب نقاط الاهتمام ضمن نطاق جغرافي معين (GeoWithin)
// @param   {number} distance - المسافة بالكيلومتر
// @param   {number} lat - خط العرض
// @param   {number} lng - خط الطول
exports.getPoisInRadius = async (distance, lat, lng) => {
    try {
        // استخدام استعلام PostGIS ST_DWithin
        const { data: pois, error } = await supabase
            .from('pois')
            .select('*')
            .rpc('pois_in_radius', {
                lat: lat,
                lng: lng,
                radius_km: distance
            });

        if (error) {
            console.error('Supabase GIS Error (getPoisInRadius):', error);
            return { success: false, error: 'فشل في جلب نقاط الاهتمام ضمن النطاق الجغرافي.' };
        }

        return { success: true, count: pois.length, data: pois };
    } catch (error) {
        console.error('GIS Service Error (getPoisInRadius):', error);
        return { success: false, error: 'حدث خطأ غير متوقع.' };
    }
};

// @desc    جلب أقرب نقاط اهتمام (GeoNear)
// @param   {number} lat - خط العرض
// @param   {number} lng - خط الطول
// @param   {number} limit - الحد الأقصى لعدد النقاط المراد جلبها
exports.getNearestPois = async (lat, lng, limit = 10) => {
    try {
        // استخدام استعلام PostGIS ST_DWithin مع ترتيب حسب المسافة
        const { data: pois, error } = await supabase
            .from('pois')
            .select('*')
            .rpc('nearest_pois', {
                lat: lat,
                lng: lng,
                limit_count: limit
            });

        if (error) {
            console.error('Supabase GIS Error (getNearestPois):', error);
            return { success: false, error: 'فشل في جلب أقرب نقاط الاهتمام.' };
        }

        return { success: true, count: pois.length, data: pois };
    } catch (error) {
        console.error('GIS Service Error (getNearestPois):', error);
        return { success: false, error: 'حدث خطأ غير متوقع.' };
    }
};

// @desc    إنشاء نقطة اهتمام جديدة
// @param   {object} poiData - بيانات نقطة الاهتمام
exports.createPOI = async (poiData) => {
    try {
        // تحويل الإحداثيات إلى تنسيق PostGIS WKT (Well-Known Text)
        const wktLocation = `POINT(${poiData.lng} ${poiData.lat})`;

        const { data: poi, error } = await supabase
            .from('pois')
            .insert([{
                name: poiData.name,
                description: poiData.description,
                address: poiData.address,
                location: wktLocation, // إدخال الموقع بتنسيق WKT
                category: poiData.category,
                license_number: poiData.licenseNumber,
                is_verified: poiData.isVerified
            }])
            .select();

        if (error) {
            console.error('Supabase GIS Error (createPOI):', error);
            return { success: false, error: error.message };
        }

        return { success: true, data: poi[0] };
    } catch (error) {
        console.error('GIS Service Error (createPOI):', error);
        return { success: false, error: 'حدث خطأ غير متوقع.' };
    }
};

// @desc    البحث الموحد عن نقاط الاهتمام
// @param   {string} query - كلمة البحث
// @param   {string} category - فئة نقطة الاهتمام
exports.searchPOI = async (query, category) => {
    try {
        let queryBuilder = supabase.from('pois').select('*');

        if (query) {
            // البحث عن طريق الاسم أو الوصف
            queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
        }

        if (category) {
            // البحث عن طريق الفئة (يجب أن تكون الفئة موجودة في مصفوفة category)
            queryBuilder = queryBuilder.contains('category', [category]);
        }

        const { data: pois, error } = await queryBuilder;

        if (error) {
            console.error('Supabase GIS Error (searchPOI):', error);
            return { success: false, error: 'فشل في البحث عن نقاط الاهتمام.' };
        }

        return { success: true, count: pois.length, data: pois };
    } catch (error) {
        console.error('GIS Service Error (searchPOI):', error);
        return { success: false, error: 'حدث خطأ غير متوقع.' };
    }
};
