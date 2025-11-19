const path = require("path");
const dotenv = require("dotenv");

// تحميل ملف .env الأساسي
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// يمكن إضافة منطق تحميل ملفات بيئة خاصة بالوضع (مثل .env.production) هنا لاحقًا


const config = {
  // إعدادات الخادم
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },

  // إعدادات قاعدة البيانات (Supabase)
  database: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    projectId: 'kwppbyuooukhsqbwywwp', // معرف المشروع
  },

  // إعدادات المصادقة
  auth: {
    jwtSecret: process.env.JWT_SECRET,
  },

  // مفاتيح API للخدمات الخارجية
  apiKeys: {
    gis: process.env.GIS_API_KEY,
    tlync: process.env.TLYNC_SECRET,
  },
};

module.exports = config;
