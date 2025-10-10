import Link from "next/link";
import { cn } from "~/lib/utils";

interface SectionHeaderProps {
  id: string;
  title: string;
  href: string;
  srOnlyText?: string;
  className?: string;
}

export function SectionHeader({
  id,
  title,
  href,
  srOnlyText,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("mb-5 flex items-center justify-between", className)}>
      <h2 id={id} className="text-preset-2">
        {title}
      </h2>
      <Link
        href={href}
        className="text-preset-4 text-gray-500 hover:text-gray-900"
      >
        See details
        {srOnlyText && <span className="sr-only"> {srOnlyText}</span>}
      </Link>
    </header>
  );
}
