"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useIsMobile } from "~/hooks/is-mobile";
import { cn } from "~/lib/utils";
import { MinimizeIcon } from "../icons/minimize-menu";
import { usePathname } from "next/navigation";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "18.75rem";
const SIDEBAR_HEIGHT_MOBILE = "3.25rem";
const SIDEBAR_WIDTH_ICON = "5.5rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "collapsed" | "expanded";
  open: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

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
  const isMobile = useIsMobile();

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
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "flex min-h-svh w-full",
          isMobile && "flex-col-reverse",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children, className }: React.ComponentProps<"div">) {
  const { open, toggleSidebar, isMobile } = useSidebar();

  if (isMobile) {
    return (
      <div
        className={cn(
          "flex h-(--sidebar-height-mobile) w-full rounded-t-lg bg-gray-900 px-4 pt-2 text-white",
          className,
        )}
      >
        {/* Navigation principale */}
        <div className={cn("flex-grow")} aria-label="Navigation principale">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col rounded-r-2xl bg-gray-900 text-white",
        open ? "w-(--sidebar-width)" : "w-(--sidebar-width-icon)",
        className,
      )}
    >
      {/* Header */}
      <div className="px-8 py-10">
        <Link href="/">
          <Image
            className="h-auto max-h-7 w-auto max-w-full"
            src={open ? "/images/logo-large.svg" : "/images/logo-small.svg"}
            alt="logo"
            width={122}
            height={22}
          />
        </Link>
      </div>

      {/* Navigation principale */}
      <div
        className={cn("flex-grow", open ? "pr-6" : "pr-2")}
        aria-label="Navigation principale"
      >
        {children}
      </div>

      {/* Footer avec contrôles */}
      <div className="pt-10 pb-14">
        <SidebarMenuItem
          asChild
          icon={<MinimizeIcon className={open ? "" : "rotate-180"} />}
        >
          <button onClick={toggleSidebar}>Minimize Menu</button>
        </SidebarMenuItem>
      </div>
    </div>
  );
}

export function SidebarInset({ children }: React.ComponentProps<"div">) {
  return <div className="flex-grow">{children}</div>;
}

type MenuItemProps = React.ComponentProps<"li"> & {
  asChild?: boolean;
  active?: boolean;
  icon: React.ReactNode;
};

export function SidebarMenuItem({
  children,
  className,
  asChild = false,
  active,
  icon,
  ...props
}: MenuItemProps) {
  const { open, isMobile } = useSidebar();
  const pathname = usePathname();

  // Auto-détection si active n'est pas fourni et que c'est un Link
  let isActive = active;
  if (asChild && active === undefined) {
    const child = React.Children.only(children) as React.ReactElement<{
      href?: string;
    }>;
    if (child.props.href) {
      const href = child.props.href;

      // Comparer les segments de path
      const pathSegments = pathname.split("/").filter(Boolean);
      const hrefSegments = href.split("/").filter(Boolean);

      if (href === "/") {
        isActive = pathname === "/";
      } else if (hrefSegments.length === 1) {
        // Pour les routes de premier niveau comme /dashboard
        isActive =
          pathSegments[0] === hrefSegments[0] && pathSegments.length === 1;
      } else {
        // Pour les routes plus profondes
        isActive = pathname.startsWith(href);
      }
    }
  }

  if (isMobile) {
    if (asChild) {
      const child = React.Children.only(children);
      const clonedChild = React.cloneElement(
        child as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
        {
          className: cn(
            "flex h-full justify-center rounded-t-lg pt-2 pb-3 align-middle text-gray-300",
            !isActive && "group-hover:text-white",
            isActive &&
              "border-b-4 border-teal-800 bg-orange-100 text-gray-900",
            className,
          ),
          ...props,
          children: (
            <>
              <div
                className={cn(
                  "text-gray-300 *:h-6 *:w-6 *:object-contain",
                  !isActive && "group-hover:text-white",
                  isActive && "text-teal-800",
                )}
              >
                {icon}
              </div>
            </>
          ),
        },
      );

      return <li className="flex-grow">{clonedChild}</li>;
    }

    return (
      <li
        className={cn(
          "flex h-full flex-grow justify-center rounded-t-lg pt-2 pb-3 align-middle text-gray-300 *:h-6 *:w-6 *:object-contain",
          !isActive && "group-hover:text-white",
          isActive && "border-b-4 border-teal-800 bg-orange-100 text-teal-800",
        )}
      >
        {icon}
      </li>
    );
  }

  if (asChild) {
    const child = React.Children.only(children);
    const clonedChild = React.cloneElement(
      child as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
      {
        className: cn(
          "group py-4 px-8 flex gap-4 align-middle text-left text-gray-300 rounded-r-xl",
          !open && "pr-6",
          !isActive && "hover:cursor-pointer hover:text-white",
          isActive && "bg-orange-100 border-l-4 border-teal-800 text-gray-900",
          (child as React.ReactElement<React.HTMLAttributes<HTMLElement>>).props
            .className ?? "",
          className,
        ),
        ...props,
        children: (
          <>
            <div
              className={cn(
                "h-6 w-6 text-gray-300 *:h-full *:w-full *:object-contain",
                !isActive && "group-hover:text-white",
                isActive && "text-teal-800",
              )}
            >
              {icon}
            </div>

            <span
              className={cn(
                "block text-nowrap",
                open ? "w-full" : "hidden w-0 overflow-hidden",
              )}
            >
              {
                (child as React.ReactElement<React.HTMLAttributes<HTMLElement>>)
                  .props.children
              }
            </span>
          </>
        ),
      },
    );

    return <li className="relative">{clonedChild}</li>;
  }

  return (
    <li
      className={cn(
        "group flex gap-4 px-8 py-4 align-middle text-gray-300 hover:cursor-pointer hover:text-white",
        !open && "pr-6",
        !isActive && "hover:cursor-pointer hover:text-white",
        isActive && "border-l-4 border-teal-800 bg-orange-100 text-gray-900",
        className,
      )}
      {...props}
    >
      <div className="h-6 w-6 text-gray-300 group-hover:text-white">{icon}</div>

      {/* w-0 serait mieux que hidden pour une transion mais pour l'instant
      hidden marche le mieux, sinon lorsqu'on réduit la sidebar le gap fait
      réduire la taille de l'image */}
      <span
        className={cn(
          "block text-nowrap",
          open ? "w-full" : "hidden w-0 overflow-hidden",
        )}
      >
        {children}
      </span>
    </li>
  );
}

export function SidebarMenu({
  children,
  className,
  ...props
}: React.ComponentProps<"ul">) {
  const { isMobile } = useSidebar();

  return (
    <ul
      className={cn(
        "flex",
        !isMobile && "flex-col gap-1",
        isMobile && "h-full",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}
