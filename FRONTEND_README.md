# منصة سياحة الخمس - الواجهة الأمامية (React)

## نظرة عامة

تم تطوير الواجهة الأمامية باستخدام **React** مع **Vite** كأداة بناء، مما يوفر أداءً عاليًا وتطويرًا سريعًا.

## المميزات الرئيسية

### 1. **تحسينات UI/UX**
- ✅ **Lazy Loading للصور**: تحميل الصور بشكل ديناميكي لتحسين سرعة التحميل
- ✅ **Smooth Transitions**: انتقالات سلسة بين الصفحات والمكونات
- ✅ **Responsive Design**: تصميم متجاوب يعمل على جميع الأجهزة
- ✅ **Color Scheme**: نظام ألوان متناسق (أزرق البحر المتوسط والذهبي)

### 2. **المكونات الرئيسية**

#### Header Component
- شريط تنقل ثابت مع قائمة ديناميكية
- قائمة هامبرجر للأجهزة الصغيرة
- تأثيرات hover احترافية

#### POI Card Component
- عرض بطاقات جميلة لأماكن الاهتمام
- دعم الصور مع lazy loading
- عرض التفاصيل الإضافية عند الطلب
- شارات التحقق والفئة

#### Map View Component
- خريطة تفاعلية باستخدام Leaflet
- عرض نقاط الاهتمام بألوان مختلفة حسب الفئة
- تصفية حسب الفئة
- نافذة منبثقة (Pop-up) عند الضغط على العلامات
- عرض التفاصيل الجانبية

### 3. **الصفحات**

- **HomePage**: الصفحة الرئيسية مع البحث والتصفية
- **MapViewPage**: خريطة تفاعلية شاملة
- **ExplorationPage**: الاستكشاف والآثار (قيد التطوير)
- **AccommodationPage**: الإقامة (قيد التطوير)
- **DiningPage**: الطعام والمشروبات (قيد التطوير)
- **TransportPage**: النقل والمواصلات (قيد التطوير)
- **SafetyPage**: الأمان والسلامة (قيد التطوير)
- **ProfilePage**: الملف الشخصي (قيد التطوير)

## البنية

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── POICard.jsx
│   │   ├── POICard.css
│   │   ├── MapView.jsx
│   │   └── MapView.css
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── HomePage.css
│   │   ├── MapViewPage.jsx
│   │   ├── MapViewPage.css
│   │   ├── ExplorationPage.jsx
│   │   ├── AccommodationPage.jsx
│   │   ├── DiningPage.jsx
│   │   ├── TransportPage.jsx
│   │   ├── SafetyPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── PlaceholderPage.css
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── index.html
```

## المكتبات المستخدمة

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.x",
    "leaflet": "^1.9.x",
    "react-leaflet": "^4.x",
    "axios": "^1.x",
    "zustand": "^4.x"
  }
}
```

## التثبيت والتشغيل

### التثبيت
```bash
cd frontend
npm install
```

### التطوير
```bash
npm run dev
```

### البناء للإنتاج
```bash
npm run build
```

### المعاينة
```bash
npm run preview
```

## الميزات المتقدمة

### 1. Code Splitting
استخدام `React.lazy()` و `Suspense` لتحميل الصفحات بشكل ديناميكي، مما يحسن سرعة التحميل الأولي.

### 2. Animations
- **Fade In**: ظهور سلس للعناصر
- **Slide In**: انزلاق العناصر من الجانبين
- **Scale In**: تكبير العناصر
- **Hover Effects**: تأثيرات عند تمرير الفأرة

### 3. Responsive Grid System
نظام شبكة متجاوب يتكيف تلقائيًا مع حجم الشاشة:
- Desktop: 4 أعمدة
- Tablet: 2-3 أعمدة
- Mobile: عمود واحد

### 4. Custom Icons
علامات خريطة مخصصة بألوان مختلفة حسب فئة نقطة الاهتمام.

## التحسينات المستقبلية

- [ ] تكامل API الخلفية الفعلية
- [ ] نظام المصادقة والتسجيل
- [ ] نظام الحجز والدفع
- [ ] نظام التقييمات والتعليقات
- [ ] نظام الإشعارات
- [ ] دعم الوضع الليلي (Dark Mode)
- [ ] تحسينات الأداء (PWA)

## المساهمة

للمساهمة في تطوير الواجهة الأمامية:

1. إنشاء فرع جديد: `git checkout -b feature/your-feature`
2. الالتزام بالتغييرات: `git commit -m "Add your feature"`
3. دفع الفرع: `git push origin feature/your-feature`
4. فتح طلب دمج (Pull Request)

## الترخيص

جميع الحقوق محفوظة © 2024 منصة سياحة الخمس
