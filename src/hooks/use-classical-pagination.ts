import { useState, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
import type { FunctionReference } from "convex/server";

/**
 * Custom Hook for Classical Pagination with Convex Cursor-Based API
 *
 * Converts Convex's cursor-based pagination to classical numbered pages.
 * Maintains a map of page numbers to cursors for efficient navigation.
 *
 * @param queryFn - Convex paginated query function
 * @param queryArgs - Additional query arguments (excluding paginationOpts)
 * @param pageSize - Number of items per page
 *
 * @example
 * const { data, currentPage, totalPages, goToPage, isLoading } = useClassicalPagination(
 *   api.transaction.paginated,
 *   { userId: user.id },
 *   10
 * );
 */
export function useClassicalPagination<T extends FunctionReference<"query">>(
  queryFn: T,
  queryArgs: Omit<T["_args"], "paginationOpts">,
  pageSize: number = 10,
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [cursorMap, setCursorMap] = useState<Map<number, string | null>>(
    new Map([[1, null]]), // Page 1 always starts with null cursor
  );

  // Get the cursor for the current page
  const currentCursor = cursorMap.get(currentPage) ?? null;

  // Fetch current page data
  const pageData = useQuery(queryFn, {
    ...queryArgs,
    paginationOpts: {
      numItems: pageSize,
      cursor: currentCursor,
    },
  } as T["_args"]);

  // Store cursor for next page when data loads
  useEffect(() => {
    if (pageData && pageData.continueCursor && !pageData.isDone) {
      setCursorMap((prev) => {
        const newMap = new Map(prev);
        if (!newMap.has(currentPage + 1)) {
          newMap.set(currentPage + 1, pageData.continueCursor);
        }
        return newMap;
      });
    }
  }, [pageData, currentPage]);

  const goToPage = useCallback((targetPage: number) => {
    setCurrentPage(targetPage);
  }, []);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback((lastPage: number) => {
    setCurrentPage(lastPage);
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  return {
    data: pageData?.page ?? [],
    currentPage,
    isLoading: pageData === undefined,
    hasNextPage: pageData ? !pageData.isDone : false,
    hasPreviousPage: currentPage > 1,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    continueCursor: pageData?.continueCursor,
    isDone: pageData?.isDone ?? false,
  };
}

/**
 * Hook for pagination with known total count
 *
 * Use this when you have a count query available to calculate total pages
 *
 * @example
 * const totalCount = useQuery(api.transaction.count, { userId: user.id });
 * const pagination = useClassicalPagination(
 *   api.transaction.paginated,
 *   { userId: user.id },
 *   10
 * );
 * const totalPages = Math.ceil((totalCount ?? 0) / 10);
 */
export function calculateTotalPages(
  totalCount: number,
  pageSize: number,
): number {
  return Math.max(1, Math.ceil(totalCount / pageSize));
}
