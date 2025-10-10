import * as React from "react";
import { type Breakpoint, breakpoints, mediaQueries } from "~/lib/breakpoints";

/**
 * Hook to detect current breakpoint
 * Returns the current active breakpoint name
 *
 * @example
 * const breakpoint = useBreakpoint();
 * if (breakpoint === "mobile") { ... }
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>(() => {
    if (typeof window === "undefined") return "desktop";
    return getCurrentBreakpoint();
  });

  React.useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
}

/**
 * Hook to check if a specific breakpoint or query is active
 *
 * @example
 * const isMobile = useMediaQuery("mobile");
 * const isTabletOrAbove = useMediaQuery("aboveTablet");
 */
export function useMediaQuery(
  query: keyof typeof mediaQueries,
): boolean | undefined {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(mediaQueries[query]);
    const onChange = () => {
      setMatches(mediaQuery.matches);
    };

    onChange(); // Set initial value
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/**
 * Helper function to determine current breakpoint
 */
function getCurrentBreakpoint(): Breakpoint {
  const width = window.innerWidth;

  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.desktop) return "desktop";
  if (width >= breakpoints.tablet) return "tablet";
  return "mobile";
}
