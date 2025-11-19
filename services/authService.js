// siyaha-alkhums/services/authService.js
const supabase = require('../config/supabase');

/**
 * تسجيل مستخدم جديد
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @returns {Object} بيانات المستخدم أو خطأ
 */
exports.signUp = async (email, password, username) => {
    try {
        // استخدام وظيفة التسجيل المدمجة في Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                    // يمكن إضافة حقول أخرى هنا مثل role
                }
            }
        });

        if (error) throw error;

        // بعد التسجيل الناجح، نحتاج إلى تحديث جدول 'users' الخاص بنا
        // لربط المستخدم الجديد بالدور (role) الافتراضي
        if (data.user) {
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    { id: data.user.id, username: username, email: email, role: 'user' }
                ]);

            if (insertError) {
                // يجب التعامل مع هذا الخطأ بعناية، قد يعني أن المستخدم تم إنشاؤه في Auth
                // ولكن فشل في جدولنا المخصص.
                console.error("Error inserting user into custom 'users' table:", insertError);
                // يمكن حذف المستخدم من Auth هنا إذا لزم الأمر
            }
        }

        return { user: data.user };
    } catch (error) {
        return { error: error.message };
    }
};

/**
 * تسجيل دخول المستخدم
 * @param {string} email
 * @param {string} password
 * @returns {Object} بيانات الجلسة أو خطأ
 */
exports.signIn = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        return { session: data.session, user: data.user };
    } catch (error) {
        return { error: error.message };
    }
};

/**
 * تسجيل خروج المستخدم
 * @returns {Object} خطأ أو لا شيء
 */
exports.signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return {};
    } catch (error) {
        return { error: error.message };
    }
};

/**
 * الحصول على بيانات المستخدم من جدول 'users' المخصص
 * @param {string} userId
 * @returns {Object} بيانات المستخدم أو خطأ
 */
exports.getUserProfile = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, username, email, role')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return { profile: data };
    } catch (error) {
        return { error: error.message };
    }
};
