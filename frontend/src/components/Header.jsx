import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  // متغيرات Framer Motion
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navItems = [
    { label: 'الرئيسية', path: '/' },
    { label: 'الاستكشاف', path: '/exploration' },
    { label: 'الإقامة', path: '/accommodation' },
    { label: 'الطعام', path: '/dining' },
    { label: 'النقل', path: '/transport' },
    { label: 'الخريطة', path: '/map' },
    { label: 'السلامة', path: '/safety' },
    { label: 'الملف الشخصي', path: '/profile' },
  ];

  return (
    <motion.header
      className="header"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="header-container">
        <div className="logo">
          <h1>🏛️ سياحة الخمس</h1>
        </div>

        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="قائمة التنقل"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            {navItems.map((item, index) => (
              <motion.li
                key={item.path}
                className="nav-item"
                variants={navItemVariants}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Link to={item.path} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
