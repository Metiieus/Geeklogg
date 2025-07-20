import { Dimensions, PixelRatio } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Design dimensions (iPhone 11/XR as reference)
const designWidth = 414;
const designHeight = 896;

/**
 * Responsive utilities for consistent mobile UI across different screen sizes
 */
export const ResponsiveUtils = {
  // Screen dimensions
  screenWidth,
  screenHeight,
  
  // Check if device is a tablet
  isTablet: screenWidth >= 768,
  
  // Check if device is in landscape mode
  isLandscape: screenWidth > screenHeight,
  
  // Responsive width based on design width
  wp: (percentage) => {
    const value = (percentage * screenWidth) / 100;
    return Math.round(PixelRatio.roundToNearestPixel(value));
  },
  
  // Responsive height based on design height
  hp: (percentage) => {
    const value = (percentage * screenHeight) / 100;
    return Math.round(PixelRatio.roundToNearestPixel(value));
  },
  
  // Responsive font size
  fontSize: (size) => {
    const scale = screenWidth / designWidth;
    const newSize = size * scale;
    return Math.max(12, Math.round(PixelRatio.roundToNearestPixel(newSize)));
  },
  
  // Responsive spacing/padding/margin
  spacing: (size) => {
    const scale = Math.min(screenWidth / designWidth, screenHeight / designHeight);
    return Math.round(PixelRatio.roundToNearestPixel(size * scale));
  },
  
  // Touch target minimum size (44px recommended by Apple/Google)
  touchTarget: Math.max(44, ResponsiveUtils.wp(10.6)),
  
  // Grid calculations for responsive grids
  gridItemWidth: (itemsPerRow, spacing = 16) => {
    const totalSpacing = spacing * (itemsPerRow + 1);
    const availableWidth = screenWidth - totalSpacing;
    return Math.floor(availableWidth / itemsPerRow);
  },
  
  // Modal sizing for different screen sizes
  modalWidth: () => {
    if (ResponsiveUtils.isTablet) {
      return Math.min(600, screenWidth * 0.8);
    }
    return screenWidth * 0.95;
  },
  
  // Header heights for different devices
  headerHeight: () => {
    if (ResponsiveUtils.isTablet) return 64;
    return 56;
  },
  
  // Safe responsive values with minimums
  safeWidth: (percentage, minimum = 44) => {
    return Math.max(minimum, ResponsiveUtils.wp(percentage));
  },
  
  safeHeight: (percentage, minimum = 44) => {
    return Math.max(minimum, ResponsiveUtils.hp(percentage));
  },
  
  // Responsive border radius
  borderRadius: (size) => {
    const scale = Math.min(screenWidth / designWidth, 1.2);
    return Math.round(size * scale);
  },
  
  // Dynamic grid columns based on screen width
  getGridColumns: () => {
    if (screenWidth < 480) return 2;      // Small phones
    if (screenWidth < 768) return 3;      // Regular phones
    if (screenWidth < 1024) return 4;     // Tablets
    return 5;                             // Large tablets
  },
  
  // Adaptive padding based on screen size
  screenPadding: () => {
    if (screenWidth < 360) return 12;     // Very small screens
    if (screenWidth < 414) return 16;     // Small screens
    if (screenWidth < 768) return 20;     // Regular screens
    return 24;                            // Large screens/tablets
  },
  
  // Typography scale
  typography: {
    h1: ResponsiveUtils.fontSize(32),
    h2: ResponsiveUtils.fontSize(28),
    h3: ResponsiveUtils.fontSize(24),
    h4: ResponsiveUtils.fontSize(20),
    h5: ResponsiveUtils.fontSize(18),
    h6: ResponsiveUtils.fontSize(16),
    body1: ResponsiveUtils.fontSize(16),
    body2: ResponsiveUtils.fontSize(14),
    caption: ResponsiveUtils.fontSize(12),
    small: ResponsiveUtils.fontSize(10),
  },
  
  // Common measurements
  measurements: {
    touchTarget: Math.max(44, ResponsiveUtils.wp(10.6)),
    inputHeight: Math.max(48, ResponsiveUtils.hp(5.4)),
    buttonHeight: Math.max(44, ResponsiveUtils.hp(4.9)),
    cardPadding: ResponsiveUtils.spacing(16),
    sectionSpacing: ResponsiveUtils.spacing(24),
    elementSpacing: ResponsiveUtils.spacing(12),
  }
};

// Device type helpers
export const DeviceTypes = {
  isSmallPhone: screenWidth < 360,
  isRegularPhone: screenWidth >= 360 && screenWidth < 414,
  isLargePhone: screenWidth >= 414 && screenWidth < 768,
  isTablet: screenWidth >= 768,
  isLargeTablet: screenWidth >= 1024,
};

// Breakpoints
export const Breakpoints = {
  xs: 0,      // Extra small devices
  sm: 360,    // Small devices
  md: 414,    // Medium devices
  lg: 768,    // Large devices (tablets)
  xl: 1024,   // Extra large devices
};

// Helper function to get styles based on screen size
export const getResponsiveStyle = (styles) => {
  const { width } = Dimensions.get('window');
  
  if (width >= Breakpoints.xl) return styles.xl || styles.lg || styles.md || styles.sm || styles.xs || {};
  if (width >= Breakpoints.lg) return styles.lg || styles.md || styles.sm || styles.xs || {};
  if (width >= Breakpoints.md) return styles.md || styles.sm || styles.xs || {};
  if (width >= Breakpoints.sm) return styles.sm || styles.xs || {};
  return styles.xs || {};
};

// Hook for responsive values
export const useResponsiveValue = (values) => {
  const { width } = Dimensions.get('window');
  
  if (typeof values !== 'object') return values;
  
  if (width >= Breakpoints.xl && values.xl !== undefined) return values.xl;
  if (width >= Breakpoints.lg && values.lg !== undefined) return values.lg;
  if (width >= Breakpoints.md && values.md !== undefined) return values.md;
  if (width >= Breakpoints.sm && values.sm !== undefined) return values.sm;
  if (values.xs !== undefined) return values.xs;
  
  // Return first available value if no breakpoint matches
  return Object.values(values)[0];
};

export default ResponsiveUtils;
