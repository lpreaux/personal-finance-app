import * as React from "react";
import { breakpoints } from "~/lib/breakpoints";

/**
 * @deprecated Use `useMediaQuery("mobile")` from "~/hooks/use-breakpoint" instead
 * for better consistency with Tailwind breakpoints
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoints.tablet - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoints.tablet);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < breakpoints.tablet);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
