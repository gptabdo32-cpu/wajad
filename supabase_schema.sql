-- استعلامات SQL لإنشاء جداول منصة الخمس السياحية في Supabase

-- 1. تفعيل امتداد UUID و PostGIS (ضروري لـ GIS)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. جدول المستخدمين (users)
-- ملاحظة: نستخدم 'password_hash' بدلاً من 'password' لتجنب الخلط مع وظيفة المصادقة المدمجة في Supabase
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- لتخزين كلمة المرور المشفرة
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'guide', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. جدول نقاط الاهتمام (pois)
CREATE TABLE pois (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(500) NOT NULL,
    address VARCHAR(255) NOT NULL,
    -- استخدام نوع بيانات PostGIS للموقع الجغرافي
    location GEOMETRY(Point, 4326) NOT NULL,
    category VARCHAR(50)[] NOT NULL, -- مصفوفة من الفئات
    images TEXT[], -- مصفوفة من روابط الصور
    rating NUMERIC(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    license_number VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهرس مكاني على عمود الموقع لتحسين استعلامات GIS
CREATE INDEX pois_location_idx ON pois USING GIST (location);

-- 4. إعداد سياسات أمان مستوى الصف (RLS) (موصى به بشدة في Supabase)
-- يجب تفعيل RLS على الجداول بعد إنشائها في واجهة Supabase

-- مثال لسياسة RLS على جدول المستخدمين (للتطبيق اليدوي)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow authenticated users to view their own data" ON users FOR SELECT USING (auth.uid() = id);

-- 5. تفعيل سياسات أمان مستوى الصف (RLS) وإضافة السياسات الأساسية

-- تفعيل RLS على الجداول
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pois ENABLE ROW LEVEL SECURITY;

-- سياسات جدول المستخدمين (users)
-- السماح للمستخدمين المصادق عليهم بقراءة بياناتهم الخاصة فقط
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id);
-- السماح للمستخدمين المصادق عليهم بتحديث بياناتهم الخاصة فقط
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id);

-- سياسات جدول نقاط الاهتمام (pois)
-- السماح لجميع المستخدمين (المصادق عليهم وغير المصادق عليهم) بقراءة جميع نقاط الاهتمام
CREATE POLICY "Enable read access for all users" ON pois FOR SELECT USING (TRUE);
-- السماح للمستخدمين الذين لديهم دور 'guide' أو 'admin' بإنشاء نقاط اهتمام جديدة
CREATE POLICY "Guides and Admins can create POIs" ON pois FOR INSERT WITH CHECK (auth.role() IN ('guide', 'admin'));
-- السماح للمستخدمين الذين لديهم دور 'guide' أو 'admin' بتحديث نقاط الاهتمام
CREATE POLICY "Guides and Admins can update POIs" ON pois FOR UPDATE USING (auth.role() IN ('guide', 'admin'));
-- السماح للمستخدمين الذين لديهم دور 'admin' بحذف نقاط الاهتمام
CREATE POLICY "Admins can delete POIs" ON pois FOR DELETE USING (auth.role() = 'admin');

-- ملاحظة: يجب أن تكون وظائف auth.uid() و auth.role() متاحة في بيئة Supabase

