// wajad/frontend/src/components/TransportFilterBar.jsx
import React from 'react';
import { motion } from 'framer-motion';

const TRANSPORT_OPTIONS = [
    { value: '', label: 'جميع الأنواع' },
    { value: 'CarRental', label: 'تأجير سيارات' },
    { value: 'TaxiService', label: 'خدمة تاكسي' },
    { value: 'Bus', label: 'حافلة' },
    { value: 'Ferry', label: 'عبّارة' },
];

const TransportFilterBar = ({ filters, onFilterChange, onSearch }) => {
    const handleRangeChange = (e) => {
        onFilterChange({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleInputChange = (e) => {
        onFilterChange({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    return (
        <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="filter-sidebar"
        >
            <h3>تصفية خيارات النقل</h3>

            <div className="filter-group">
                <label htmlFor="type">نوع الخدمة</label>
                <select
                    id="type"
                    name="type"
                    value={filters.type}
                    onChange={handleInputChange}
                >
                    {TRANSPORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="capacity">الحد الأدنى للسعة (ركاب: {filters.capacity})</label>
                <input
                    type="range"
                    id="capacity"
                    name="capacity"
                    min="1"
                    max="10"
                    step="1"
                    value={filters.capacity}
                    onChange={handleRangeChange}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="maxPrice">الحد الأقصى للسعر اليومي (حتى {filters.maxPrice} د.ل)</label>
                <div className="price-range-display">
                    <span>0 د.ل</span>
                    <span>{filters.maxPrice} د.ل</span>
                </div>
                <input
                    type="range"
                    id="maxPrice"
                    name="maxPrice"
                    min="50"
                    max="1000"
                    step="50"
                    value={filters.maxPrice}
                    onChange={handleRangeChange}
                />
            </div>

            <button className="btn-view" onClick={onSearch} style={{ marginTop: '20px' }}>
                تطبيق التصفية
            </button>
        </motion.div>
    );
};

export default TransportFilterBar;
