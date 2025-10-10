import { cn } from "~/lib/utils";

interface SidebarMenuItemIconProps {
  icon: React.ReactNode;
  isActive: boolean;
}

export function SidebarMenuItemIcon({
  icon,
  isActive,
}: SidebarMenuItemIconProps) {
  return (
    <div
      className={cn(
        "text-gray-300 *:h-6 *:w-6 *:object-contain",
        !isActive && "group-hover:text-white",
        isActive && "text-teal-800",
      )}
    >
      {icon}
    </div>
  );
}
