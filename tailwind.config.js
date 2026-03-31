/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        dm: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        dusty: {
          50:  '#f0f8fc',
          100: '#e0f0f8',
          200: '#c8dde8',
          300: '#a8c5d8',
          400: '#7aaec4',
          500: '#5b8fa8',
          600: '#3d7090',
          700: '#2d5570',
          800: '#1e3d52',
          900: '#0f2233',
        },
        gold: {
          300: '#e8d5b0',
          400: '#d4b87a',
          500: '#c9a96e',
          600: '#b8924a',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
