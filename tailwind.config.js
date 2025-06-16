/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FD593E',
          50: '#FFEAE7',
          100: '#FFD5CF',
          200: '#FFAC9F',
          300: '#FF836F',
          400: '#FE5A3F',
          500: '#FD593E',
          600: '#F33D1F',
          700: '#D42C10',
          800: '#A8230C',
          900: '#7D1A09',
          950: '#551205',
        },
        neutral: {
          DEFAULT: '#969696',
          50: '#F6F6F6',
          100: '#EBEBEB',
          200: '#DADADA',
          300: '#C4C4C4',
          400: '#AFAFAF',
          500: '#969696',
          600: '#7D7D7D',
          700: '#646464',
          800: '#4B4B4B',
          900: '#1B1B1B',
          950: '#0A0A0A',
        },
      },
      spacing: {
        '0.25': '0.0625rem', // 1px
        '0.5': '0.125rem',   // 2px
        '1': '0.25rem',      // 4px
        '2': '0.5rem',       // 8px
        '3': '0.75rem',      // 12px
        '4': '1rem',         // 16px
        '5': '1.25rem',      // 20px
        '6': '1.5rem',       // 24px
        '8': '2rem',         // 32px
        '10': '2.5rem',      // 40px
        '12': '3rem',        // 48px
        '16': '4rem',        // 64px
        '20': '5rem',        // 80px
        '24': '6rem',        // 96px
      }
    },
  },
  plugins: [],
};