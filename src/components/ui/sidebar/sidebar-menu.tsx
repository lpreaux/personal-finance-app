import { cn } from "~/lib/utils";

export function SidebarMenu({
  children,
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "flex h-full justify-between",
        "desktop:h-auto desktop:flex-col desktop:gap-1",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}
