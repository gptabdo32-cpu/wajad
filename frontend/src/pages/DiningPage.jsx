import React from 'react';
import Header from '../components/Header';
import './PlaceholderPage.css';

const DiningPage = () => (
  <div className="placeholder-page">
    <Header />
    <div className="placeholder-content">
      <h1>🍴 الطعام والمشروبات</h1>
      <p>اكتشف أفضل المطاعم والمقاهي</p>
      <div className="coming-soon">جاري التطوير...</div>
    </div>
  </div>
);

export default DiningPage;
