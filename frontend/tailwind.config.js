export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // individuales
        'main-bg': '#F4F4F4',
        'my-azul': '#1D546C',
        'my-Dazul': '#0C2B4E',
        'my-Lazul': '#1A3D64',
        'my-Hobber-Lazul': '#9ECFD4',
        'my-Hobber-azul': '#70B2B2',
        
        'my-rosa/verde': '#5bec48ff',
        
        // por pallet
        'brand': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',  // ← main
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        
      },
    },
  },
  plugins: [],
}