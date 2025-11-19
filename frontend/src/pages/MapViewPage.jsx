import React, { useState } from 'react';
import Header from '../components/Header';
import MapView from '../components/MapView';
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

          <MapView
            pois={mockPOIs}
            center={[32.6375, 14.2917]}
            zoom={13}
            onMarkerClick={handleMarkerClick}
          />

          {selectedPOI && (
            <div className="selected-poi-details fade-in">
              <h2>{selectedPOI.name}</h2>
              <div className="poi-info-grid">
                <div className="info-item">
                  <span className="label">الفئة:</span>
                  <span className="value">{selectedPOI.category}</span>
                </div>
                <div className="info-item">
                  <span className="label">التقييم:</span>
                  <span className="value">⭐ {selectedPOI.rating}</span>
                </div>
                <div className="info-item">
                  <span className="label">العنوان:</span>
                  <span className="value">{selectedPOI.address}</span>
                </div>
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
            </div>
          )}

          <div className="poi-list-section">
            <h2>قائمة جميع أماكن الاهتمام</h2>
            <div className="poi-list">
              {mockPOIs.map((poi) => (
                <div
                  key={poi.id}
                  className="poi-list-item hover-lift"
                  onClick={() => handleMarkerClick(poi)}
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
                  <div className="poi-list-arrow">→</div>
                </div>
              ))}
            </div>
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
