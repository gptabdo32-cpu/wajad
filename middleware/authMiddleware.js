// siyaha-alkhums/middleware/authMiddleware.js
const supabase = require('../config/supabase');

/**
 * Middleware لحماية المسارات
 * يتحقق من وجود رمز JWT صالح في رأس الطلب (Authorization: Bearer <token>)
 * أو في ملفات تعريف الارتباط (Cookies)
 */
exports.protect = async (req, res, next) => {
    let token;

    // 1. التحقق من رأس التخويل (Authorization Header)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. إذا لم يكن هناك رمز وصول، تحقق من رمز التحديث في الكوكيز
    if (!token) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ success: false, msg: 'غير مصرح به، لا يوجد رمز وصول أو تحديث' });
        }

        // محاولة تحديث الجلسة باستخدام رمز التحديث
        try {
            // استخدام setSession مع رمز التحديث لتحديث الجلسة والحصول على رمز وصول جديد
            const { data, error } = await supabase.auth.setSession(refreshToken);

            if (error) {
                // إذا فشل التحديث، مسح الكوكيز وإرجاع خطأ
                res.clearCookie('refreshToken');
                return res.status(401).json({ success: false, msg: 'غير مصرح به، فشل تحديث الرمز' });
            }

            // تحديث رمز الوصول الجديد
            token = data.session.access_token;

            // إعادة تعيين رمز التحديث الجديد في الكوكيز
            const cookieOptions = {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 أيام
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            };
            res.cookie('refreshToken', data.session.refresh_token, cookieOptions);

            // إرسال رمز الوصول الجديد في رأس الاستجابة (مفيد للواجهة الأمامية)
            res.setHeader('X-Access-Token', token);

        } catch (err) {
            return res.status(500).json({ success: false, msg: 'خطأ في تحديث الرمز' });
        }
    }

    // 3. التحقق من رمز الوصول (سواء كان الأصلي أو المحدث)
    try {
        // استخدام Supabase للتحقق من الرمز
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({ success: false, msg: 'غير مصرح به، رمز وصول غير صالح' });
        }

        // إضافة معرف المستخدم إلى الطلب
        req.userId = data.user.id;
        next();

    } catch (err) {
        return res.status(500).json({ success: false, msg: 'خطأ في التحقق من الرمز' });
    }
};
