// siyaha-alkhums/config/supabase.js
// هذا الملف يستخدم لتهيئة عميل Supabase
// يجب استبدال المتغيرات البيئية بالقيم الفعلية عند النشر

const { createClient } = require('@supabase/supabase-js');

// يجب تعيين هذه المتغيرات في بيئة التشغيل (مثل ملف .env)
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_ANON_KEY';

// تهيئة عميل Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
