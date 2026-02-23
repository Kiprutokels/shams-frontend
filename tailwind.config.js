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
          DEFAULT: '#1976D2', // Primary Blue (Trust/Professionalism)
          dark: '#1565C0',
        },
        secondary: {
          DEFAULT: '#43A047', // Secondary Green (Success)
          dark: '#2E7D32',
        },
        neutral: {
          DEFAULT: '#9E9E9E', // Subtle text, dividers
          bg: '#F5F5F5',      // App backgrounds
          dark: '#424242',    // Stronger text
        },
        accent: {
          DEFAULT: '#FB8C00', // Accent Orange (Warnings)
          dark: '#EF6C00',
        },
        navy: {
          DEFAULT: '#0D47A1', // Deep Navy (Admin/Sidebar)
          dark: '#0A377D',
        },
        teal: {
          DEFAULT: '#26A69A', // Soft Teal (Provider Highlights)
          dark: '#004D40',    // Dark Teal (Doctor Sidebar)
        },
        warmRed: {
          DEFAULT: '#E53935', // Warm Red (Alerts/Errors)
          dark: '#C62828',
        },
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