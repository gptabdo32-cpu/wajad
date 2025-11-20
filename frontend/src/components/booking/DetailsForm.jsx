// wajad/frontend/src/components/booking/DetailsForm.jsx
import React from 'react';
import { motion } from 'framer-motion';

const DetailsForm = ({ formData, handleChange, errors }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2>تفاصيل الحجز</h2>

            <div className="form-group">
                <label htmlFor="bookingDate">التاريخ والوقت</label>
                <input
                    type="datetime-local"
                    id="bookingDate"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    required
                    className={errors.bookingDate ? 'input-invalid' : ''}
                />
                {errors.bookingDate && <p className="input-error">{errors.bookingDate}</p>}
            </div>

            {formData.serviceType === 'Guide' && (
                <div className="form-group">
                    <label htmlFor="durationHours">مدة الجولة (ساعات)</label>
                    <input
                        type="number"
                        id="durationHours"
                        name="durationHours"
                        value={formData.durationHours}
                        onChange={handleChange}
                        min="1"
                        step="0.5"
                        required
                        className={errors.durationHours ? 'input-invalid' : ''}
                    />
                    {errors.durationHours && <p className="input-error">{errors.durationHours}</p>}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="notes">ملاحظات إضافية (اختياري)</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                />
            </div>

            <div className="price-summary">
                <p>السعر الإجمالي التقديري: <strong>{formData.totalPrice} دينار</strong></p>
            </div>
        </motion.div>
    );
};

export default DetailsForm;
