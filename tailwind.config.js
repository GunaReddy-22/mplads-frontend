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
        navy: {
          950: '#070F1E',
          900: '#0B192C',
          850: '#0F223D',
          800: '#1E3E62',
          700: '#2A527E',
        },
        gov: {
          blue: '#1E3E62',
          cyan: '#0284C7',
          teal: '#0D9488',
          amber: '#D97706',
          crimson: '#DC2626',
          emerald: '#059669',
        },
        surface: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(2, 132, 199, 0.3)',
        'glow-danger': '0 0 20px -5px rgba(220, 38, 38, 0.3)',
        'glow-success': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
