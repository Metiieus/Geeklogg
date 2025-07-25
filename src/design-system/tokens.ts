/**
 * GeekLog Design System - Color Tokens & Design Foundation
 * Modern, sophisticated design inspired by dark mode, gradients, glassmorphism and RPG/fantasy elements
 */

// ============= CORE PALETTE =============

export const colors = {
  // Base Colors - Dark Foundation
  base: {
    background: '#111827',     // Primary dark background
    surface: '#1F2937',       // Elevated surfaces
    overlay: '#374151',       // Modal overlays
    border: '#4B5563',        // Subtle borders
    divider: '#6B7280',       // Section dividers
  },

  // Primary Accent Colors
  primary: {
    violet: '#8B5CF6',        // Main violet
    violetLight: '#A78BFA',   // Light violet
    violetDark: '#7C3AED',    // Dark violet
    cyan: '#06B6D4',          // Main cyan
    cyanLight: '#22D3EE',     // Light cyan
    cyanDark: '#0891B2',      // Dark cyan
    magenta: '#EC4899',       // Main magenta
    magentaLight: '#F472B6',  // Light magenta
    magentaDark: '#DB2777',   // Dark magenta
  },

  // Text Hierarchy
  text: {
    primary: '#F9FAFB',       // Headlines & primary text
    secondary: '#D1D5DB',     // Body text
    tertiary: '#9CA3AF',      // Captions & metadata
    quaternary: '#6B7280',    // Placeholder text
    accent: '#22D3EE',        // Accent text & links
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',       // Success states
    warning: '#F59E0B',       // Warning states
    error: '#EF4444',         // Error states
    info: '#3B82F6',          // Info states
  },

  // Category Duotones - Media Types
  categories: {
    games: {
      primary: '#8B5CF6',     // Violet
      secondary: '#06B6D4',   // Cyan
      background: 'rgba(139, 92, 246, 0.1)',
      border: 'rgba(139, 92, 246, 0.3)',
    },
    anime: {
      primary: '#EC4899',     // Magenta
      secondary: '#F472B6',   // Light Magenta
      background: 'rgba(236, 72, 153, 0.1)',
      border: 'rgba(236, 72, 153, 0.3)',
    },
    series: {
      primary: '#7C3AED',     // Dark Violet
      secondary: '#A78BFA',   // Light Violet
      background: 'rgba(124, 58, 237, 0.1)',
      border: 'rgba(124, 58, 237, 0.3)',
    },
    books: {
      primary: '#059669',     // Emerald
      secondary: '#10B981',   // Success Green
      background: 'rgba(5, 150, 105, 0.1)',
      border: 'rgba(5, 150, 105, 0.3)',
    },
    movies: {
      primary: '#DC2626',     // Red
      secondary: '#F59E0B',   // Amber
      background: 'rgba(220, 38, 38, 0.1)',
      border: 'rgba(220, 38, 38, 0.3)',
    },
  },
} as const;

// ============= GRADIENTS =============

export const gradients = {
  // Hero Gradients
  hero: {
    warmCold: 'linear-gradient(135deg, #DB5375 0%, #B3FFB3 100%)',
    intrigue: 'linear-gradient(135deg, #6C33EE 0%, #2DCFF0 100%)',
    techOrganic: 'linear-gradient(135deg, #FF2D95 0%, #0ACDEA 100%)',
  },

  // Primary Gradients
  primary: {
    violetCyan: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
    magentaViolet: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    cyanMagenta: 'linear-gradient(135deg, #06B6D4 0%, #EC4899 100%)',
  },

  // Category Gradients
  categories: {
    games: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
    anime: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
    series: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
    books: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    movies: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)',
  },

  // Surface Gradients
  surfaces: {
    card: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    overlay: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%)',
  },
} as const;

// ============= TYPOGRAPHY =============

export const typography = {
  fontFamily: {
    primary: '"TT Commons", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", monospace',
  },

  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px - Body text
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px - Headlines
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },

  lineHeight: {
    tight: '1.25',
    normal: '1.5',      // WCAG compliant
    relaxed: '1.75',
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const;

// ============= SPACING & LAYOUT =============

export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',     // 2px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px - Cards
  '3xl': '1.5rem',    // 24px
  full: '9999px',     // Pills & circles
} as const;

// ============= SHADOWS & EFFECTS =============

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  
  // Colored shadows for categories
  glow: {
    violet: '0 20px 25px -5px rgba(139, 92, 246, 0.3), 0 10px 10px -5px rgba(139, 92, 246, 0.1)',
    cyan: '0 20px 25px -5px rgba(6, 182, 212, 0.3), 0 10px 10px -5px rgba(6, 182, 212, 0.1)',
    magenta: '0 20px 25px -5px rgba(236, 72, 153, 0.3), 0 10px 10px -5px rgba(236, 72, 153, 0.1)',
    emerald: '0 20px 25px -5px rgba(5, 150, 105, 0.3), 0 10px 10px -5px rgba(5, 150, 105, 0.1)',
    red: '0 20px 25px -5px rgba(220, 38, 38, 0.3), 0 10px 10px -5px rgba(220, 38, 38, 0.1)',
  },
} as const;

// ============= ANIMATIONS & TRANSITIONS =============

export const animations = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },

  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: [0.68, -0.55, 0.265, 1.55],
  },

  scale: {
    hover: '1.03',
    active: '0.97',
    focus: '1.05',
  },
} as const;

// ============= GLASSMORPHISM =============

export const glassmorphism = {
  backdrop: 'backdrop-blur-[20px]',
  background: 'bg-white/10',
  border: 'border border-white/20',
  shadow: 'shadow-xl',
  
  // Variants
  light: {
    backdrop: 'backdrop-blur-[12px]',
    background: 'bg-white/5',
    border: 'border border-white/10',
  },
  
  strong: {
    backdrop: 'backdrop-blur-[30px]',
    background: 'bg-white/15',
    border: 'border border-white/30',
  },
} as const;

// ============= EXPORT TYPES =============

export type ColorToken = typeof colors;
export type GradientToken = typeof gradients;
export type TypographyToken = typeof typography;
export type SpacingToken = typeof spacing;
export type ShadowToken = typeof shadows;
export type AnimationToken = typeof animations;
export type GlassmorphismToken = typeof glassmorphism;

// Helper function to get category colors
export const getCategoryColors = (category: keyof typeof colors.categories) => {
  return colors.categories[category] || colors.categories.games;
};

// Helper function to get category gradient
export const getCategoryGradient = (category: keyof typeof gradients.categories) => {
  return gradients.categories[category] || gradients.categories.games;
};
