import React from 'react';
import Header from '../components/Header';
import './PlaceholderPage.css';

const ExplorationPage = () => {
  return (
    <div className="placeholder-page">
      <Header />
      <div className="placeholder-content">
        <h1>🏛️ الاستكشاف والآثار</h1>
        <p>اكتشف المواقع الأثرية والثقافية في الخمس</p>
        <div className="coming-soon">جاري التطوير...</div>
      </div>
    </div>
  );
};

export default ExplorationPage;
