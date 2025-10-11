# How to Use Paginated Transactions in Next.js

## Overview
The `paginated` query returns:
- `results`: Array of transactions for current page
- `continueCursor`: Cursor for next page (null if no more pages)
- `isDone`: Boolean indicating if we've reached the end

## Example 1: Basic Pagination (Load More Button)

```tsx
"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function TransactionsPage() {
  const { user } = useUser();
  
  // usePaginatedQuery automatically manages the pagination state
  const { results, status, loadMore } = usePaginatedQuery(
    api.transaction.paginated,
    { userId: user?.id ?? "" },
    { initialNumItems: 10 } // Show 10 items per page
  );

  if (status === "LoadingFirstPage") {
    return <div>Loading transactions...</div>;
  }

  return (
    <div>
      <h1>Transactions</h1>
      
      {/* Transaction List */}
      <div className="space-y-4">
        {results.map((transaction) => (
          <div key={transaction._id} className="border p-4 rounded">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{transaction.name}</p>
                <p className="text-sm text-gray-600">{transaction.category}</p>
              </div>
              <div>
                <p className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <button
        onClick={() => loadMore(10)} // Load 10 more items
        disabled={status !== "CanLoadMore"}
        className="mt-4 px-4 py-2 bg-teal-800 text-white rounded disabled:opacity-50"
      >
        {status === "CanLoadMore" ? "Load More" : "No More Transactions"}
      </button>
    </div>
  );
}
```

## Example 2: Infinite Scroll

```tsx
"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export default function TransactionsPage() {
  const { user } = useUser();
  const { results, status, loadMore } = usePaginatedQuery(
    api.transaction.paginated,
    { userId: user?.id ?? "" },
    { initialNumItems: 10 }
  );

  // Intersection Observer for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && status === "CanLoadMore") {
          loadMore(10);
        }
      },
      { threshold: 1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [status, loadMore]);

  return (
    <div>
      <h1>Transactions</h1>
      
      <div className="space-y-4">
        {results.map((transaction) => (
          <TransactionCard key={transaction._id} transaction={transaction} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className="h-10 flex items-center justify-center">
        {status === "LoadingMore" && <p>Loading more...</p>}
        {status === "Exhausted" && <p>No more transactions</p>}
      </div>
    </div>
  );
}
```

## Example 3: Manual Cursor Control (Advanced)

```tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function TransactionsPage() {
  const { user } = useUser();
  const [cursor, setCursor] = useState<string | null>(null);
  
  const data = useQuery(api.transaction.paginated, {
    userId: user?.id ?? "",
    paginationOpts: {
      numItems: 10,
      cursor: cursor,
    },
  });

  if (!data) return <div>Loading...</div>;

  const { results, continueCursor, isDone } = data;

  return (
    <div>
      <h1>Transactions</h1>
      
      <div className="space-y-4">
        {results.map((transaction) => (
          <TransactionCard key={transaction._id} transaction={transaction} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setCursor(null)}
          disabled={cursor === null}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          First Page
        </button>
        
        <button
          onClick={() => setCursor(continueCursor)}
          disabled={isDone}
          className="px-4 py-2 bg-teal-800 text-white rounded disabled:opacity-50"
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
```

## Example 4: With Search and Filters

```tsx
"use client";

import { usePaginatedQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function TransactionsPage() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Use different query based on filter
  const { results, status, loadMore } = usePaginatedQuery(
    selectedCategory
      ? api.transaction.paginatedByCategory
      : api.transaction.paginated,
    selectedCategory
      ? { userId: user?.id ?? "", category: selectedCategory }
      : { userId: user?.id ?? "" },
    { initialNumItems: 10 }
  );

  return (
    <div>
      <h1>Transactions</h1>
      
      {/* Category Filter */}
      <select
        value={selectedCategory ?? ""}
        onChange={(e) => setSelectedCategory(e.target.value || null)}
        className="mb-4 p-2 border rounded"
      >
        <option value="">All Categories</option>
        <option value="Dining Out">Dining Out</option>
        <option value="Bills">Bills</option>
        <option value="Entertainment">Entertainment</option>
        {/* Add more categories */}
      </select>

      {/* Transaction List */}
      <div className="space-y-4">
        {results.map((transaction) => (
          <TransactionCard key={transaction._id} transaction={transaction} />
        ))}
      </div>

      {/* Load More */}
      <button
        onClick={() => loadMore(10)}
        disabled={status !== "CanLoadMore"}
        className="mt-4 px-4 py-2 bg-teal-800 text-white rounded"
      >
        {status === "CanLoadMore" ? "Load More" : "No More"}
      </button>
    </div>
  );
}
```

## Key Points

1. **Use `usePaginatedQuery`** - It's the easiest way to handle pagination in Convex
   - Automatically manages state
   - Provides `loadMore()` function
   - Gives you `status` for UI feedback

2. **Status Values**:
   - `LoadingFirstPage` - Initial load
   - `CanLoadMore` - More data available
   - `LoadingMore` - Currently fetching next page
   - `Exhausted` - No more data

3. **For Dashboard Widgets** - Use `latest` query instead:
   ```tsx
   const latestTransactions = useQuery(api.transaction.latest, {
     userId: user?.id ?? "",
     limit: 5, // Only show 5 on dashboard
   });
   ```

4. **Performance**:
   - Initial page: 10 items (fast load)
   - Load more: Add 10 more each time
   - Convex handles cursor management automatically

5. **Client-Side Filtering** (for search):
   - Fetch all data needed
   - Filter in React for instant response
   - Or create server-side search queries for large datasets
