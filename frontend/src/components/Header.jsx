import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
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
    <header className="header fade-in">
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
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link to={item.path} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
