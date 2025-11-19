// utils/sendTokenResponse.js
const sendTokenResponse = (user, statusCode, res) => {
    // إنشاء رمز JWT
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 يوم
        httpOnly: true
    };

    // إذا كانت بيئة الإنتاج، استخدم HTTPS فقط
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
};

module.exports = sendTokenResponse;
