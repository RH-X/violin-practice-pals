/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        backdrop: '#fefdfc',
        surface: '#fcf3f4',
        surfaceSoft: '#f9efef',
        surfaceMuted: '#f4e1df',
        accent: '#7e382b',
        accentSoft: '#b67158',
        accentMuted: '#f2dfdd',
        ink: '#42230d',
        inkSoft: '#5b251b',
        inkMuted: '#7e4933',
        line: '#f2dfdd',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(126,56,43,0.18)',
        subtle: '0 10px 30px rgba(66,35,13,0.12)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2.25rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      fontSize: {
        hero: ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'hero-lg': ['2.6rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        title: ['1.4rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'title-lg': ['1.65rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'body-sm': ['0.95rem', { lineHeight: '1.6' }],
        caption: ['0.78rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
      },
    },
  },
  plugins: [],
}
