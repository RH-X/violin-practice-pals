# Violin Practice Pals

React + Vite app for guiding young violin students through practice sessions.

## Stack
- React 18, Vite 5, Tailwind CSS 3
- No backend — fully client-side, no env vars required

## Run
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview

## Structure
src/App.jsx       — entire app (single component, 5-step flow)
src/index.css     — global styles + custom Tailwind component classes
tailwind.config.js — custom color tokens (backdrop, surface, accent, etc.)

## Conventions
- Tailwind-only styling; no CSS-in-JS
- Custom component classes (.card-surface, .button-primary, etc.) in index.css
- Data constants (buddies, activities) at module level in App.jsx
- Accessible HTML: semantic elements, ARIA labels, aria-pressed on toggles

## Active branches
- origin/1-14-26-main: buddy avatar PNGs, animation tweaks
- origin/codex/update-ui-color-hierarchy-with-tailwind-tokens: full light-theme redesign + avatars
