import { Slot } from "@radix-ui/react-slot";
import { cn } from "~/lib/utils";

interface CardProps extends React.ComponentProps<"div"> {
  asChild?: boolean;
}

export function Card({
  children,
  className,
  asChild = false,
  ...props
}: CardProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn("h-auto w-full rounded-xl bg-white p-5", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
