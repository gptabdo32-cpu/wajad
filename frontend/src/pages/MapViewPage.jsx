import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Map3D from '../components/Map3D';
import './MapViewPage.css';

const MapViewPage = () => {
  const [selectedPOI, setSelectedPOI] = useState(null);

  // Mock POI data
  const mockPOIs = [
    {
      id: 1,
      name: 'لبدة الكبرى',
      category: 'Archaeological',
      description: 'موقع أثري روماني مهم',
      latitude: 32.6375,
      longitude: 14.2917,
      rating: 4.8,
      address: 'الخمس، ليبيا',
      phone: '+218 24 123 4567',
      isVerified: true,
    },
    {
      id: 2,
      name: 'شاطئ الخمس',
      category: 'Nature',
      description: 'شاطئ جميل مع رمال ذهبية',
      latitude: 32.6500,
      longitude: 14.2700,
      rating: 4.5,
      address: 'الخمس، ليبيا',
      isVerified: true,
    },
    {
      id: 3,
      name: 'مطعم المأكولات البحرية',
      category: 'Food',
      description: 'مطعم متخصص في المأكولات البحرية',
      latitude: 32.6400,
      longitude: 14.2800,
      rating: 4.2,
      address: 'الخمس، ليبيا',
      phone: '+218 24 987 6543',
      isVerified: true,
    },
    {
      id: 4,
      name: 'فندق الخمس الفاخر',
      category: 'Accommodation',
      description: 'فندق خمس نجوم',
      latitude: 32.6350,
      longitude: 14.2900,
      rating: 4.6,
      address: 'الخمس، ليبيا',
      phone: '+218 24 555 6789',
      isVerified: true,
    },
    {
      id: 5,
      name: 'محطة النقل الرئيسية',
      category: 'Transport',
      description: 'محطة نقل عام رئيسية',
      latitude: 32.6450,
      longitude: 14.2850,
      rating: 3.8,
      address: 'الخمس، ليبيا',
      isVerified: true,
    },
    {
      id: 6,
      name: 'مستشفى الخمس العام',
      category: 'Safety',
      description: 'مستشفى عام متكامل',
      latitude: 32.6300,
      longitude: 14.2750,
      rating: 4.0,
      address: 'الخمس، ليبيا',
      phone: '+218 24 111 2222',
      isVerified: true,
    },
  ];

  const handleMarkerClick = (poi) => {
    setSelectedPOI(poi);
  };

  return (
    <div className="map-view-page">
      <Header />

      <section className="map-page-content">
        <div className="container">
          <h1>خريطة الخمس التفاعلية</h1>
          <p className="subtitle">
            استكشف جميع أماكن الاهتمام في الخمس على الخريطة التفاعلية
          </p>

          <Map3D pois={mockPOIs} onPOISelect={handleMarkerClick} />

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
                  </motion.div>
                )}
              </motion.div>
              <p className="description">{selectedPOI.description}</p>
              <div className="action-buttons">
                <button className="btn btn-primary">احصل على الاتجاهات</button>
                <button className="btn btn-secondary">اتصل الآن</button>
              </motion.div>
            </motion.div>
          )}

          <div className="poi-list-section">
            <h2>قائمة جميع أماكن الاهتمام</h2>
            <motion.div className="poi-list" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
              {mockPOIs.map((poi) => (
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
                  </motion.div>
                  <div className="poi-list-info">
                    <h4>{poi.name}</h4>
                    <p>{poi.description}</p>
                    <span className="rating">⭐ {poi.rating}</span>
                  </motion.div>
                  <div className="poi-list-arrow">→</motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 منصة سياحة الخمس. جميع الحقوق محفوظة.</p>
        </motion.div>
      </footer>
    </motion.div>
  );
};

export default MapViewPage;
