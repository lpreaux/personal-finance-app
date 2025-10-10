import { usePathname } from "next/navigation";

/**
 * Hook to determine if a route is currently active based on the pathname
 * @param href - The route to check
 * @returns true if the route is active, false otherwise
 */
export function useIsActiveRoute(href: string | undefined): boolean {
  const pathname = usePathname();

  if (!href) {
    return false;
  }

  // Root path exact match
  if (href === "/") {
    return pathname === "/";
  }

  // Split paths into segments
  const pathSegments = pathname.split("/").filter(Boolean);
  const hrefSegments = href.split("/").filter(Boolean);

  // For top-level routes like /dashboard
  if (hrefSegments.length === 1) {
    return pathSegments[0] === hrefSegments[0] && pathSegments.length === 1;
  }

  // For deeper routes, check if pathname starts with href
  return pathname.startsWith(href);
}
