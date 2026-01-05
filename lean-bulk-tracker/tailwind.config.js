/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          dark: '#0f172a',
          accent: '#3b82f6', // Blue for focus
          success: '#22c55e',
          warning: '#eab308'
        }
      }
    },
  },
  plugins: [],
}