-- 6. جدول المرشدين (guides)
CREATE TABLE guides (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    bio VARCHAR(500),
    languages VARCHAR(50)[], -- مصفوفة من اللغات التي يتحدثها المرشد
    rating NUMERIC(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. جدول التقييمات (reviews)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    poi_id UUID REFERENCES pois(id) ON DELETE CASCADE,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- ضمان أن المستخدم لا يمكنه تقييم نفس نقطة الاهتمام أكثر من مرة
    UNIQUE (user_id, poi_id)
);

-- 8. تفعيل RLS وإضافة السياسات لجداول guides و reviews

ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- سياسات جدول المرشدين (guides)
-- السماح للجميع بقراءة ملفات المرشدين
CREATE POLICY "Enable read access for all guides" ON guides FOR SELECT USING (TRUE);
-- السماح للمرشد بتحديث ملفه الشخصي فقط
CREATE POLICY "Guides can update their own profile" ON guides FOR UPDATE USING (auth.uid() = user_id);
-- السماح للمسؤولين بإنشاء ملفات المرشدين (يتم إنشاؤها عند الترقية)
CREATE POLICY "Admins can insert guides" ON guides FOR INSERT WITH CHECK (auth.role() = 'admin');

-- سياسات جدول التقييمات (reviews)
-- السماح للجميع بقراءة التقييمات
CREATE POLICY "Enable read access for all reviews" ON reviews FOR SELECT USING (TRUE);
-- السماح للمستخدمين المصادق عليهم بإنشاء تقييمات
CREATE POLICY "Authenticated users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- السماح للمستخدم بتحديث تقييمه الخاص فقط
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
-- السماح للمستخدم بحذف تقييمه الخاص فقط
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- 9. جدول الحجوزات (bookings)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    guide_id UUID REFERENCES guides(user_id) ON DELETE CASCADE,
    booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours NUMERIC(4, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_id UUID, -- سيتم ربطه بجدول المدفوعات لاحقًا
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. تفعيل RLS وإضافة السياسات لجدول bookings

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- سياسات جدول الحجوزات (bookings)
-- السماح للمستخدمين المصادق عليهم بإنشاء حجوزات
CREATE POLICY "Authenticated users can insert bookings" ON bookings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- السماح للمستخدم بقراءة حجوزاته الخاصة
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
-- السماح للمرشد بقراءة الحجوزات المتعلقة به
CREATE POLICY "Guides can view their related bookings" ON bookings FOR SELECT USING (auth.uid() = guide_id);
-- السماح للمستخدم بإلغاء حجزه (تحديث الحالة)
CREATE POLICY "Users can update their own bookings status" ON bookings FOR UPDATE USING (auth.uid() = user_id AND status IN ('pending', 'confirmed')) WITH CHECK (status = 'cancelled');
-- السماح للمرشد بتأكيد الحجز (تحديث الحالة)
CREATE POLICY "Guides can update their related bookings status" ON bookings FOR UPDATE USING (auth.uid() = guide_id AND status = 'pending') WITH CHECK (status = 'confirmed');

-- 11. جدول المدفوعات (payments)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'LYD',
    payment_method VARCHAR(50), -- مثل 'T-Lync', 'Credit Card', 'Direct Carrier Billing'
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- تحديث جدول الحجوزات لربط payment_id
ALTER TABLE bookings ADD CONSTRAINT fk_payment_id FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL;

-- 12. تفعيل RLS وإضافة السياسات لجدول payments

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- سياسات جدول المدفوعات (payments)
-- السماح للمستخدمين بقراءة مدفوعاتهم الخاصة فقط
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
-- السماح للمستخدمين المصادق عليهم بإنشاء مدفوعات
CREATE POLICY "Authenticated users can insert payments" ON payments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- منع التحديث والحذف بعد الإنشاء لضمان سجل مالي ثابت (يتم التعامل مع الإلغاء/الاسترداد عبر إدخال جديد أو تحديث الحالة)

-- 13. جدول نقاط الولاء (loyalty_points)
CREATE TABLE loyalty_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    points_change INTEGER NOT NULL, -- يمكن أن تكون موجبة (مكافأة) أو سالبة (استرداد)
    reason VARCHAR(100) NOT NULL, -- مثل 'Booking Confirmation', 'Review Submission', 'Points Redemption'
    related_entity_id UUID, -- يمكن أن يشير إلى booking_id أو review_id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. تفعيل RLS وإضافة السياسات لجدول loyalty_points

ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

-- سياسات جدول نقاط الولاء (loyalty_points)
-- السماح للمستخدمين بقراءة سجل نقاطهم الخاصة فقط
CREATE POLICY "Users can view their own loyalty points history" ON loyalty_points FOR SELECT USING (auth.uid() = user_id);
-- السماح للمسؤولين فقط بإضافة أو تحديث أو حذف سجلات النقاط لضمان سلامة النظام
CREATE POLICY "Admins can manage loyalty points" ON loyalty_points FOR ALL USING (auth.role() = 'admin') WITH CHECK (auth.role() = 'admin');
