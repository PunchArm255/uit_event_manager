/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uit: {
          blue: '#002B7F',
          dark: '#001F5C',
          deep: '#001642',
          light: '#EBF1FD',
          surface: '#F7F7F5',
        },
        notion: {
          bg: '#F7F7F5',
          card: '#FFFFFF',
          border: '#E5E7EB',
          text: '#111827',
          subtext: '#6B7280',
          hover: '#F0F0EE',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'sm-flat': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
