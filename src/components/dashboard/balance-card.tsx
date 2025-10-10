import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface BalanceCardProps {
  label: string;
  amount: string;
  variant?: "default" | "dark";
  className?: string;
}

export function BalanceCard({
  label,
  amount,
  variant = "default",
  className,
}: BalanceCardProps) {
  return (
    <Card
      asChild
      className={cn(
        variant === "dark" && "bg-gray-900 text-white",
        className,
      )}
    >
      <article>
        <dl>
          <dt className="text-preset-4 text-gray-500">{label}</dt>
          <dd className="text-preset-1">{amount}</dd>
        </dl>
      </article>
    </Card>
  );
}
