import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  // متغيرات Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="home-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header />

      {/* Hero Section */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <motion.h1 variants={itemVariants}>أهلاً وسهلاً في سياحة الخمس</motion.h1>
          <motion.p variants={itemVariants}>اكتشف جمال الخمس: تراث عريق وطبيعة خلابة وضيافة دافئة</motion.p>
          <motion.button
            className="btn btn-secondary"
            onClick={() => navigate('/map')}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            استكشف الخريطة
          </motion.button>
        </div>
      </motion.section>

      {/* Quick Access Section */}
      <section className="quick-access">
        <div className="container">
          <h2>الوصول السريع</h2>
          <motion.div
            className="quick-access-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {quickAccessItems.map((item, index) => (
              <motion.button
                key={item.path}
                className="quick-access-btn"
                onClick={() => navigate(item.path)}
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
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
      <motion.footer
        className="footer"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="container">
          <p>&copy; 2024 منصة سياحة الخمس. جميع الحقوق محفوظة.</p>
          <div className="footer-links">
            <a href="#about">عن المنصة</a>
            <a href="#contact">اتصل بنا</a>
            <a href="#privacy">سياسة الخصوصية</a>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default HomePage;
