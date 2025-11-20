// wajad/frontend/src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * خطاف مخصص لتأخير تحديث قيمة ما حتى يتوقف المستخدم عن تغييرها لفترة محددة.
 * يستخدم بشكل أساسي لتحسين أداء البحث الآني (Live Search) عن طريق تقليل عدد طلبات API.
 *
 * @param {any} value - القيمة المراد تأخير تحديثها (عادةً ما تكون قيمة حقل الإدخال).
 * @param {number} delay - فترة التأخير بالمللي ثانية (عادةً 500ms).
 * @returns {any} القيمة المؤجلة.
 */
function useDebounce(value, delay) {
  // حالة لتخزين القيمة المؤجلة
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // إعداد مؤقت زمني (Timer) لتحديث القيمة المؤجلة بعد فترة التأخير
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // دالة التنظيف (Cleanup function)
    // يتم استدعاؤها في كل مرة تتغير فيها القيمة (value) أو فترة التأخير (delay)
    // قبل تنفيذ التأثير الجديد. هذا يضمن إلغاء المؤقت السابق قبل إعداد مؤقت جديد.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // يعاد تشغيل التأثير فقط إذا تغيرت القيمة أو فترة التأخير

  return debouncedValue;
}

export default useDebounce;
