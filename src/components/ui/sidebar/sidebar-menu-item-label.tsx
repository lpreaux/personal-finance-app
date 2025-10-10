import { cn } from "~/lib/utils";

interface SidebarMenuItemLabelProps {
  children: React.ReactNode;
  open: boolean;
}

export function SidebarMenuItemLabel({
  children,
  open,
}: SidebarMenuItemLabelProps) {
  return (
    <span
      className={cn(
        "hidden text-nowrap",
        "tablet:block tablet:text-preset-5-bold",
        "desktop:text-preset-3",
        open ? "desktop:w-full" : "desktop:w-0 desktop:overflow-hidden",
      )}
    >
      {children}
    </span>
  );
}
