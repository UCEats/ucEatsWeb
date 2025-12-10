import { v } from "convex/values";
import { mutation, query } from "../_generated/server";


export const getOrCreateDate = mutation({
  args: {
    date: v.string(),
  },
  handler: async (ctx, { date }) => {
    const existing = await ctx.db.query("dates").withIndex("by_date", q => q.eq("date", date)).first();
    if (existing) {
        return existing._id;
    }
    const newDate = await ctx.db.insert("dates", {date: date, createdAt: Date.now()})
    return newDate;
  },
});
export const getDateByString = query({
    args: { date: v.string() },
    handler: async (ctx, args) => {
      return await ctx.db
        .query("dates")
        .withIndex("by_date", q => q.eq("date", args.date))
        .unique();
    },
  });
export const listAllDates = query({
    handler: async (ctx) => {
      return await ctx.db.query("dates").collect();
    },
  });