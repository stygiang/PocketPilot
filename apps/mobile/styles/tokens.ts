/**
 * Design Tokens for React Native
 * Copilot-inspired dark theme
 */

export const colors = {
  // Background colors
  bgPrimary: '#0a0e1a',
  bgSecondary: '#111827',
  bgTertiary: '#1a2332',
  bgElevated: '#1f2937',
  bgInput: '#0f172a',

  // Overlay & borders
  overlayDark: 'rgba(0, 0, 0, 0.75)',
  overlayMedium: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
  borderSubtle: 'rgba(255, 255, 255, 0.06)',
  borderMedium: 'rgba(255, 255, 255, 0.1)',
  borderStrong: 'rgba(255, 255, 255, 0.15)',

  // Text colors
  textPrimary: '#f9fafb',
  textSecondary: '#9ca3af',
  textTertiary: '#6b7280',
  textDisabled: '#4b5563',
  textInverse: '#0a0e1a',

  // Brand colors
  brandPrimary: '#4a8fe7',
  brandPrimaryHover: '#5ba3ff',
  brandPrimaryActive: '#3b7fd6',
  brandSecondary: '#6366f1',
  brandTertiary: '#8b5cf6',

  // Semantic colors
  success: '#10b981',
  successBg: 'rgba(16, 185, 129, 0.1)',
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  error: '#ef4444',
  errorBg: 'rgba(239, 68, 68, 0.1)',
  info: '#3b82f6',
  infoBg: 'rgba(59, 130, 246, 0.1)',

  // Category colors
  categoryFood: '#f97316',
  categoryTransport: '#eab308',
  categoryEntertainment: '#a855f7',
  categoryShopping: '#ec4899',
  categoryBills: '#3b82f6',
  categoryHealth: '#10b981',
  categoryTravel: '#06b6d4',
  categoryHome: '#8b5cf6',
  categoryIncome: '#10b981',
  categoryOther: '#6b7280',

  // Special
  white: '#ffffff',
  black: '#000000',
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;

export const borderRadius = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;
