module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'body': 'Roboto'
      },
      width: {
        'banner-sm': '262px'
      },
      borderWidth: {
        '1': '1px'
      },
      fontSize: {
        '7': '7px',
        '8': '8px',
        '9': '9px',
        '10': '10px',
        '11': '11px',
        '12': '12px',
        '13': '13px',
        '14': '14px',
        '15': '15px',
        '16': '16px',
      },
      boxShadow: {
        'card': '0px 4px 15px rgba(0, 0, 0, 0.05)',
        'popover': '0px 24px 48px rgba(0, 0, 0, 0.8)',
      },
      colors: {
        'brand-grey': {
          50: '#f9f9f9',
          70: '#7D7D7D',
          100: '#757575',
          110: '#FAFAFA',
          120: '#C4C4C4',
          150: '#848484',
        },
        'brand-red': {
          400: '#FF4D4D'
        },
        'brand-green': {
          400: '#2faf49',
          500: '#00785B'
        },
        'brand-blue': {
          300: '#3b82f6',
          400: '#0057FF'
        },
        'brand-black': 'rgb(15,23,42)',
        'brand-yellow': {
          400: '#edba86'
        },
        'brand-dark': {
          400: 'rgb(30,41,59)',
          500: '#1C1C1C'
        },
        'brand-black-gradient': 'rgba(0, 0, 0, 0.4)'
      },
      animation: {
        fadeOut: 'fadeOut 5s ease-in-out',
        fadeIn: 'fadeOut 5s ease-in-out',
      },

      keyframes: theme => ({
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
}
