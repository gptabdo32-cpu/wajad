import React, { useState, useEffect } from 'react';
import './POICard.css';

const POICard = ({ poi, onNavigate }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Lazy load image
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = poi.image || 'https://via.placeholder.com/300x200?text=POI';
  }, [poi.image]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="poi-card scale-in hover-lift">
      <div className="poi-image-container">
        {!imageLoaded && <div className="poi-image lazy-image"></div>}
        {imageLoaded && (
          <img
            src={poi.image || 'https://via.placeholder.com/300x200?text=POI'}
            alt={poi.name}
            className="poi-image loaded"
            onLoad={handleImageLoad}
          />
        )}
        {poi.isVerified && <span className="verified-badge">✓ موثق</span>}
        <span className="category-badge">{poi.category}</span>
      </div>

      <div className="poi-content">
        <h3>{poi.name}</h3>
        <p className="poi-description">{poi.description}</p>

        <div className="poi-meta">
          <span className="rating">⭐ {poi.rating || 'N/A'}</span>
          <span className="distance">📍 {poi.distance || 'N/A'} كم</span>
        </div>

        <div className="poi-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigate && onNavigate(poi)}
          >
            التنقل
          </button>
        </div>

        {showDetails && (
          <div className="poi-details fade-in">
            <p><strong>العنوان:</strong> {poi.address}</p>
            <p><strong>الهاتف:</strong> {poi.phone || 'غير متوفر'}</p>
            <p><strong>ساعات العمل:</strong> {poi.hours || 'غير متوفر'}</p>
            {poi.licenseNumber && (
              <p><strong>رقم الترخيص:</strong> {poi.licenseNumber}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default POICard;
