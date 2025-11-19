/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main Color Palette for Khums Tourism Platform
        'primary': '#1a3a52',      // Dark teal/slate blue (main background)
        'secondary': '#e8944a',    // Orange (buttons, accents)
        'accent': '#5a9fb5',       // Light blue (highlights)
        'dark': '#0f1f2e',         // Very dark blue/black
        'light': '#f5f5f5',        // Light gray/white
        'slate': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Historical and Cultural Color Palette
        'terracotta': '#C85A17',   // Warm earthy color (archaeology)
        'sand': '#D4A574',         // Light sand color
        'deep-sea': '#1B4965',     // Deep sea blue (Mediterranean)
        'navy': '#0D2B3E',         // Very dark blue
        'cream': '#F5F1E8',        // Clean white with warm touch
        'light-gray': '#E8E6E1',   // Very light gray
        'dark-gray': '#4A4A4A',    // Dark gray for text
        'accent-gold': '#D4A574',  // Warm gold (emphasis)
      },
      fontFamily: {
        // Arabic fonts
        'serif-historic': ['Lalezar', 'Georgia', 'serif'],
        'sans-arabic': ['Almarai', 'Droid Arabic Naskh', 'sans-serif'],
        'sans': ['Almarai', 'Droid Arabic Naskh', 'sans-serif'],
      },
      fontSize: {
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
        'safe-top': 'max(1rem, env(safe-area-inset-top))',
        'safe-bottom': 'max(1rem, env(safe-area-inset-bottom))',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
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
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { opacity: '1' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}
