// wajad/frontend/src/components/FilterBar.jsx
import React from 'react';
import { motion } from 'framer-motion';

const FilterBar = ({ filters, onFilterChange, onSearch }) => {
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
            <h3>تصفية النتائج</h3>

            <div className="filter-group">
                <label htmlFor="guests">عدد الضيوف</label>
                <input
                    type="number"
                    id="guests"
                    name="guests"
                    min="1"
                    value={filters.guests}
                    onChange={handleInputChange}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="checkIn">تاريخ الوصول</label>
                <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={filters.checkIn}
                    onChange={handleInputChange}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="checkOut">تاريخ المغادرة</label>
                <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    value={filters.checkOut}
                    onChange={handleInputChange}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="rating">الحد الأدنى للتقييم (⭐ {filters.rating})</label>
                <input
                    type="range"
                    id="rating"
                    name="rating"
                    min="1"
                    max="5"
                    step="0.5"
                    value={filters.rating}
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
                    max="1000"
                    step="50"
                    value={filters.maxPrice}
                    onChange={handleRangeChange}
                />
            </div>

            <button className="btn-book" onClick={onSearch} style={{ marginTop: '20px' }}>
                تطبيق التصفية
            </button>
        </motion.div>
    );
};

export default FilterBar;
