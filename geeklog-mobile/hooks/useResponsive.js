import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

export const useResponsive = () => {
  const [screenData, setScreenData] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  const { width, height } = screenData;

  // Device types based on width
  const isSmallDevice = width < 380;
  const isMediumDevice = width >= 380 && width < 430;
  const isLargeDevice = width >= 430;

  // Orientation
  const isLandscape = width > height;
  const isPortrait = height > width;

  // Responsive values
  const getResponsiveValue = (small, medium, large) => {
    if (isSmallDevice) return small;
    if (isMediumDevice) return medium;
    return large;
  };

  // Common responsive dimensions
  const padding = {
    xs: getResponsiveValue(8, 12, 16),
    sm: getResponsiveValue(12, 16, 20),
    md: getResponsiveValue(16, 20, 24),
    lg: getResponsiveValue(20, 24, 28),
    xl: getResponsiveValue(24, 28, 32),
  };

  const fontSize = {
    xs: getResponsiveValue(10, 11, 12),
    sm: getResponsiveValue(12, 13, 14),
    md: getResponsiveValue(14, 15, 16),
    lg: getResponsiveValue(16, 18, 20),
    xl: getResponsiveValue(18, 20, 24),
    xxl: getResponsiveValue(20, 24, 28),
    xxxl: getResponsiveValue(24, 28, 32),
  };

  const spacing = {
    xs: getResponsiveValue(4, 6, 8),
    sm: getResponsiveValue(8, 10, 12),
    md: getResponsiveValue(12, 14, 16),
    lg: getResponsiveValue(16, 18, 20),
    xl: getResponsiveValue(20, 22, 24),
  };

  // Grid calculations
  const getGridColumns = (minItemWidth) => {
    const availableWidth = width - padding.md * 2; // Account for container padding
    const columns = Math.floor(availableWidth / minItemWidth);
    return Math.max(1, columns);
  };

  const getItemWidth = (columns, gap = spacing.md) => {
    const availableWidth = width - padding.md * 2; // Container padding
    const totalGap = gap * (columns - 1);
    return (availableWidth - totalGap) / columns;
  };

  return {
    width,
    height,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isLandscape,
    isPortrait,
    padding,
    fontSize,
    spacing,
    getResponsiveValue,
    getGridColumns,
    getItemWidth,
  };
};
