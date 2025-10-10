import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { SectionHeader } from "./section-header";

interface BudgetWidgetProps {
  className?: string;
}

export function BudgetWidget({ className }: BudgetWidgetProps) {
  return (
    <Card asChild className={cn("py-6", className)}>
      <section aria-labelledby="budget-heading">
        <SectionHeader
          id="budget-heading"
          title="Budget"
          href="/dashboard/budgets"
          srOnlyText="for budgets"
        />
        {/* Content will be added when fetching real data */}
      </section>
    </Card>
  );
}
