import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import './MapViewPage.css';

// تحميل Map3D بشكل كسول (Lazy Loading)
const LazyMap3D = lazy(() => import('../components/Map3D'));

const MapViewPage = () => {
  const [selectedPOI, setSelectedPOI] = useState(null);

import React, { useState, Suspense, lazy, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import './MapViewPage.css';

// تحميل Map3D بشكل كسول (Lazy Loading)
const LazyMap3D = lazy(() => import('../components/Map3D'));

const MapViewPage = () => {
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [pois, setPois] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // دالة جلب جميع نقاط الاهتمام (POI)
  const fetchAllPois = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // سنفترض وجود مسار API لجلب جميع نقاط الاهتمام
      const response = await fetch('/api/v1/poi/all');
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

  useEffect(() => {
    fetchAllPois();
  }, [fetchAllPois]);

  const handleMarkerClick = (poi) => {
    setSelectedPOI(poi);
  };

  if (isLoading) {
    return (
      <div className="map-view-page">
        <Header />
        <div className="loading-map-placeholder">جاري تحميل نقاط الاهتمام...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="map-view-page">
        <Header />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="map-view-page">
      <Header />

      <section className="map-page-content">
        <div className="container">
          <h1>خريطة الخمس التفاعلية</h1>
          <p className="subtitle">
            استكشف جميع أماكن الاهتمام في الخمس على الخريطة التفاعلية
          </p>

          <Suspense fallback={<div className="loading-map-placeholder">جاري تحميل الخريطة ثلاثية الأبعاد...</div>}>
            <LazyMap3D pois={pois} onPOISelect={handleMarkerClick} />
          </Suspense>

          {selectedPOI && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="selected-poi-details"
            >
              <h2>{selectedPOI.name}</h2>
              <div className="poi-info-grid">
                <div className="info-item">
                  <span className="label">الفئة:</span>
                  <span className="value">{selectedPOI.category}</span>
                </motion.div>
                <div className="info-item">
                  <span className="label">التقييم:</span>
                  <span className="value">⭐ {selectedPOI.rating}</span>
                </motion.div>
                <div className="info-item">
                  <span className="label">العنوان:</span>
                  <span className="value">{selectedPOI.address}</span>
                </motion.div>
                {selectedPOI.phone && (
                  <div className="info-item">
                    <span className="label">الهاتف:</span>
                    <span className="value">{selectedPOI.phone}</span>
                  </div>
                )}
              </div>
              <p className="description">{selectedPOI.description}</p>
              <div className="action-buttons">
                <button className="btn btn-primary">احصل على الاتجاهات</button>
                <button className="btn btn-secondary">اتصل الآن</button>
              </div>
            </motion.div>
          )}

          <div className="poi-list-section">
            <h2>قائمة جميع أماكن الاهتمام</h2>
            <motion.div className="poi-list" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
              {pois.map((poi) => (
                <motion.div
                  key={poi.id}
                  className="poi-list-item"
                  onClick={() => handleMarkerClick(poi)}
                  variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="poi-list-icon">
                    {poi.category === 'Archaeological' && '🏛️'}
                    {poi.category === 'Nature' && '🏖️'}
                    {poi.category === 'Food' && '🍴'}
                    {poi.category === 'Accommodation' && '🏨'}
                    {poi.category === 'Transport' && '🚗'}
                    {poi.category === 'Safety' && '🏥'}
                  </div>
                  <div className="poi-list-info">
                    <h4>{poi.name}</h4>
                    <p>{poi.description}</p>
                    <span className="rating">⭐ {poi.rating}</span>
                  </div>
                  <div className="poi-list-arrow">→</motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 منصة سياحة الخمس. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default MapViewPage;
