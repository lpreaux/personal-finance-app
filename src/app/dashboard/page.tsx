import Link from "next/link";
import { PotsOutlineIcon } from "~/components/icons";
import { Card } from "~/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-preset-1">Overview</h1>

      {/* Balance Summary Section */}
      <section aria-labelledby="balance-heading">
        <h2 id="balance-heading" className="sr-only">
          Account Balance Summary
        </h2>
        <div className="flex flex-col gap-3">
          <Card asChild className="bg-gray-900 text-white">
            <article>
              <dl>
                <dt className="text-preset-4 text-gray-500">Current Balance</dt>
                <dd className="text-preset-1">$4836.00</dd>
              </dl>
            </article>
          </Card>
          <Card asChild>
            <article>
              <dl>
                <dt className="text-preset-4 text-gray-500">Income</dt>
                <dd className="text-preset-1">$3814.25</dd>
              </dl>
            </article>
          </Card>
          <Card asChild>
            <article>
              <dl>
                <dt className="text-preset-4 text-gray-500">Expense</dt>
                <dd className="text-preset-1">$1700.50</dd>
              </dl>
            </article>
          </Card>
        </div>
      </section>

      {/* Dashboard Widgets Grid */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {/* Pots Section */}
          <Card asChild className="py-6">
            <section aria-labelledby="pots-heading">
              <header className="mb-5 flex items-center justify-between">
                <h2 id="pots-heading" className="text-preset-2">
                  Pots
                </h2>
                <Link
                  href="/dashboard/pots"
                  className="text-preset-4 text-gray-500 hover:text-gray-900"
                >
                  See details
                  <span className="sr-only"> for savings pots</span>
                </Link>
              </header>
              <div className="flex flex-col gap-5">
                <Card
                  asChild
                  className="flex items-center gap-4 bg-orange-100 p-4"
                >
                  <article aria-label="Total savings summary">
                    <PotsOutlineIcon
                      className="text-teal-800"
                      aria-hidden="true"
                    />
                    <dl>
                      <dt className="text-preset-4 text-gray-500">
                        Total Saved
                      </dt>
                      <dd className="text-preset-1">$850</dd>
                    </dl>
                  </article>
                </Card>
                <ul className="grid grid-cols-2 gap-4" role="list">
                  <li className="flex items-center gap-4">
                    <div
                      className="h-full w-1 rounded-lg bg-teal-800"
                      aria-hidden="true"
                    />
                    <dl>
                      <dt className="text-preset-5 text-gray-500">Savings</dt>
                      <dd className="text-preset-5-bold">$159</dd>
                    </dl>
                  </li>
                  <li className="flex items-center gap-4">
                    <div
                      className="h-full w-1 rounded-lg bg-cyan-500"
                      aria-hidden="true"
                    />
                    <dl>
                      <dt className="text-preset-5 text-gray-500">Gift</dt>
                      <dd className="text-preset-4-bold">$40</dd>
                    </dl>
                  </li>
                  <li className="flex items-center gap-4">
                    <div
                      className="h-full w-1 rounded-lg bg-blue-800"
                      aria-hidden="true"
                    />
                    <dl>
                      <dt className="text-preset-5 text-gray-500">
                        Concert Ticket
                      </dt>
                      <dd className="text-preset-4-bold">$110</dd>
                    </dl>
                  </li>
                  <li className="flex items-center gap-4">
                    <div
                      className="h-full w-1 rounded-lg bg-yellow-500"
                      aria-hidden="true"
                    />
                    <dl>
                      <dt className="text-preset-5 text-gray-500">
                        New Laptop
                      </dt>
                      <dd className="text-preset-4-bold">$10</dd>
                    </dl>
                  </li>
                </ul>
              </div>
            </section>
          </Card>

          {/* Transactions Section */}
          <Card asChild className="py-6">
            <section aria-labelledby="transactions-heading">
              <header className="mb-5 flex items-center justify-between">
                <h2 id="transactions-heading" className="text-preset-2">
                  Transactions
                </h2>
                <Link
                  href="/dashboard/transactions"
                  className="text-preset-4 text-gray-500 hover:text-gray-900"
                >
                  See details
                  <span className="sr-only"> for transactions</span>
                </Link>
              </header>
            </section>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {/* Budget Section */}
          <Card asChild className="py-6">
            <section aria-labelledby="budget-heading">
              <header className="mb-5 flex items-center justify-between">
                <h2 id="budget-heading" className="text-preset-2">
                  Budget
                </h2>
                <Link
                  href="/dashboard/budgets"
                  className="text-preset-4 text-gray-500 hover:text-gray-900"
                >
                  See details
                  <span className="sr-only"> for budgets</span>
                </Link>
              </header>
            </section>
          </Card>

          {/* Recurring Bills Section */}
          <Card asChild className="py-6">
            <section aria-labelledby="recurring-bills-heading">
              <header className="mb-5 flex items-center justify-between">
                <h2 id="recurring-bills-heading" className="text-preset-2">
                  Recurring Bills
                </h2>
                <Link
                  href="/dashboard/recurring-bills"
                  className="text-preset-4 text-gray-500 hover:text-gray-900"
                >
                  See details
                  <span className="sr-only"> for recurring bills</span>
                </Link>
              </header>
            </section>
          </Card>
        </div>
      </div>
    </div>
  );
}
