/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        backdrop: '#020617', // slate-950-ish
        surface: '#020617',
        surfaceSoft: '#02091f',
        accent: '#38bdf8',
        accentSoft: '#0ea5e9',
        accentMuted: '#0f172a',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15,23,42,0.85)',
      },
      borderRadius: {
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
}
