import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryGrid = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      label: 'الإقامة',
      icon: '🏨',
      path: '/accommodation',
      color: 'bg-slate-600',
    },
    {
      id: 2,
      label: 'النقل',
      icon: '🚗',
      path: '/transport',
      color: 'bg-slate-600',
    },
    {
      id: 3,
      label: 'الاستكشاف',
      icon: '🏛️',
      path: '/exploration',
      color: 'bg-slate-600',
    },
    {
      id: 4,
      label: 'الطعام',
      icon: '🍴',
      path: '/dining',
      color: 'bg-slate-600',
    },
    {
      id: 5,
      label: 'الأمان',
      icon: '🏥',
      path: '/safety',
      color: 'bg-slate-600',
    },
  ];

  return (
    <div className="w-full px-4 py-8">
      <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => navigate(category.path)}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-full hover:scale-110 transition-transform duration-200"
          >
            {/* Category Icon Circle */}
            <div
              className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
            >
              <span className="text-2xl">{category.icon}</span>
            </div>
            {/* Category Label */}
            <p className="text-xs text-white text-center font-medium">
              {category.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
