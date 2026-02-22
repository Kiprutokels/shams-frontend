/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // SHAMS System-Wide Palette
        primary: {
          DEFAULT: '#1976D2', // Primary Blue
          dark: '#1565C0',
        },
        secondary: '#43A047', // Secondary Green
        neutral: {
          DEFAULT: '#9E9E9E', // Subtle text, dividers
          bg: '#F5F5F5',      // App backgrounds
        },
        accent: '#FB8C00',    // Accent Orange
        navy: '#0D47A1',      // Deep Navy (Admin/Sidebar)
        teal: {
          DEFAULT: '#26A69A', // Soft Teal (Provider highlights)
          dark: '#004D40',    // Dark Teal (Doctor Sidebar)
        },
        warmRed: '#E53935',   // Warm Red (Alerts/Logout)
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite', // Slowed down for medical professional feel
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'medical': '0 4px 20px -2px rgba(0, 0, 0, 0.05)', // Custom soft shadow for cards
      }
    },
  },
  plugins: [],
}