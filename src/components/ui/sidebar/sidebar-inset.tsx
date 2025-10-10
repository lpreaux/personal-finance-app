"use client";

import { cn } from "~/lib/utils";
import { useSidebar } from "./sidebar-context";

export function SidebarInset({ children }: React.ComponentProps<"div">) {
  const { open } = useSidebar();

  return (
    <main
      className={cn(
        // Mobile styles
        "mb-(--sidebar-height-mobile) w-full px-4 py-6",
        // Tablet styles
        "tablet:px-10 tablet:py-8",
        // Desktop styles
        "desktop:flex-grow",
        open
          ? "desktop:ml-(--sidebar-width)"
          : "desktop:ml-(--sidebar-width-icon)",
      )}
    >
      {children}
    </main>
  );
}
