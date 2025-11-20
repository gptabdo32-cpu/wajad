// frontend/src/utils/gisUtils.js

/**
 * تحويل الإحداثيات الجغرافية (خطوط الطول والعرض) إلى إحداثيات 3D مناسبة للعرض في React Three Fiber.
 * @param {number} lat - خط العرض (Latitude)
 * @param {number} lon - خط الطول (Longitude)
 * @returns {number[]} مصفوفة [x, y, z]
 */
export const convertTo3D = (lat, lon) => {
    // نطاق الخمس تقريبيًا: Lat 32.6, Lon 14.2
    const scaleFactor = 10;
    // الإزاحة (Offset) لمركز الخريطة ليكون مركز المشهد
    const centerLat = 32.6375;
    const centerLon = 14.2917;

    // حساب الإزاحة من المركز
    const x = (lon - centerLon) * scaleFactor;
    const z = (lat - centerLat) * scaleFactor;
    
    // ارتفاع ثابت للنقاط
    const y = 0.5; 
    
    return [x, y, z];
};

/**
 * حساب إحداثيات مركز الخمس التقريبية في نظام 3D.
 * @returns {number[]} مصفوفة [x, y, z] لمركز الخريطة
 */
export const getCenterPosition = () => {
    return convertTo3D(32.6375, 14.2917);
};
