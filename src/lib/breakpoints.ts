/**
 * Centralized breakpoint configuration
 * Used by both Tailwind CSS and React hooks to ensure consistency
 */

export const breakpoints = {
  mobile: 0, // 0-767px
  tablet: 768, // 768-1439px
  desktop: 1440, // 1440-1919px
  lg: 1920, // 1920px+
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Helper to get media query strings for use in JS
 */
export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.tablet - 1}px)`,
  tablet: `(min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
  desktop: `(min-width: ${breakpoints.desktop}px) and (max-width: ${breakpoints.lg - 1}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  // Utility queries
  aboveTablet: `(min-width: ${breakpoints.tablet}px)`,
  aboveDesktop: `(min-width: ${breakpoints.desktop}px)`,
  belowDesktop: `(max-width: ${breakpoints.desktop - 1}px)`,
} as const;
