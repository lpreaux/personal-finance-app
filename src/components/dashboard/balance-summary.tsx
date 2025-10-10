import { BalanceCard } from "./balance-card";
import { cn } from "~/lib/utils";

interface BalanceSummaryProps {
  currentBalance: string;
  income: string;
  expense: string;
  className?: string;
}

export function BalanceSummary({
  currentBalance,
  income,
  expense,
  className,
}: BalanceSummaryProps) {
  return (
    <section aria-labelledby="balance-heading" className={className}>
      <h2 id="balance-heading" className="sr-only">
        Account Balance Summary
      </h2>
      <div
        className={cn(
          "flex flex-col gap-3",
          "tablet:flex-row tablet:gap-6",
        )}
      >
        <BalanceCard
          label="Current Balance"
          amount={currentBalance}
          variant="dark"
        />
        <BalanceCard label="Income" amount={income} />
        <BalanceCard label="Expense" amount={expense} />
      </div>
    </section>
  );
}
