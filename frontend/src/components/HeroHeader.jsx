import React from 'react';

const HeroHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-b from-slate-800 to-slate-700">
      {/* Logo Circle */}
      <div className="mb-6 flex items-center justify-center w-24 h-24 bg-orange-500 rounded-full shadow-lg">
        <svg
          className="w-16 h-16 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          {/* Classical Building Icon */}
          <path d="M12 2L2 7v2h2v11H2v2h20v-2h-2V9h2V7l-10-5zm0 2.5l8 4v9.5H4V8.5l8-4z" />
          <path d="M7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
        </svg>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl font-bold text-white text-center mb-2">
        الخمس السياحية
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-slate-300 text-center">
        منصة سياحية متكاملة
      </p>
    </div>
  );
};

export default HeroHeader;
