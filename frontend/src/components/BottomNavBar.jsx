import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginModal from './LoginModal';

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
    navigate('/');
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-100 border-t border-slate-300 px-4 py-3 flex items-center justify-between z-40">
        {/* Menu Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center justify-center w-10 h-10 text-slate-700 hover:text-orange-500 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo/Home Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center w-10 h-10 text-orange-500 hover:text-orange-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7v2h2v11H2v2h20v-2h-2V9h2V7l-10-5zm0 2.5l8 4v9.5H4V8.5l8-4z" />
          </svg>
        </button>

        {/* Back Button / User Button */}
        {user ? (
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center justify-center w-10 h-10 text-slate-700 hover:text-orange-500 transition-colors"
            title={user.email}
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex items-center justify-center w-10 h-10 text-slate-700 hover:text-orange-500 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="fixed bottom-16 right-4 bg-white rounded-lg shadow-xl p-2 z-40">
          <button
            onClick={() => navigate('/profile')}
            className="block w-full text-right px-4 py-2 text-slate-700 hover:bg-slate-100 rounded transition-colors"
          >
            الملف الشخصي
          </button>
          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              تسجيل الخروج
            </button>
          ) : (
            <button
              onClick={() => {
                setShowLoginModal(true);
                setShowMenu(false);
              }}
              className="block w-full text-right px-4 py-2 text-orange-500 hover:bg-orange-50 rounded transition-colors"
            >
              تسجيل الدخول
            </button>
          )}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default BottomNavBar;
