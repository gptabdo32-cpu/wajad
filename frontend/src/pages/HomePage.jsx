import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import POICard from '../components/POICard';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - في التطبيق الفعلي، ستأتي من API
  const mockPOIs = [
    {
      id: 1,
      name: 'لبدة الكبرى',
      category: 'Archaeological',
      description: 'موقع أثري روماني مهم يضم آثارًا تاريخية قيمة',
      image: 'https://via.placeholder.com/300x200?text=Lepcis+Magna',
      rating: 4.8,
      distance: 5,
      address: 'الخمس، ليبيا',
      isVerified: true,
      latitude: 32.6375,
      longitude: 14.2917,
    },
    {
      id: 2,
      name: 'شاطئ الخمس',
      category: 'Nature',
      description: 'شاطئ جميل مع رمال ذهبية وإطلالات بحرية خلابة',
      image: 'https://via.placeholder.com/300x200?text=Al+Khums+Beach',
      rating: 4.5,
      distance: 2,
      address: 'الخمس، ليبيا',
      isVerified: true,
      latitude: 32.6500,
      longitude: 14.2700,
    },
    {
      id: 3,
      name: 'مطعم المأكولات البحرية',
      category: 'Food',
      description: 'مطعم متخصص في المأكولات البحرية الطازة',
      image: 'https://via.placeholder.com/300x200?text=Seafood+Restaurant',
      rating: 4.2,
      distance: 1,
      address: 'الخمس، ليبيا',
      isVerified: true,
      latitude: 32.6400,
      longitude: 14.2800,
    },
    {
      id: 4,
      name: 'فندق الخمس الفاخر',
      category: 'Accommodation',
      description: 'فندق خمس نجوم مع خدمات عالية الجودة',
      image: 'https://via.placeholder.com/300x200?text=Al+Khums+Hotel',
      rating: 4.6,
      distance: 3,
      address: 'الخمس، ليبيا',
      isVerified: true,
      latitude: 32.6350,
      longitude: 14.2900,
    },
  ];

  const quickAccessItems = [
    { label: 'الإقامة', icon: '🏨', path: '/accommodation' },
    { label: 'الطعام', icon: '🍴', path: '/dining' },
    { label: 'الاستكشاف', icon: '🏛️', path: '/exploration' },
    { label: 'النقل', icon: '🚗', path: '/transport' },
  ];

  const filteredPOIs = mockPOIs.filter((poi) => {
    const matchesSearch = poi.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || poi.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNavigate = (poi) => {
    navigate('/map', { state: { selectedPOI: poi } });
  };

  return (
    <div className="home-page">
      <Header />

      {/* Hero Section */}
      <section className="hero fade-in">
        <div className="hero-content">
          <h1>أهلاً وسهلاً في سياحة الخمس</h1>
          <p>اكتشف جمال الخمس: تراث عريق وطبيعة خلابة وضيافة دافئة</p>
          <button className="btn btn-secondary" onClick={() => navigate('/map')}>
            استكشف الخريطة
          </button>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="quick-access">
        <div className="container">
          <h2>الوصول السريع</h2>
          <div className="quick-access-grid">
            {quickAccessItems.map((item) => (
              <button
                key={item.path}
                className="quick-access-btn hover-scale"
                onClick={() => navigate(item.path)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="search-section">
        <div className="container">
          <h2>ابحث عن أماكن الاهتمام</h2>
          <div className="search-controls">
            <input
              type="text"
              placeholder="ابحث عن اسم المكان..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="all">جميع الفئات</option>
              <option value="Archaeological">أثري</option>
              <option value="Nature">طبيعي</option>
              <option value="Food">طعام</option>
              <option value="Accommodation">إقامة</option>
              <option value="Transport">نقل</option>
            </select>
          </div>
        </div>
      </section>

      {/* POI Grid Section */}
      <section className="poi-grid-section">
        <div className="container">
          <h2>أماكن الاهتمام</h2>
          {filteredPOIs.length > 0 ? (
            <div className="poi-grid">
              {filteredPOIs.map((poi, index) => (
                <POICard
                  key={poi.id}
                  poi={poi}
                  onNavigate={handleNavigate}
                  index={index} // تمرير الـ index لتأثير الظهور المتتابع
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>لم يتم العثور على نتائج. حاول البحث بكلمات مختلفة.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 منصة سياحة الخمس. جميع الحقوق محفوظة.</p>
          <div className="footer-links">
            <a href="#about">عن المنصة</a>
            <a href="#contact">اتصل بنا</a>
            <a href="#privacy">سياسة الخصوصية</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
