import Link from "next/link";
import {
  BudgetsIcon,
  HomeIcon,
  PotsIcon,
  RecurringBillsIcon,
  TransactionsIcon,
} from "./icons";
import { Sidebar, SidebarMenu, SidebarMenuItem } from "./ui/sidebar";

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarMenu>
        <SidebarMenuItem asChild icon={<HomeIcon />}>
          <Link href="/dashboard">Home</Link>
        </SidebarMenuItem>
        <SidebarMenuItem asChild icon={<TransactionsIcon />}>
          <Link href="/dashboard/transactions">Transactions</Link>
        </SidebarMenuItem>
        <SidebarMenuItem asChild icon={<BudgetsIcon />}>
          <Link href="/dashboard/budgets">Budgets</Link>
        </SidebarMenuItem>
        <SidebarMenuItem asChild icon={<PotsIcon />}>
          <Link href="/dashboard/pots">Pots</Link>
        </SidebarMenuItem>
        <SidebarMenuItem asChild icon={<RecurringBillsIcon />}>
          <Link href="/dashboard/recurring-bills">Recurring bills</Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </Sidebar>
  );
}
