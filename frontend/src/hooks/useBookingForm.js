// wajad/frontend/src/hooks/useBookingForm.js
import { useState, useCallback } from 'react';

// القيمة الأولية لحالة الحجز
const initialBookingState = {
    serviceType: 'Guide', // 'Guide', 'Accommodation', 'Transport'
    guideId: '',
    poiId: '', // نقطة الاهتمام المرتبطة بالحجز (اختياري)
    bookingDate: '',
    durationHours: 1,
    totalPrice: 50, // سعر مبدئي
    notes: '',
};

/**
 * خطاف مخصص لإدارة حالة نموذج الحجز متعدد الخطوات.
 * يوفر منطق التنقل بين الخطوات، وتحديث حالة النموذج، والتحقق من الصحة الأساسي.
 */
const useBookingForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialBookingState);
    const [errors, setErrors] = useState({});
    const totalSteps = 3; // الخطوات: 1. الخدمة، 2. التفاصيل، 3. الملخص والدفع

    // دالة لتحديث أي حقل في بيانات النموذج
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newFormData = { ...prev, [name]: value };
            
            // منطق تحديث السعر الفوري (مثال: 50 دينار للساعة للمرشد)
            if (name === 'durationHours' && newFormData.serviceType === 'Guide') {
                const hours = parseFloat(value) || 0;
                newFormData.totalPrice = hours * 50;
            }

            return newFormData;
        });
        // مسح الخطأ لهذا الحقل عند التغيير
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }, []);

    // التحقق من صحة الخطوة الحالية
    const validateStep = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        if (currentStep === 1) {
            // التحقق من الخطوة 1: اختيار الخدمة والمرشد
            if (!formData.serviceType) {
                newErrors.serviceType = 'الرجاء اختيار نوع الخدمة.';
                isValid = false;
            }
            if (formData.serviceType === 'Guide' && !formData.guideId) {
                newErrors.guideId = 'الرجاء اختيار مرشد سياحي.';
                isValid = false;
            }
        } else if (currentStep === 2) {
            // التحقق من الخطوة 2: التاريخ والمدة
            if (!formData.bookingDate) {
                newErrors.bookingDate = 'الرجاء تحديد تاريخ ووقت الحجز.';
                isValid = false;
            }
            if (formData.durationHours < 1) {
                newErrors.durationHours = 'يجب أن تكون مدة الحجز ساعة واحدة على الأقل.';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    }, [currentStep, formData]);

    // الانتقال إلى الخطوة التالية
    const nextStep = useCallback(() => {
        if (validateStep()) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    }, [validateStep, totalSteps]);

    // العودة إلى الخطوة السابقة
    const prevStep = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    }, []);

    // إعادة تعيين النموذج
    const resetForm = useCallback(() => {
        setFormData(initialBookingState);
        setCurrentStep(1);
        setErrors({});
    }, []);

    return {
        currentStep,
        formData,
        errors,
        totalSteps,
        handleChange,
        nextStep,
        prevStep,
        resetForm,
        validateStep,
        setErrors // للسماح بتعيين أخطاء API خارجية
    };
};

export default useBookingForm;
