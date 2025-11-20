import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import useDebounce from '../hooks/useDebounce';
import '../styles/ExplorationPage.css'; // سنفترض وجود ملف CSS جديد

const ExplorationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pois, setPois] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // استخدام الخطاف المخصص لتأخير البحث بـ 500 مللي ثانية
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // دالة جلب نقاط الاهتمام (POI)
  const fetchPois = useCallback(async (query) => {
    setIsLoading(true);
    setError('');
    try {
      // سنفترض وجود مسار API لجلب نقاط الاهتمام مع دعم البحث
      // /api/v1/poi/search?q=query
      const response = await fetch(`/api/v1/poi/search?q=${query}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'فشل جلب نقاط الاهتمام.');
      }

      setPois(data.data || []);
    } catch (err) {
      setError('فشل تحميل البيانات: ' + err.message);
      setPois([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تأثير يتم تشغيله عند تغير القيمة المؤجلة للبحث
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchPois(debouncedSearchTerm);
    } else {
      // جلب جميع نقاط الاهتمام أو ترك القائمة فارغة عند مسح حقل البحث
      fetchPois(''); 
    }
  }, [debouncedSearchTerm, fetchPois]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="exploration-page"
    >
      <Header />
      <div className="exploration-content">
        <h1>🏛️ استكشف الخمس</h1>
        <p className="subtitle">ابحث عن المواقع الأثرية، المطاعم، وأماكن الإقامة</p>

        {/* حقل البحث */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="search-bar-container"
        >
          <input
            type="text"
            placeholder="ابحث عن موقع، مطعم، أو فندق..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {isLoading && <div className="loading-spinner"></div>}
        </motion.div>

        {/* عرض النتائج */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="poi-results-container"
        >
          {error && <div className="error-message">{error}</div>}

          {!isLoading && pois.length === 0 && searchTerm && !error && (
            <div className="no-results">
              <p>لا توجد نتائج مطابقة لـ "{searchTerm}".</p>
            </div>
          )}

          {!isLoading && pois.length > 0 && (
            <div className="poi-list">
              {pois.map((poi) => (
                <motion.div
                  key={poi.id}
                  className="poi-item"
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="poi-icon">{/* أيقونة الفئة */}</div>
                  <div className="poi-info">
                    <h3>{poi.name}</h3>
                    <p>{poi.description}</p>
                    <span className="poi-rating">⭐ {poi.rating}</span>
                  </div>
                  <button className="btn-view-map">عرض على الخريطة</button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExplorationPage;
