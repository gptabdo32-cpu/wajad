// wajad/controllers/profileController.js
const bookingService = require('../services/bookingService');
const loyaltyService = require('../services/loyaltyService');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    جلب جميع بيانات الملف الشخصي في طلب واحد (Aggregation)
// @route   GET /api/v1/profile/data
// @access  خاص
exports.getProfileData = async (req, res, next) => {
    const userId = req.userId;
    
    // جلب معلمات الترحيل للحجوزات (افتراضياً آخر 10 حجوزات)
    const bookingLimit = parseInt(req.query.bookingLimit) || 10;
    const bookingOffset = parseInt(req.query.bookingOffset) || 0;

    try {
        // 1. جلب بيانات الحجوزات (مع الترحيل)
        const bookingResult = await bookingService.getUserBookings(userId, bookingLimit, bookingOffset);
        if (bookingResult.error) {
            // لا نعتبر فشل جلب الحجوزات خطأ 500، بل نمرر رسالة الخطأ
            console.error('Error fetching bookings:', bookingResult.error);
        }

        // 2. جلب إجمالي نقاط الولاء
        const pointsResult = await loyaltyService.getTotalPoints(userId);
        if (pointsResult.error) {
            console.error('Error fetching loyalty points:', pointsResult.error);
        }

        // 3. جلب سجل نقاط الولاء
        const historyResult = await loyaltyService.getLoyaltyHistory(userId);
        if (historyResult.error) {
            console.error('Error fetching loyalty history:', historyResult.error);
        }

        // تجميع البيانات
        const profileData = {
            bookings: {
                data: bookingResult.bookings || [],
                totalCount: bookingResult.totalCount || 0,
                limit: bookingLimit,
                offset: bookingOffset,
                error: bookingResult.error || null
            },
            loyalty: {
                totalPoints: pointsResult.totalPoints || 0,
                history: historyResult.history || [],
                error: pointsResult.error || historyResult.error || null
            },
            // يمكن إضافة بيانات المستخدم الأساسية هنا إذا لم تكن متوفرة في الواجهة الأمامية
            user: {
                id: userId,
                // ... بيانات المستخدم الأخرى التي يمكن جلبها من قاعدة البيانات إذا لزم الأمر
            }
        };

        res.status(200).json({
            success: true,
            data: profileData
        });

    } catch (error) {
        // إذا حدث خطأ غير متوقع (مثل خطأ في الاتصال بقاعدة البيانات)
        next(new ErrorResponse('فشل جلب بيانات الملف الشخصي بسبب خطأ في الخادم.', 500));
    }
};
