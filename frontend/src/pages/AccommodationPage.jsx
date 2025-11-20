import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import '../styles/AccommodationPage.css';

const initialFilters = {
    guests: 1,
    checkIn: '',
    checkOut: '',
    rating: 3.0,
    maxPrice: 500,
};

const AccommodationCard = ({ accommodation }) => (
    <motion.div
        className="accommodation-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
    >
        <div className="card-image" style={{ backgroundImage: `url(${accommodation.imageUrl || ''})` }}></div>
        <div className="card-details">
            <h3>{accommodation.name}</h3>
            <span className="rating">⭐ {accommodation.rating} ({accommodation.reviews} تقييم)</span>
            <p>{accommodation.description.substring(0, 80)}...</p>
            <div className="price">
                {accommodation.price} د.ل <span>/ الليلة</span>
            </div>
            <button className="btn-book">احجز الآن</button>
        </div>
    </motion.div>
);

const AccommodationPage = () => {
    const [accommodations, setAccommodations] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchAccommodation = useCallback(async (currentFilters) => {
        setIsLoading(true);
        setError('');

        // بناء سلسلة الاستعلام من الفلاتر
        const queryParams = new URLSearchParams({
            minPrice: 0, // يمكن إضافة minPrice لاحقاً
            maxPrice: currentFilters.maxPrice,
            rating: currentFilters.rating,
            guests: currentFilters.guests,
            checkIn: currentFilters.checkIn,
            checkOut: currentFilters.checkOut,
        }).toString();

        try {
            const response = await fetch(`/api/v1/poi/accommodation?${queryParams}`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'فشل جلب عروض الإقامة.');
            }

            setAccommodations(data.data.map(item => ({
                ...item,
                // بيانات وهمية إضافية للعرض
                price: Math.floor(Math.random() * (500 - 100 + 1)) + 100,
                reviews: Math.floor(Math.random() * 200) + 10,
                imageUrl: 'https://via.placeholder.com/400x200?text=Accommodation+Image'
            })));
        } catch (err) {
            setError('فشل تحميل البيانات: ' + err.message);
            setAccommodations([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // جلب البيانات عند تحميل الصفحة لأول مرة
    useEffect(() => {
        fetchAccommodation(initialFilters);
    }, [fetchAccommodation]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleSearch = () => {
        fetchAccommodation(filters);
    };

    return (
        <div className="accommodation-page">
            <Header />
            <div className="accommodation-header">
                <h1>🏨 عروض الإقامة في الخمس</h1>
                <p className="subtitle">ابحث وقارن بين أفضل الفنادق والشقق المفروشة</p>
            </div>

            <div className="accommodation-content">
                {/* شريط التصفية */}
                <FilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                />

                {/* النتائج */}
                <div className="results-main">
                    <div className="results-header">
                        <h2 className="results-count">
                            {isLoading ? 'جاري البحث...' : `${accommodations.length} نتيجة مطابقة`}
                        </h2>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {isLoading && <div className="loading-message">جاري تحميل عروض الإقامة...</div>}

                    {!isLoading && accommodations.length > 0 && (
                        <motion.div
                            className="accommodation-list"
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        >
                            {accommodations.map((acc) => (
                                <AccommodationCard key={acc.id} accommodation={acc} />
                            ))}
                        </motion.div>
                    )}

                    {!isLoading && accommodations.length === 0 && !error && (
                        <div className="loading-message">
                            لا توجد عروض إقامة مطابقة لمعايير البحث.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccommodationPage;
