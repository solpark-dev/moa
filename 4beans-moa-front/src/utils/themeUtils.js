/**
 * Theme Utilities for 4beans-moa
 *
 * This file provides CSS class utilities that automatically adapt to the current theme
 * using CSS variables defined in global.css
 *
 * Usage:
 *   import { themeClasses } from '@/utils/themeUtils';
 *
 *   <button className={themeClasses.button.primary}>
 *     Click me
 *   </button>
 */

// Common theme-aware CSS classes
export const themeClasses = {
  // Buttons
  button: {
    primary: `
      bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)]
      text-white font-semibold
      border-[var(--theme-border-width)] border-[var(--theme-border)]
      rounded-[var(--theme-radius)]
      shadow-[var(--theme-shadow)] hover:shadow-[var(--theme-shadow-hover)]
      transition-all duration-200
      focus:ring-2 focus:ring-[var(--theme-focus-ring)]
    `.replace(/\s+/g, ' ').trim(),

    secondary: `
      bg-[var(--theme-bg-card)] hover:bg-[var(--theme-primary-light)]
      text-[var(--theme-text)] font-semibold
      border-[var(--theme-border-width)] border-[var(--theme-border-light)]
      rounded-[var(--theme-radius)]
      shadow-[var(--theme-shadow-soft)]
      transition-all duration-200
    `.replace(/\s+/g, ' ').trim(),

    outline: `
      bg-transparent hover:bg-[var(--theme-primary-light)]
      text-[var(--theme-primary)] font-semibold
      border-[var(--theme-border-width)] border-[var(--theme-primary)]
      rounded-[var(--theme-radius)]
      transition-all duration-200
    `.replace(/\s+/g, ' ').trim(),
  },

  // Cards
  card: {
    base: `
      bg-[var(--theme-bg-card)]
      border-[var(--theme-border-width)] border-[var(--theme-border-light)]
      rounded-[var(--theme-radius)]
      shadow-[var(--theme-shadow-soft)]
    `.replace(/\s+/g, ' ').trim(),

    elevated: `
      bg-[var(--theme-bg-card)]
      border-[var(--theme-border-width)] border-[var(--theme-border-light)]
      rounded-[var(--theme-radius)]
      shadow-[var(--theme-shadow)] hover:shadow-[var(--theme-shadow-hover)]
      transition-all duration-200
    `.replace(/\s+/g, ' ').trim(),
  },

  // Inputs
  input: {
    base: `
      bg-[var(--theme-bg-card)]
      text-[var(--theme-text)]
      border-[var(--theme-border-width)] border-[var(--theme-border-light)]
      rounded-[var(--theme-radius)]
      focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[var(--theme-focus-ring)]
      transition-all duration-200
      placeholder:text-[var(--theme-text-muted)]
    `.replace(/\s+/g, ' ').trim(),
  },

  // Text
  text: {
    primary: 'text-[var(--theme-text)]',
    secondary: 'text-[var(--theme-text-secondary)]',
    muted: 'text-[var(--theme-text-muted)]',
    accent: 'text-[var(--theme-primary)]',
  },

  // Backgrounds
  bg: {
    base: 'bg-[var(--theme-bg)]',
    card: 'bg-[var(--theme-bg-card)]',
    accent: 'bg-[var(--theme-primary)]',
    accentLight: 'bg-[var(--theme-primary-light)]',
  },

  // Borders
  border: {
    base: 'border-[var(--theme-border)]',
    light: 'border-[var(--theme-border-light)]',
    accent: 'border-[var(--theme-primary)]',
    width: 'border-[var(--theme-border-width)]',
  },

  // Shadows
  shadow: {
    base: 'shadow-[var(--theme-shadow)]',
    hover: 'shadow-[var(--theme-shadow-hover)]',
    soft: 'shadow-[var(--theme-shadow-soft)]',
  },

  // Focus
  focus: {
    ring: 'focus:ring-2 focus:ring-[var(--theme-focus-ring)]',
    border: 'focus:border-[var(--theme-primary)]',
  },

  // Badges
  badge: {
    primary: `
      bg-[var(--theme-primary)] text-white
      px-2 py-1 rounded-full text-xs font-semibold
    `.replace(/\s+/g, ' ').trim(),

    secondary: `
      bg-[var(--theme-primary-light)] text-[var(--theme-primary)]
      px-2 py-1 rounded-full text-xs font-semibold
    `.replace(/\s+/g, ' ').trim(),
  },

  // Accent colors (replaces theme === "pop" ? "text-pink-500" : ... patterns)
  accent: {
    text: 'text-[var(--theme-primary)]',
    textHover: 'hover:text-[var(--theme-primary)]',
    bg: 'bg-[var(--theme-primary)]',
    bgHover: 'hover:bg-[var(--theme-primary-hover)]',
    bgLight: 'bg-[var(--theme-primary-light)]',
    border: 'border-[var(--theme-primary)]',
  },

  // Icon styling
  icon: {
    accent: 'text-[var(--theme-primary)]',
    muted: 'text-[var(--theme-text-muted)]',
  },

  // Interactive elements
  interactive: {
    // Back button, navigation links
    link: 'text-[var(--theme-text-muted)] hover:text-[var(--theme-primary)] transition-colors',
    // Clickable cards
    card: 'hover:border-[var(--theme-primary)] transition-colors cursor-pointer',
  },

  // CSS variable references for inline styles (charts, gradients, shadows)
  cssVar: {
    primary: 'var(--theme-primary)',
    primaryHover: 'var(--theme-primary-hover)',
    primaryLight: 'var(--theme-primary-light)',
    secondary: 'var(--theme-secondary)',
    shadow: 'var(--theme-primary-shadow)',
    shadowColor: 'var(--theme-shadow-color)',
  },

  // Modal
  modal: {
    overlay: 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center',
    content: `
      bg-[var(--theme-bg-card)]
      border-[var(--theme-border-width)] border-[var(--theme-border-light)]
      rounded-[var(--theme-radius)]
      shadow-[var(--theme-shadow-hover)]
    `.replace(/\s+/g, ' ').trim(),
  },
};

// Helper function to combine classes
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Get current theme CSS variable value
export const getThemeVar = (varName) => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(`--theme-${varName}`).trim();
};

// Theme color map for inline styles (useful for charts, etc.)
export const getThemeColors = () => ({
  primary: 'var(--theme-primary)',
  primaryHover: 'var(--theme-primary-hover)',
  primaryLight: 'var(--theme-primary-light)',
  secondary: 'var(--theme-secondary)',
  bg: 'var(--theme-bg)',
  bgCard: 'var(--theme-bg-card)',
  text: 'var(--theme-text)',
  textMuted: 'var(--theme-text-muted)',
  border: 'var(--theme-border)',
  borderLight: 'var(--theme-border-light)',
});

export default themeClasses;
