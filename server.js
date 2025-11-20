// server.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const config = require('./config/config');
const supabase = require('./config/supabase');

/// 2. إعداد تطبيق Express
const app = express();
const errorHandler = require('./middleware/errorMiddleware');

// 1. إعداد عميل Supabase
// يمكن استخدام هذا العميل في المسارات ووحدات التحكم للوصول إلى Supabase
app.set('supabase', supabase);

// 3. إعداد Middlewares الأساسية
// تكوين CORS للسماح بتبادل الكوكيز
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // يجب تحديث هذا في الإنتاج
    credentials: true,
}));

app.use(helmet()); // إضافة رؤوس أمان HTTP
app.use(express.json()); // لتحليل طلبات JSON
app.use(cookieParser()); // لتحليل الكوكيز
app.use(express.urlencoded({ extended: true })); // لتحليل طلبات URL-encoded

// 4. إعداد المسارات (Routes)
const authRoutes = require('./routes/auth');
const poiRoutes = require('./routes/poi');
const itineraryRoutes = require('./routes/itinerary'); // إضافة مسارات مسار الرحلة
const bookingRoutes = require('./routes/booking'); // إضافة مسارات الحجز
const myCredRoutes = require('./routes/mycred'); // إضافة مسارات نقاط الولاء
const paymentRoutes = require('./routes/payment'); // إضافة مسارات الدفع

// مسار اختبار أساسي للتحقق من عمل الخادم
app.get('/api/v1/status', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Siyaha Al-Khums API is running smoothly.',
        environment: config.server.env,
        port: config.server.port
    });
});

// ربط مسارات المصادقة
app.use('/api/v1/auth', authRoutes);

// ربط مسارات نقاط الاهتمام (POI)
app.use('/api/v1/poi', poiRoutes);

// ربط مسارات مسار الرحلة (Itinerary)
app.use('/api/v1/itinerary', itineraryRoutes);

// ربط مسارات الحجز (Bookings)
app.use('/api/v1/bookings', bookingRoutes);

// ربط مسارات الدفع (Payments)
app.use('/api/v1/payments', paymentRoutes);

// ربط مسارات نقاط الولاء (MyCred)
app.use('/api/v1/mycred', myCredRoutes);

// 5. وسيط معالجة الأخطاء (يجب أن يكون بعد جميع المسارات)
app.use(errorHandler);

// 6. تقديم الملفات الثابتة (الواجهة الأمامية)
// بما أننا نستخدم React/Vite، فإن الخادم الخلفي لا يقدم الواجهة الأمامية بشكل مباشر.
// يجب أن يتم تقديم الواجهة الأمامية عبر خادم Vite للتطوير أو عبر خادم ثابت للإنتاج.
// تم حذف المسارات القديمة التي كانت تشير إلى ملفات HTML/CSS/JS في جذر المشروع.

// 6. تشغيل الخادم
const PORT = config.server.port;
app.listen(PORT, () => {
    console.log(`Server running in ${config.server.env} mode on port ${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
});
