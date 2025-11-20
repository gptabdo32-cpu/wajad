import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import DiningFilterBar from '../components/DiningFilterBar';
import '../styles/DiningPage.css';

const initialFilters = {
    cuisine: '',
    minRating: 3.0,
    maxPrice: 300,
};

const DiningCard = ({ restaurant }) => (
    <motion.div
        className="dining-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
    >
        <div className="card-image" style={{ backgroundImage: `url(${restaurant.imageUrl || ''})` }}></div>
        <div className="card-details">
            <h3>{restaurant.name}</h3>
            <span className="rating">⭐ {restaurant.rating} ({restaurant.reviews} تقييم)</span>
            <span className="cuisine">{restaurant.cuisine}</span>
            <p>{restaurant.description.substring(0, 80)}...</p>
            <div className="price-range">
                النطاق السعري: {restaurant.priceRange} د.ل
            </div>
            <button className="btn-view">عرض التفاصيل</button>
        </div>
    </motion.div>
);

const DiningPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRestaurants = useCallback(async (currentFilters) => {
        setIsLoading(true);
        setError('');

        // بناء سلسلة الاستعلام من الفلاتر
        const queryParams = new URLSearchParams({
            cuisine: currentFilters.cuisine,
            minRating: currentFilters.minRating,
            maxPrice: currentFilters.maxPrice,
        }).toString();

        try {
            const response = await fetch(`/api/v1/poi/dining?${queryParams}`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'فشل جلب عروض المطاعم.');
            }

            setRestaurants(data.data.map(item => ({
                ...item,
                // بيانات وهمية إضافية للعرض
                cuisine: item.cuisine_type || 'متنوع',
                priceRange: Math.floor(Math.random() * (300 - 50 + 1)) + 50,
                reviews: Math.floor(Math.random() * 150) + 5,
                imageUrl: 'https://via.placeholder.com/400x200?text=Restaurant+Image'
            })));
        } catch (err) {
            setError('فشل تحميل البيانات: ' + err.message);
            setRestaurants([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // جلب البيانات عند تحميل الصفحة لأول مرة
    useEffect(() => {
        fetchRestaurants(initialFilters);
    }, [fetchRestaurants]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleSearch = () => {
        fetchRestaurants(filters);
    };

    return (
        <div className="dining-page">
            <Header />
            <div className="dining-header">
                <h1>🍴 اكتشف أفضل المطاعم والمقاهي</h1>
                <p className="subtitle">ابحث عن مطعمك المفضل حسب المطبخ والتقييم</p>
            </div>

            <div className="dining-content">
                {/* شريط التصفية */}
                <DiningFilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                />

                {/* النتائج */}
                <div className="results-main">
                    <div className="results-header">
                        <h2 className="results-count">
                            {isLoading ? 'جاري البحث...' : `${restaurants.length} مطعم مطابق`}
                        </h2>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {isLoading && <div className="loading-message">جاري تحميل عروض المطاعم...</div>}

                    {!isLoading && restaurants.length > 0 && (
                        <motion.div
                            className="dining-list"
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        >
                            {restaurants.map((rest) => (
                                <DiningCard key={rest.id} restaurant={rest} />
                            ))}
                        </motion.div>
                    )}

                    {!isLoading && restaurants.length === 0 && !error && (
                        <div className="loading-message">
                            لا توجد مطاعم مطابقة لمعايير البحث.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiningPage;
