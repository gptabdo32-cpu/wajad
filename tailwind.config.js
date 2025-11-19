/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./pages/**/*.html", "./scripts/**/*.js"],
  theme: {
    extend: {
      colors: {
        // Historical and Cultural Color Palette
        'terracotta': '#C85A17', // لون ترابي دافئ (الآثار)
        'sand': '#D4A574', // لون رملي فاتح
        'deep-sea': '#1B4965', // أزرق بحري عميق (البحر الأبيض المتوسط)
        'navy': '#0D2B3E', // أزرق داكن جداً
        'cream': '#F5F1E8', // أبيض نظيف مع لمسة دافئة
        'light-gray': '#E8E6E1', // رمادي فاتح جداً
        'dark-gray': '#4A4A4A', // رمادي داكن للنصوص
        'accent-gold': '#D4A574', // ذهبي دافئ (للتأكيد)
      },
      fontFamily: {
        // العناوين الرئيسية (Serif للتاريخ والفخامة)
        'serif-historic': ['Lalezar', 'Georgia', 'serif'],
        // النصوص العادية (Sans-serif للقراءة)
        'sans-arabic': ['Almarai', 'Droid Arabic Naskh', 'sans-serif'],
        // الخط الافتراضي
        'sans': ['Almarai', 'Droid Arabic Naskh', 'sans-serif'],
      },
      fontSize: {
        // أحجام خطوط مخصصة
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
      },
      spacing: {
        // مسافات مخصصة
        'safe-top': 'max(1rem, env(safe-area-inset-top))',
        'safe-bottom': 'max(1rem, env(safe-area-inset-bottom))',
      },
      animation: {
        // تأثيرات الحركة
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
