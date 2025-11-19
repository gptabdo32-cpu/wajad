import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(`/map?search=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full px-4 py-8">
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="أين تود أن تستكشف في الخمس؟"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pr-14 rounded-full bg-slate-200 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
            dir="rtl"
          />
          {/* Search Icon */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-full transition-colors duration-200 shadow-lg"
        >
          ابحث
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
