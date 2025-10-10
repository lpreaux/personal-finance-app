import { cn } from "~/lib/utils";
import {
  BalanceSummary,
  BudgetWidget,
  PotsWidget,
  RecurringBillsWidget,
  TransactionsWidget,
} from "~/components/dashboard";

export default function DashboardPage() {
  // TODO: Replace with real data from Convex
  const balanceData = {
    currentBalance: "$4836.00",
    income: "$3814.25",
    expense: "$1700.50",
  };

  const potsData = {
    totalSaved: "$850",
    pots: [
      { name: "Savings", amount: "$159", color: "#277C78" },
      { name: "Gift", amount: "$40", color: "#82C9D7" },
      { name: "Concert Ticket", amount: "$110", color: "#626070" },
      { name: "New Laptop", amount: "$10", color: "#F2CDAC" },
    ],
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-preset-1">Overview</h1>

      <BalanceSummary
        currentBalance={balanceData.currentBalance}
        income={balanceData.income}
        expense={balanceData.expense}
      />

      {/* Dashboard Widgets Grid */}
      <div className={cn("flex flex-col gap-6", "desktop:flex-row")}>
        <div className={cn("flex flex-grow flex-col gap-4", "tablet:gap-6")}>
          <PotsWidget totalSaved={potsData.totalSaved} pots={potsData.pots} />
          <TransactionsWidget />
        </div>

        <div className="flex flex-col gap-4">
          <BudgetWidget />
          <RecurringBillsWidget />
        </div>
      </div>
    </div>
  );
}
