/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'Noto Sans KR', 'sans-serif'],
      },
      colors: {
        // Theme-aware colors using CSS variables
        'theme': {
          'primary': 'var(--theme-primary)',
          'primary-hover': 'var(--theme-primary-hover)',
          'primary-light': 'var(--theme-primary-light)',
          'secondary': 'var(--theme-secondary)',
          'bg': 'var(--theme-bg)',
          'bg-card': 'var(--theme-bg-card)',
          'bg-input': 'var(--theme-bg-input)',
          'text': 'var(--theme-text)',
          'text-muted': 'var(--theme-text-muted)',
          'border': 'var(--theme-border)',
          'border-light': 'var(--theme-border-light)',
        },
        'glass': {
          'bg': 'var(--glass-bg)',
          'card': 'var(--glass-bg-card)',
          'overlay': 'var(--glass-bg-overlay)',
          'border': 'var(--glass-border)',
        },
      },
      boxShadow: {
        'theme': 'var(--theme-shadow)',
        'theme-hover': 'var(--theme-shadow-hover)',
        'theme-soft': 'var(--theme-shadow-soft)',
        'glass': 'var(--shadow-glass)',
        'glass-dark': 'var(--shadow-glass-dark)',
      },
      borderWidth: {
        'theme': 'var(--theme-border-width)',
      },
      borderRadius: {
        'theme': 'var(--theme-radius)',
      },
      ringColor: {
        'theme': 'var(--theme-focus-ring)',
      },
    },
  },
  plugins: [],
};
