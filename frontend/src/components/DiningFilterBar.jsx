// wajad/frontend/src/components/DiningFilterBar.jsx
import React from 'react';
import { motion } from 'framer-motion';

const CUISINE_OPTIONS = [
    { value: '', label: 'جميع المطابخ' },
    { value: 'Libyan', label: 'ليبي' },
    { value: 'Italian', label: 'إيطالي' },
    { value: 'Turkish', label: 'تركي' },
    { value: 'Seafood', label: 'مأكولات بحرية' },
    { value: 'FastFood', label: 'وجبات سريعة' },
];

const DiningFilterBar = ({ filters, onFilterChange, onSearch }) => {
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
            <h3>تصفية المطاعم</h3>

            <div className="filter-group">
                <label htmlFor="cuisine">نوع المطبخ</label>
                <select
                    id="cuisine"
                    name="cuisine"
                    value={filters.cuisine}
                    onChange={handleInputChange}
                >
                    {CUISINE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="minRating">الحد الأدنى للتقييم (⭐ {filters.minRating})</label>
                <input
                    type="range"
                    id="minRating"
                    name="minRating"
                    min="1"
                    max="5"
                    step="0.5"
                    value={filters.minRating}
                    onChange={handleRangeChange}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="maxPrice">النطاق السعري (حتى {filters.maxPrice} د.ل)</label>
                <div className="price-range-display">
                    <span>0 د.ل</span>
                    <span>{filters.maxPrice} د.ل</span>
                </div>
                <input
                    type="range"
                    id="maxPrice"
                    name="maxPrice"
                    min="50"
                    max="500"
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

export default DiningFilterBar;
