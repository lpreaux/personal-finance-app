"use client";

import { useUser } from "@clerk/nextjs";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Card } from "~/components/ui/card";
import { Pagination, PaginationInfo } from "~/components/ui/pagination";
import {
  useClassicalPagination,
  calculateTotalPages,
} from "~/hooks/use-classical-pagination";

function TransactionCard({
  transaction,
}: {
  transaction: Doc<"transactions">;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-preset-4-bold text-gray-900">{transaction.name}</p>
          <p className="text-preset-5 text-gray-500">{transaction.category}</p>
        </div>
        <div className="text-right">
          <p
            className={`text-preset-4-bold ${
              transaction.amount >= 0 ? "text-green-600" : "text-gray-900"
            }`}
          >
            {transaction.amount >= 0 ? "+" : ""}$
            {Math.abs(transaction.amount).toFixed(2)}
          </p>
          <p className="text-preset-5 text-gray-500">
            {new Date(transaction.date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function TransactionsPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";

  const PAGE_SIZE = 10;

  // Get total count for pagination metadata
  const totalCount = useQuery(api.transaction.count, { userId });

  // Use classical pagination hook
  const {
    data: transactions,
    currentPage,
    isLoading,
    goToPage,
  } = useClassicalPagination(api.transaction.paginated, { userId }, PAGE_SIZE);

  // Calculate total pages
  const totalPages = calculateTotalPages(totalCount ?? 0, PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-100">
        <div className="text-preset-2 text-gray-900">
          Loading transactions...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-preset-1 text-gray-900">Transactions</h1>
          <p className="text-preset-4 mt-2 text-gray-500">
            View and manage your financial transactions
          </p>
        </div>

        {/* Pagination Info */}
        <div className="mb-4">
          <PaginationInfo
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            totalItems={totalCount ?? 0}
          />
        </div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <p className="text-preset-2 text-gray-500">No transactions found</p>
            <p className="text-preset-4 mt-2 text-gray-400">
              Your transactions will appear here once you add them
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction: Doc<"transactions">) => (
              <TransactionCard
                key={transaction._id}
                transaction={transaction}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              maxVisiblePages={5}
            />
          </div>
        )}
      </div>
    </div>
  );
}
