import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './POICard.css';

const POICard = ({ poi, onNavigate, index }) => {
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

  // متغيرات Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1, // تأثير الظهور المتتابع
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const hoverEffect = {
    scale: 1.03,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
  };

  return (
    <motion.div
      className="poi-card hover-lift"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverEffect}
    >
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
        className="poi-content"
      >
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="poi-details"
          >
            <p><strong>العنوان:</strong> {poi.address}</p>
            <p><strong>الهاتف:</strong> {poi.phone || 'غير متوفر'}</p>
            <p><strong>ساعات العمل:</strong> {poi.hours || 'غير متوفر'}</p>
            {poi.licenseNumber && (
              <p><strong>رقم الترخيص:</strong> {poi.licenseNumber}</p>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default POICard;
