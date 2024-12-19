const colors = require('./src/styles/colors');
const typography = require('./src/styles/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0)' },
          '100%': { transform: 'translateY(-20px) rotate(360deg)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        'bounce-in': 'bounceIn 700ms forwards',
        'confetti': 'confetti 1000ms forwards',
        'fade-in': 'fadeIn 500ms forwards',
        'fade-out': 'fadeOut 300ms forwards'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} 