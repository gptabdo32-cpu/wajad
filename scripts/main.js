// scripts/main.js - نقطة الدخول الرئيسية للتطبيق

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Siyaha Al-Khums Application...');

    // تهيئة المصادقة
    initAuth();

    // تهيئة الخريطة
    initMap();

    // إضافة مستمع للزر "ابدأ الاستكشاف"
    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
        });
    }

    console.log('Application initialized successfully!');
});

// معالجة الأخطاء العامة
window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
});

// معالجة الأخطاء غير المعالجة في الـ Promises
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});
