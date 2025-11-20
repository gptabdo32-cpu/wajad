// controllers/authController.js
const authService = require('../services/authService');
const { registerSchema } = require('../validation/authValidation');

// @desc    تسجيل مستخدم جديد
// @route   POST /api/v1/auth/register
// @access  عام
exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // التحقق من صحة البيانات باستخدام Joi
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const result = await authService.signUp(email, password, username);

        if (result.error) {
            return res.status(400).json({ success: false, error: result.error });
        }

        res.status(201).json({
            success: true,
            msg: 'تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني للتأكيد.',
            user: { id: result.user.id, email: result.user.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في الخادم.' });
    }
};

// @desc    تسجيل دخول المستخدم
// @route   POST /api/v1/auth/login
// @access  عام
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'الرجاء إدخال بريد إلكتروني وكلمة مرور.' });
        }

        const result = await authService.signIn(email, password);

        if (result.error) {
            return res.status(401).json({ success: false, error: 'بيانات الاعتماد غير صالحة.' });
        }

        // في تطبيق حقيقي، يتم إرسال الـ session/token إلى الواجهة الأمامية
        // لتخزينه في ملفات تعريف الارتباط (Cookies) أو التخزين المحلي (LocalStorage)
        res.status(200).json({
            success: true,
            session: result.session,
            user: result.user
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في الخادم.' });
    }
};

// @desc    تسجيل خروج المستخدم
// @route   GET /api/v1/auth/logout
// @access  خاص
exports.logout = async (req, res, next) => {
    try {
        const result = await authService.signOut();

        if (result.error) {
            return res.status(500).json({ success: false, error: result.error });
        }

        res.status(200).json({
            success: true,
            msg: 'تم تسجيل الخروج بنجاح'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في الخادم.' });
    }
};

// @desc    الحصول على بيانات المستخدم الحالي
// @route   GET /api/v1/auth/me
// @access  خاص
exports.getMe = async (req, res, next) => {
    // نفترض أن middleware المصادقة قد أضاف 'userId' إلى كائن الطلب (req)
    const userId = req.userId; 

    if (!userId) {
        return res.status(401).json({ success: false, msg: 'غير مصرح به' });
    }

    const result = await authService.getUserProfile(userId);

    if (result.error) {
        return res.status(404).json({ success: false, msg: 'لم يتم العثور على ملف تعريف المستخدم', error: result.error });
    }

    res.status(200).json({
        success: true,
        profile: result.profile
    });
};
