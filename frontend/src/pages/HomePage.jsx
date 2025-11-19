import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroHeader from '../components/HeroHeader';
import SearchBar from '../components/SearchBar';
import CategoryGrid from '../components/CategoryGrid';
import BottomNavBar from '../components/BottomNavBar';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    navigate(`/map?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Hero Header */}
        <HeroHeader />

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Category Grid */}
        <CategoryGrid />

        {/* Spacer */}
        <div className="flex-1" />
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default HomePage;
