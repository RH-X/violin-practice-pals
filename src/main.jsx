import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// FILE: src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

body {
  @apply bg-backdrop text-slate-50 antialiased;
}

main {
  @apply min-h-screen flex items-center justify-center px-4 py-8;
}

.card-surface {
  @apply bg-surfaceSoft/80 border border-slate-800/80 shadow-soft rounded-3xl backdrop-blur-xl;
}

.section-title {
  @apply text-xl md:text-2xl font-semibold tracking-tight text-slate-50;
}

.section-subtitle {
  @apply text-sm md:text-base text-slate-300;
}

.chip {
  @apply inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200;
}

.button-primary {
  @apply inline-flex items-center justify-center rounded-2xl bg-accent px-4 py-2.5 text-sm md:text-base font-semibold text-slate-950 shadow-soft hover:bg-accentSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition;
}

.button-ghost {
  @apply inline-flex items-center justify-center rounded-2xl border border-slate-700 px-4 py-2.5 text-sm md:text-base font-medium text-slate-100 hover:bg-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition;
}

.section-shell {
  @apply card-surface w-full max-w-3xl mx-auto px-5 sm:px-8 py-6 sm:py-8 flex flex-col gap-4 sm:gap-6;
}

.section-body {
  @apply flex flex-col gap-4 sm:gap-6;
}
