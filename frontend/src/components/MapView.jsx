import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './MapView.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different POI types
const createCustomIcon = (category) => {
  const colors = {
    Archaeological: '#8B4513',
    Nature: '#228B22',
    Food: '#FF6347',
    Accommodation: '#4169E1',
    Transport: '#FF8C00',
    Safety: '#DC143C',
    default: '#2c7a9e',
  };

  const color = colors[category] || colors.default;

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 16px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        📍
      </div>
    `,
    iconSize: [32, 32],
    className: 'custom-marker',
  });
};

const MapView = ({ pois = [], center = [32.6375, 14.2917], zoom = 12, onMarkerClick }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filteredPois, setFilteredPois] = useState(pois);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPois(pois);
    } else {
      setFilteredPois(pois.filter((poi) => poi.category === selectedCategory));
    }
  }, [selectedCategory, pois]);

  const categories = ['all', ...new Set(pois.map((poi) => poi.category))];

  return (
    <div className="map-view-container fade-in">
      <div className="map-controls">
        <label htmlFor="category-filter">تصفية حسب الفئة:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          <option value="all">جميع الفئات</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'جميع الفئات' : cat}
            </option>
          ))}
        </select>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredPois.map((poi) => (
          <Marker
            key={poi.id}
            position={[poi.latitude, poi.longitude]}
            icon={createCustomIcon(poi.category)}
            eventHandlers={{
              click: () => {
                setSelectedMarker(poi);
                onMarkerClick && onMarkerClick(poi);
              },
            }}
          >
            <Popup className="custom-popup">
              <div className="popup-content">
                <h4>{poi.name}</h4>
                <p className="popup-category">{poi.category}</p>
                <p className="popup-description">{poi.description}</p>
                {poi.isVerified && <span className="popup-verified">✓ موثق</span>}
                <div className="popup-rating">⭐ {poi.rating || 'N/A'}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedMarker && (
        <div className="marker-details slide-in-left">
          <button
            className="close-btn"
            onClick={() => setSelectedMarker(null)}
          >
            ✕
          </button>
          <h3>{selectedMarker.name}</h3>
          <p className="detail-category">{selectedMarker.category}</p>
          <p>{selectedMarker.description}</p>
          <p><strong>العنوان:</strong> {selectedMarker.address}</p>
          {selectedMarker.phone && (
            <p><strong>الهاتف:</strong> {selectedMarker.phone}</p>
          )}
          <button className="btn btn-primary">
            احصل على الاتجاهات
          </button>
        </div>
      )}
    </div>
  );
};

export default MapView;
