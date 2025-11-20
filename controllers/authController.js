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
        
        // عند التسجيل، يتم تسجيل الدخول تلقائيًا وإرسال الكوكيز
        if (result.session) {
            // إعداد الكوكيز الآمنة
            const cookieOptions = {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 أيام
                httpOnly: true, // الأهم: لا يمكن الوصول إليها عبر JavaScript
                secure: process.env.NODE_ENV === 'production', // إرسال عبر HTTPS فقط في الإنتاج
                sameSite: 'strict',
            };

            // رمز التحديث (Refresh Token) في كوكيز HTTP-Only
            res.cookie('refreshToken', result.session.refresh_token, cookieOptions);
            
            // رمز الوصول (Access Token) يمكن إرساله في الجسم أو ككوكيز غير HTTP-Only
            // لكن لأغراض الأمان، سنرسل فقط رمز الوصول في الجسم
            res.status(201).json({
                success: true,
                msg: 'تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني للتأكيد.',
                user: { id: result.user.id, email: result.user.email },
                accessToken: result.session.access_token // رمز الوصول للاستخدام الفوري
            });
        } else {
            res.status(201).json({
                success: true,
                msg: 'تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني للتأكيد.',
                user: { id: result.user.id, email: result.user.email }
            });
        }
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
        // إعداد الكوكيز الآمنة
        const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 أيام
            httpOnly: true, // الأهم: لا يمكن الوصول إليها عبر JavaScript
            secure: process.env.NODE_ENV === 'production', // إرسال عبر HTTPS فقط في الإنتاج
            sameSite: 'strict',
        };

        // رمز التحديث (Refresh Token) في كوكيز HTTP-Only
        res.cookie('refreshToken', result.session.refresh_token, cookieOptions);

        res.status(200).json({
            success: true,
            user: result.user,
            accessToken: result.session.access_token // رمز الوصول للاستخدام الفوري
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
        // يجب أن نستخدم رمز التحديث من الكوكيز لتسجيل الخروج من Supabase
        // لكن بما أننا لا نمرر رمز التحديث إلى authService، سنقوم فقط بمسح الكوكيز
        
        // مسح الكوكيز
        res.clearCookie('refreshToken');

        // في تطبيق حقيقي، يجب أن يتم استدعاء authService.signOut(refreshToken)
        // لكن لتبسيط العملية هنا، نكتفي بمسح الكوكيز
        
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
