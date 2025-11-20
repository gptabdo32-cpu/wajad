// wajad/frontend/src/components/booking/ServiceSelection.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ServiceSelection = ({ formData, handleChange, errors }) => {
    const services = [
        { type: 'Guide', icon: '🧑‍💼', title: 'مرشد سياحي', description: 'جولة خاصة مع مرشد محلي معتمد.' },
        { type: 'Accommodation', icon: '🏨', title: 'إقامة', description: 'حجز فندق أو شقة مفروشة.' },
        { type: 'Transport', icon: '🚗', title: 'نقل', description: 'تأجير سيارة أو خدمة توصيل.' },
    ];

    const handleServiceSelect = (type) => {
        handleChange({ target: { name: 'serviceType', value: type } });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2>اختر نوع الخدمة</h2>
            <div className="service-cards-container">
                {services.map((service) => (
                    <motion.div
                        key={service.type}
                        className={`service-card ${formData.serviceType === service.type ? 'selected' : ''}`}
                        onClick={() => handleServiceSelect(service.type)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span style={{ fontSize: '2rem' }}>{service.icon}</span>
                        <h4>{service.title}</h4>
                        <p style={{ fontSize: '0.9rem', color: '#555' }}>{service.description}</p>
                    </motion.div>
                ))}
            </div>
            {errors.serviceType && <p className="input-error">{errors.serviceType}</p>}

            {/* حقل اختيار المرشد يظهر فقط إذا كانت الخدمة هي مرشد سياحي */}
            {formData.serviceType === 'Guide' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="form-group"
                >
                    <label htmlFor="guideId">اختر المرشد</label>
                    <select
                        id="guideId"
                        name="guideId"
                        value={formData.guideId}
                        onChange={handleChange}
                        className={errors.guideId ? 'input-invalid' : ''}
                    >
                        <option value="">-- اختر مرشد --</option>
                        <option value="guide-1">أحمد علي - مرشد معتمد (50 د.ل/ساعة)</option>
                        <option value="guide-2">فاطمة محمد - مرشدة معتمدة (60 د.ل/ساعة)</option>
                        <option value="guide-3">محمود حسن - مرشد معتمد (45 د.ل/ساعة)</option>
                    </select>
                    {errors.guideId && <p className="input-error">{errors.guideId}</p>}
                </motion.div>
            )}
        </motion.div>
    );
};

export default ServiceSelection;
