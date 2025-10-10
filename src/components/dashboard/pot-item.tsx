import { cn } from "~/lib/utils";

interface PotItemProps {
  name: string;
  amount: string;
  color: string;
  className?: string;
}

export function PotItem({ name, amount, color, className }: PotItemProps) {
  return (
    <li className={cn("flex items-center gap-4", className)}>
      <div
        className="h-full w-1 rounded-lg"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <dl>
        <dt className="text-preset-5 text-gray-500">{name}</dt>
        <dd className="text-preset-4-bold">{amount}</dd>
      </dl>
    </li>
  );
}
