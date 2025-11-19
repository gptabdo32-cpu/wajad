// middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const supabase = require('../utils/supabaseClient');

// حماية المسارات
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // تعيين الرمز من رأس Authorization
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        // تعيين الرمز من ملفات تعريف الارتباط (Cookies)
        token = req.cookies.token;
    }

    // التأكد من وجود الرمز
    if (!token) {
        return res.status(401).json({ success: false, error: 'غير مصرح لك بالوصول إلى هذا المسار.' });
    }

    try {
        // التحقق من الرمز
        const decoded = jwt.verify(token, config.auth.jwtSecret);

        // جلب المستخدم وتمريره إلى الطلب
        const { data: users, error } = await supabase
            .from('users')
            .select('id, role')
            .eq('id', decoded.id);

        if (error || users.length === 0) {
            return res.status(401).json({ success: false, error: 'غير مصرح لك بالوصول إلى هذا المسار.' });
        }

        req.user = users[0];

        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'غير مصرح لك بالوصول إلى هذا المسار.' });
    }
};

// منح الوصول لأدوار محددة
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: `دور المستخدم (${req.user.role}) غير مصرح له بالوصول إلى هذا المسار.` });
        }
        next();
    };
};
