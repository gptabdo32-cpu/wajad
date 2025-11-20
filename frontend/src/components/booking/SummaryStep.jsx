// wajad/frontend/src/components/booking/SummaryStep.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SummaryStep = ({ formData }) => {
    // دالة مساعدة لعرض اسم المرشد
    const getGuideName = (guideId) => {
        switch (guideId) {
            case 'guide-1': return 'أحمد علي';
            case 'guide-2': return 'فاطمة محمد';
            case 'guide-3': return 'محمود حسن';
            default: return 'غير محدد';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2>ملخص الحجز والدفع</h2>
            <div className="summary-details">
                <p>
                    <span>نوع الخدمة:</span>
                    <span>{formData.serviceType === 'Guide' ? 'مرشد سياحي' : formData.serviceType === 'Accommodation' ? 'إقامة' : 'نقل'}</span>
                </p>
                
                {formData.serviceType === 'Guide' && (
                    <p>
                        <span>المرشد المختار:</span>
                        <span>{getGuideName(formData.guideId)}</span>
                    </p>
                )}

                <p>
                    <span>التاريخ والوقت:</span>
                    <span>{new Date(formData.bookingDate).toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })}</span>
                </p>

                {formData.serviceType === 'Guide' && (
                    <p>
                        <span>مدة الحجز:</span>
                        <span>{formData.durationHours} ساعة</span>
                    </p>
                )}

                <p>
                    <span>ملاحظات:</span>
                    <span>{formData.notes || 'لا توجد'}</span>
                </p>

                <p>
                    <span>المبلغ الإجمالي المستحق:</span>
                    <span>{formData.totalPrice} دينار ليبي</span>
                </p>
            </div>

            <div className="form-group">
                <label>طريقة الدفع</label>
                <select>
                    <option>بطاقة ائتمانية (Visa/Mastercard)</option>
                    <option>محفظة إلكترونية (مثال: سداد)</option>
                    <option>تحويل مصرفي</option>
                </select>
            </div>
            
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#555' }}>
                بالضغط على "تأكيد الحجز والدفع"، أنت توافق على شروط الخدمة.
            </p>
        </motion.div>
    );
};

export default SummaryStep;
