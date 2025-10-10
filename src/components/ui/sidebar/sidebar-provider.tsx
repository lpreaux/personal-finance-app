"use client";

import * as React from "react";
import { useMediaQuery } from "~/hooks/use-breakpoint";
import { cn } from "~/lib/utils";
import { SidebarContext, type SidebarContextProps } from "./sidebar-context";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "18.75rem";
const SIDEBAR_HEIGHT_MOBILE = "3.25rem";
const SIDEBAR_HEIGHT_TABLET = "4.625rem";
const SIDEBAR_WIDTH_ICON = "5.5rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export function SidebarProvider({
  defaultOpen = true,
  children,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobileQuery = useMediaQuery("mobile");
  // Default to false during SSR/hydration to match desktop behavior
  const isMobile = isMobileQuery ?? false;

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [open, _setOpen] = React.useState(defaultOpen);
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      _setOpen(openState);

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [open, _setOpen],
  );

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    if (!isMobile) {
      console.log("toggle sidebar");
      return setOpen((open) => !open);
    }
  }, [isMobile, setOpen]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      isMobile,
      toggleSidebar,
    }),
    [state, open, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            "--sidebar-height-mobile": SIDEBAR_HEIGHT_MOBILE,
            "--sidebar-height-tablet": SIDEBAR_HEIGHT_TABLET,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "relative flex min-h-svh w-full",
          "desktop:static",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}
