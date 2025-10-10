import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { SectionHeader } from "./section-header";

interface TransactionsWidgetProps {
  className?: string;
}

export function TransactionsWidget({ className }: TransactionsWidgetProps) {
  return (
    <Card asChild className={cn("py-6", className)}>
      <section aria-labelledby="transactions-heading">
        <SectionHeader
          id="transactions-heading"
          title="Transactions"
          href="/dashboard/transactions"
          srOnlyText="for transactions"
        />
        {/* Content will be added when fetching real data */}
      </section>
    </Card>
  );
}
