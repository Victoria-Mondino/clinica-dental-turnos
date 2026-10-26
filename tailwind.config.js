/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EF',
          200: '#F3ECDF',
        },
        forest: {
          50: '#EEF3F0',
          100: '#D6E3DC',
          300: '#8FAD9E',
          500: '#3F6858',
          600: '#2F5044',
          700: '#233D34',
          800: '#1B2E27',
          900: '#14231D',
        },
        clay: {
          50: '#FBF0EA',
          100: '#F4DACB',
          400: '#D48E6B',
          500: '#C1694F',
          600: '#A6543D',
        },
        ink: {
          500: '#4A4238',
          700: '#332C24',
          900: '#241F19',
        },
        // pastel tags used for service categories on the agenda board
        tag: {
          sand: '#EFE0C3',
          rose: '#F1D3D8',
          sage: '#D8E4D0',
          sky: '#D6E2EA',
          lilac: '#E2DCEE',
          clover: '#DCE7CE',
          blush: '#F3DCE4',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(36,31,25,0.06), 0 8px 24px -12px rgba(36,31,25,0.18)',
      },
    },
  },
  plugins: [],
}
