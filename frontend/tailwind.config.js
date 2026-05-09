/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          serif: ['Playfair Display', 'Georgia', 'serif'],
        },
        colors: {
          cosmic: {
            bg: '#06041A',
            card: '#181440',
            primary: '#8B6FD4',
            accent: '#A78BFA',
          }
        }
      },
    },
    plugins: [],
  }