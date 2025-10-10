"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "~/lib/utils";
import { MinimizeIcon } from "~/components/icons/minimize-menu";
import { useSidebar } from "./sidebar-context";
import { SidebarMenuItem } from "./sidebar-menu-item";

export function Sidebar({ children, className }: React.ComponentProps<"div">) {
  const { open, toggleSidebar } = useSidebar();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div
        className={cn(
          "fixed bottom-0 left-0 flex h-(--sidebar-height-mobile) w-full rounded-t-lg bg-gray-900 px-4 pt-2 text-white",
          "tablet:px-10 tablet:h-(--sidebar-height-tablet)",
          "desktop:hidden",
          className,
        )}
      >
        <div className="flex-grow" aria-label="Navigation principale">
          {children}
        </div>
      </div>

      {/* Desktop Side Navigation */}
      <div
        className={cn(
          "hidden",
          "desktop:fixed desktop:flex desktop:h-svh desktop:flex-col desktop:rounded-r-2xl desktop:bg-gray-900 desktop:text-white",
          open
            ? "desktop:w-(--sidebar-width)"
            : "desktop:w-(--sidebar-width-icon)",
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
    </>
  );
}
