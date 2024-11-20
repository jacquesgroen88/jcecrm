/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0A1F',
          800: '#151432',
          700: '#1C1B42',
          600: '#2A2952'
        },
        accent: {
          purple: '#6E3AFA',
          blue: '#3B82F6'
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(110, 58, 250, 0.15)',
      }
    },
  },
  plugins: [],
};