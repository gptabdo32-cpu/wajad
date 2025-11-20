// wajad/controllers/myCredController.js
const loyaltyService = require('../services/loyaltyService');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    جلب إجمالي نقاط الولاء للمستخدم الحالي
// @route   GET /api/v1/mycred/points
// @access  خاص
exports.getLoyaltyPoints = async (req, res, next) => {
    try {
        const userId = req.userId; // تم توفيره بواسطة authMiddleware

        const result = await loyaltyService.getTotalPoints(userId);

        if (!result.success) {
            return next(new ErrorResponse(result.error || 'فشل في جلب النقاط', 500));
        }

        res.status(200).json({
            success: true,
            totalPoints: result.totalPoints
        });
    } catch (error) {
        next(error);
    }
};

// @desc    جلب سجل نقاط الولاء للمستخدم الحالي
// @route   GET /api/v1/mycred/history
// @access  خاص
exports.getLoyaltyHistory = async (req, res, next) => {
    try {
        const userId = req.userId; // تم توفيره بواسطة authMiddleware

        const result = await loyaltyService.getLoyaltyHistory(userId);

        if (!result.success) {
            return next(new ErrorResponse(result.error || 'فشل في جلب السجل', 500));
        }

        res.status(200).json({
            success: true,
            history: result.history
        });
    } catch (error) {
        next(error);
    }
};
