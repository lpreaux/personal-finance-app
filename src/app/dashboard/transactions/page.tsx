"use client";

import Image from "next/image";
import { Fragment } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";

import { Card } from "~/components/ui/card";
import { Pagination } from "~/components/ui/pagination";
import {
  useClassicalPagination,
  calculateTotalPages,
} from "~/hooks/use-classical-pagination";

function TransactionItem({
  transaction,
}: {
  transaction: Doc<"transactions">;
}) {
  return (
    <>
      <div role="cell" className="flex items-center gap-4">
        <div className="relative min-h-10 min-w-10 overflow-hidden rounded-full">
          <Image src={transaction.avatar} alt="avatar" fill />
        </div>
        <span className="text-preset-4-bold text-gray-900">
          {transaction.name}
        </span>
      </div>
      <div role="cell" className="text-preset-5 text-gray-500">
        {transaction.category}
      </div>
      <div role="cell" className="text-preset-5 text-gray-500">
        {new Date(transaction.date).toLocaleDateString()}
      </div>
      <div
        role="cell"
        className={`text-preset-4-bold text-right ${
          transaction.amount >= 0 ? "text-green-600" : "text-gray-900"
        }`}
      >
        {transaction.amount >= 0 ? "+" : ""}$
        {Math.abs(transaction.amount).toFixed(2)}
      </div>
    </>
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
    <div className="flex flex-col gap-8">
      <h1 className="text-preset-1">Transactions</h1>
      <Card asChild className="p-8">
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <input type="text"></input>
            <div className="flex gap-6">
              <div className="flex gap-2">
                <label htmlFor="sort-by">Sort by</label>
                <select id="sort-by"></select>
              </div>
              <div className="flex gap-2">
                <label htmlFor="category">Category</label>
                <select id="category"></select>
              </div>
            </div>
          </div>

          <div
            role="table"
            className="grid grid-cols-[minmax(200px,2fr)_1fr_1fr_auto] items-center gap-x-8 gap-y-4"
          >
            {/* Header */}
            <div role="columnheader" className="text-preset-5 text-gray-500">
              Recipient / Sender
            </div>
            <div role="columnheader" className="text-preset-5 text-gray-500">
              Category
            </div>
            <div role="columnheader" className="text-preset-5 text-gray-500">
              Transaction Date
            </div>
            <div
              role="columnheader"
              className="text-preset-5 text-right text-gray-500"
            >
              Amount
            </div>

            {/* Transactions */}
            {transactions.map((transaction: Doc<"transactions">, index) => (
              <Fragment key={transaction._id}>
                <TransactionItem transaction={transaction} />
                {index < transactions.length - 1 && (
                  <div className="col-span-4 h-[1px] bg-gray-100" />
                )}
              </Fragment>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            onPageChange={(page) => goToPage(page)}
            totalPages={totalPages}
          />
        </section>
      </Card>
    </div>
  );
}
