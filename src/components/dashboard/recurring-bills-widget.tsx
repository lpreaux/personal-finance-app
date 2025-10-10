import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { SectionHeader } from "./section-header";

interface RecurringBillsWidgetProps {
  className?: string;
}

export function RecurringBillsWidget({ className }: RecurringBillsWidgetProps) {
  return (
    <Card asChild className={cn("py-6", className)}>
      <section aria-labelledby="recurring-bills-heading">
        <SectionHeader
          id="recurring-bills-heading"
          title="Recurring Bills"
          href="/dashboard/recurring-bills"
          srOnlyText="for recurring bills"
        />
        {/* Content will be added when fetching real data */}
      </section>
    </Card>
  );
}
