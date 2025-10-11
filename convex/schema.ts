import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Schema Definition
 *
 * This schema defines the database structure for the personal finance app.
 * All tables include userId for multi-tenant support via Clerk authentication.
 */

export default defineSchema({
  /**
   * Transactions Table
   *
   * Stores all financial transactions (income and expenses).
   * Positive amounts = income, negative amounts = expenses.
   */
  transactions: defineTable({
    // User association (from Clerk auth)
    userId: v.string(),

    // Transaction details
    name: v.string(), // Person/business name (e.g., "Emma Richardson", "Savory Bites Bistro")
    category: v.string(), // Category name (e.g., "General", "Dining Out", "Bills")
    amount: v.number(), // Transaction amount (positive = income, negative = expense)
    date: v.string(), // ISO 8601 date string (e.g., "2024-08-19T14:23:11Z")

    // Optional fields
    avatar: v.optional(v.string()), // Path to avatar image (e.g., "./assets/images/avatars/emma-richardson.jpg")
    recurring: v.boolean(), // Whether this is a recurring transaction

    // Metadata
    createdAt: v.number(), // Timestamp when record was created
    updatedAt: v.number(), // Timestamp when record was last updated
  })
    // Indexes for efficient querying
    .index("by_user", ["userId"]) // Query all transactions for a user
    .index("by_user_and_date", ["userId", "date"]) // Query transactions by user and date (for sorting)
    .index("by_user_and_category", ["userId", "category"]) // Query transactions by user and category
    .index("by_user_recurring", ["userId", "recurring"]), // Query recurring transactions

  /**
   * Budgets Table
   *
   * Stores budget limits for different spending categories.
   * Used to track spending against defined limits.
   */
  budgets: defineTable({
    userId: v.string(),
    category: v.string(), // Must match transaction categories
    maximum: v.number(), // Budget limit
    theme: v.string(), // Hex color for visualization (e.g., "#277C78")
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "category"]), // Ensure unique category per user

  /**
   * Pots Table
   *
   * Stores savings pots/goals with target amounts.
   * Users can save towards multiple goals simultaneously.
   */
  pots: defineTable({
    userId: v.string(),
    name: v.string(), // Pot name (e.g., "Savings", "Concert Ticket", "New Laptop")
    target: v.number(), // Target amount to save
    total: v.number(), // Current saved amount
    theme: v.string(), // Hex color for visualization
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  /**
   * Recurring Bills Table
   *
   * Tracks recurring bills and their payment status.
   * Derived from transactions with recurring=true, but can also be manually managed.
   */
  recurringBills: defineTable({
    userId: v.string(),
    name: v.string(), // Bill name (e.g., "Spark Electric Solutions", "Netflix")
    category: v.string(), // Category (typically "Bills" but can vary)
    amount: v.number(), // Bill amount (typically negative)
    dueDay: v.number(), // Day of month when bill is due (1-31)
    theme: v.optional(v.string()), // Optional color for visualization

    // Payment tracking
    lastPaidDate: v.optional(v.string()), // ISO 8601 date of last payment
    isPaid: v.boolean(), // Whether current month's bill is paid

    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_due_day", ["userId", "dueDay"]), // Query bills by due date
});

/**
 * Category Constants
 *
 * Standard categories used across the app.
 * Keep this list synchronized with your UI components.
 */
export const CATEGORIES = [
  "General",
  "Dining Out",
  "Groceries",
  "Entertainment",
  "Bills",
  "Transportation",
  "Lifestyle",
  "Personal Care",
  "Education",
  "Shopping",
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * Usage Examples:
 *
 * 1. Query all transactions for current user:
 *    const transactions = useQuery(api.transactions.list, { userId: user.id });
 *
 * 2. Create a new transaction:
 *    const createTransaction = useMutation(api.transactions.create);
 *    await createTransaction({
 *      name: "Coffee Shop",
 *      category: "Dining Out",
 *      amount: -4.50,
 *      date: new Date().toISOString(),
 *      recurring: false,
 *    });
 *
 * 3. Query transactions by category:
 *    const diningTransactions = useQuery(api.transactions.listByCategory, {
 *      userId: user.id,
 *      category: "Dining Out"
 *    });
 */
