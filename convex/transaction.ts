import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

/**
 * Get total count of transactions for a user
 * Used for calculating pagination metadata
 */
export const count = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return transactions.length;
  },
});

/**
 * List all transactions for a user (without pagination)
 * Use this for small lists like "latest 5 transactions" on dashboard
 */
export const list = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

/**
 * List transactions with pagination (RECOMMENDED for transactions page)
 * Returns paginated results with cursor for loading more
 *
 * @example
 * const { results, continueCursor, isDone } = useQuery(api.transaction.paginated, {
 *   userId: user.id,
 *   paginationOpts: { numItems: 10, cursor: null }
 * });
 */
export const paginated = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/**
 * List transactions by category with pagination
 */
export const paginatedByCategory = query({
  args: {
    userId: v.string(),
    category: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_user_and_category", (q) =>
        q.eq("userId", args.userId).eq("category", args.category),
      )
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/**
 * Get latest N transactions (for dashboard widgets)
 */
export const latest = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    return await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});

/**
 * Import multiple transactions at once (for data migration/sandbox)
 * WARNING: This mutation is intended for development/sandbox use only
 */
export const importTransactions = mutation({
  args: {
    userId: v.string(),
    transactions: v.array(
      v.object({
        avatar: v.optional(v.string()),
        name: v.string(),
        category: v.string(),
        date: v.string(),
        amount: v.number(),
        recurring: v.boolean(),
      }),
    ),
    clearExisting: v.optional(v.boolean()), // If true, delete existing transactions first
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Optional: Clear existing transactions for this user
    if (args.clearExisting) {
      const existingTransactions = await ctx.db
        .query("transactions")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();

      for (const transaction of existingTransactions) {
        await ctx.db.delete(transaction._id);
      }
    }

    // Import new transactions
    const insertedIds = [];
    for (const transaction of args.transactions) {
      const id = await ctx.db.insert("transactions", {
        userId: args.userId,
        name: transaction.name,
        category: transaction.category,
        amount: transaction.amount,
        date: transaction.date,
        avatar: transaction.avatar,
        recurring: transaction.recurring,
        createdAt: now,
        updatedAt: now,
      });
      insertedIds.push(id);
    }

    return {
      success: true,
      imported: insertedIds.length,
      cleared: args.clearExisting ? true : false,
    };
  },
});
