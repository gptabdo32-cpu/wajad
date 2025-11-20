import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useBookingForm from '../hooks/useBookingForm';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import '../styles/BookingPage.css';

// استيراد مكونات الخطوات (سيتم إنشاؤها في المرحلة التالية)
import ServiceSelection from '../components/booking/ServiceSelection';
import DetailsForm from '../components/booking/DetailsForm';
import SummaryStep from '../components/booking/SummaryStep';

const BookingPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');

    // استخدام الخطاف المخصص لإدارة حالة النموذج
    const {
        currentStep,
        formData,
        errors,
        totalSteps,
        nextStep,
        prevStep,
        resetForm,
        handleChange,
        setErrors
    } = useBookingForm();

    if (!isAuthenticated) {
        return (
            <div className="booking-container">
                <div className="booking-card">
                    <h1>يجب تسجيل الدخول أولاً</h1>
                    <p>لإنشاء حجز، يجب أن تكون مسجل دخول.</p>
                    <button className="btn-primary" onClick={() => navigate('/login')}>
                        تسجيل الدخول
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/v1/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    guideId: formData.guideId,
                    bookingDate: formData.bookingDate,
                    durationHours: parseFloat(formData.durationHours),
                    totalPrice: formData.totalPrice
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // استخدام setErrors لتحديث أخطاء النموذج
                if (response.status === 400 && data.errors) {
                    const formErrors = {};
                    data.errors.forEach(err => {
                        formErrors[err.path[0]] = err.message;
                    });
                    setErrors(formErrors);
                }
                throw new Error(data.msg || 'فشل إنشاء الحجز');
            }

            setSuccess('تم إنشاء الحجز بنجاح! يمكنك الآن المتابعة للدفع.');
            resetForm(); // إعادة تعيين النموذج بعد النجاح
            setTimeout(() => navigate('/profile'), 3000);
        } catch (err) {
            setApiError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // دالة لعرض المكون الحالي بناءً على الخطوة
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <ServiceSelection formData={formData} handleChange={handleChange} errors={errors} />;
            case 2:
                return <DetailsForm formData={formData} handleChange={handleChange} errors={errors} />;
            case 3:
                return <SummaryStep formData={formData} />;
            default:
                return null;
        }
    };

    // متغيرات framer-motion للانتقال بين الخطوات
    const stepVariants = {
        initial: { opacity: 0, x: 100 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -100 }
    };

    return (
        <div className="booking-container">
            <Header />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="booking-card"
            >
                <h1>حجز خدمة سياحية</h1>
                <p className="booking-subtitle">خطوة {currentStep} من {totalSteps}: {currentStep === 1 ? 'اختيار الخدمة' : currentStep === 2 ? 'التفاصيل والوقت' : 'الملخص والدفع'}</p>

                {/* شريط التقدم */}
                <div className="progress-bar">
                    <motion.div
                        className="progress-fill"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {apiError && <div className="error-message">{apiError}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={currentStep === totalSteps ? handleSubmit : (e) => e.preventDefault()}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            variants={stepVariants}
                            initial="initial"
                            animate="in"
                            exit="out"
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="step-content"
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>

                    <div className="form-actions">
                        {currentStep > 1 && (
                            <motion.button
                                type="button"
                                className="btn-secondary"
                                onClick={prevStep}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                &larr; السابق
                            </motion.button>
                        )}

                        {currentStep < totalSteps && (
                            <motion.button
                                type="button"
                                className="btn-primary"
                                onClick={nextStep}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                التالي &rarr;
                            </motion.button>
                        )}

                        {currentStep === totalSteps && (
                            <motion.button
                                type="submit"
                                className="btn-primary"
                                disabled={isLoading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isLoading ? 'جاري تأكيد الحجز...' : 'تأكيد الحجز والدفع'}
                            </motion.button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default BookingPage;
