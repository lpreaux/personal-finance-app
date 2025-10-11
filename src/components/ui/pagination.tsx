import { cn } from "~/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

/**
 * Classical Pagination Component
 *
 * Displays pagination controls with:
 * - First page button
 * - Last page button
 * - Up to N numbered page buttons (default: 5)
 * - Smart truncation for many pages
 *
 * @example
 * <Pagination
 *   currentPage={3}
 *   totalPages={10}
 *   onPageChange={(page) => setCurrentPage(page)}
 *   maxVisiblePages={5}
 * />
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  // Calculate which page numbers to show
  const getVisiblePages = (): number[] => {
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  };

  const visiblePages = getVisiblePages();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  if (totalPages <= 1) {
    return null; // Don't show pagination for single page
  }

  return (
    <nav
      className="flex items-center justify-center gap-2"
      role="navigation"
      aria-label="Pagination"
    >
      {/* First Page Button */}
      <button
        onClick={() => onPageChange(1)}
        disabled={isFirstPage}
        className={cn(
          "text-preset-4 flex h-10 min-w-10 items-center justify-center rounded-lg border-2 px-3 transition-colors",
          isFirstPage
            ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
            : "border-gray-500 bg-white text-gray-900 hover:border-teal-800 hover:bg-orange-100 hover:text-teal-800",
        )}
        aria-label="Go to first page"
      >
        First
      </button>

      {/* Numbered Page Buttons */}
      {visiblePages.map((pageNum) => {
        const isActive = pageNum === currentPage;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            disabled={isActive}
            className={cn(
              "text-preset-4-bold flex h-10 min-w-10 items-center justify-center rounded-lg border-2 px-3 transition-colors",
              isActive
                ? "cursor-default border-teal-800 bg-teal-800 text-white"
                : "border-gray-500 bg-white text-gray-900 hover:border-teal-800 hover:bg-orange-100 hover:text-teal-800",
            )}
            aria-label={`Go to page ${pageNum}`}
            aria-current={isActive ? "page" : undefined}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Last Page Button */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={isLastPage}
        className={cn(
          "text-preset-4 flex h-10 min-w-10 items-center justify-center rounded-lg border-2 px-3 transition-colors",
          isLastPage
            ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
            : "border-gray-500 bg-white text-gray-900 hover:border-teal-800 hover:bg-orange-100 hover:text-teal-800",
        )}
        aria-label="Go to last page"
      >
        Last
      </button>
    </nav>
  );
}

/**
 * Pagination Info Display
 *
 * Shows "Showing X-Y of Z results" text
 */
interface PaginationInfoProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalItems === 0) {
    return <p className="text-preset-4 text-gray-500">No results found</p>;
  }

  return (
    <p className="text-preset-4 text-gray-500">
      Showing <span className="font-bold text-gray-900">{startItem}</span>-
      <span className="font-bold text-gray-900">{endItem}</span> of{" "}
      <span className="font-bold text-gray-900">{totalItems}</span> results
    </p>
  );
}
