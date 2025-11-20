import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import TransportFilterBar from '../components/TransportFilterBar';
import '../styles/TransportPage.css';

const initialFilters = {
    type: '',
    capacity: 4,
    maxPrice: 500,
};

const TransportCard = ({ service }) => (
    <motion.div
        className="transport-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
    >
        <div className="card-image" style={{ backgroundImage: `url(${service.imageUrl || ''})` }}></div>
        <div className="card-details">
            <h3>{service.name}</h3>
            <span className="type">النوع: {service.transportType}</span>
            <span className="capacity">السعة: {service.capacity} ركاب</span>
            <p>{service.description.substring(0, 80)}...</p>
            <div className="price">
                السعر اليومي: {service.pricePerDay} د.ل
            </div>
            <button className="btn-view">احجز الآن</button>
        </div>
    </motion.div>
);

const TransportPage = () => {
    const [transportServices, setTransportServices] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchTransportServices = useCallback(async (currentFilters) => {
        setIsLoading(true);
        setError('');

        // بناء سلسلة الاستعلام من الفلاتر
        const queryParams = new URLSearchParams({
            type: currentFilters.type,
            capacity: currentFilters.capacity,
            maxPrice: currentFilters.maxPrice,
        }).toString();

        try {
            const response = await fetch(`/api/v1/poi/transport?${queryParams}`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'فشل جلب عروض النقل.');
            }

            setTransportServices(data.data.map(item => ({
                ...item,
                // بيانات وهمية إضافية للعرض
                transportType: item.transport_type || 'تأجير سيارات',
                capacity: item.capacity || 4,
                pricePerDay: item.price_per_day || Math.floor(Math.random() * (500 - 100 + 1)) + 100,
                imageUrl: 'https://via.placeholder.com/400x200?text=Transport+Service'
            })));
        } catch (err) {
            setError('فشل تحميل البيانات: ' + err.message);
            setTransportServices([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // جلب البيانات عند تحميل الصفحة لأول مرة
    useEffect(() => {
        fetchTransportServices(initialFilters);
    }, [fetchTransportServices]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleSearch = () => {
        fetchTransportServices(filters);
    };

    return (
        <div className="transport-page">
            <Header />
            <div className="transport-header">
                <h1>🚗 النقل والمواصلات</h1>
                <p className="subtitle">ابحث عن وسيلة النقل المثالية لرحلتك</p>
            </div>

            <div className="transport-content">
                {/* شريط التصفية */}
                <TransportFilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                />

                {/* النتائج */}
                <div className="results-main">
                    <div className="results-header">
                        <h2 className="results-count">
                            {isLoading ? 'جاري البحث...' : `${transportServices.length} خدمة نقل مطابقة`}
                        </h2>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {isLoading && <div className="loading-message">جاري تحميل عروض النقل...</div>}

                    {!isLoading && transportServices.length > 0 && (
                        <motion.div
                            className="transport-list"
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        >
                            {transportServices.map((service) => (
                                <TransportCard key={service.id} service={service} />
                            ))}
                        </motion.div>
                    )}

                    {!isLoading && transportServices.length === 0 && !error && (
                        <div className="loading-message">
                            لا توجد خدمات نقل مطابقة لمعايير البحث.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransportPage;
