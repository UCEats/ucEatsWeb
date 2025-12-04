import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getAllFeedbackForDate = query({
  args: {
    dateId: v.id("dates"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("feedback")
      .withIndex("by_dateId", q => q.eq("dateId", args.dateId))
      .collect();
  },
});

export const getFeedbackForDateAndMealType = query({
  args: {
    dateId: v.id("dates"),
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("feedback")
      .withIndex("bydate_mealType", (q) =>
        q.eq("mealType", args.mealType)
          .eq("dateId", args.dateId)
      )
      .collect();
  },
});

export const submitFeedback = mutation({
  args: {
    deviceId: v.string(),
    dateId: v.id("dates"),
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner")
    ),
    rating: v.union(
      v.literal(1),
      v.literal(1.5),
      v.literal(2),
      v.literal(2.5),
      v.literal(3),
      v.literal(3.5),
      v.literal(4),
      v.literal(4.5),
      v.literal(5)
    ),
    name: v.optional(v.string()),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingFeedback = await ctx.db.query("feedback").withIndex("by_device_date_mealType", (q) => q.eq("deviceId", args.deviceId).eq("mealType", args.mealType).eq("dateId", args.dateId)).unique();
    if (existingFeedback) {
      throw new Error("Feedback already submitted for this meal and date from this device.");
    }
    return await ctx.db.insert("feedback", {
      deviceId: args.deviceId,
      dateId: args.dateId,
      mealType: args.mealType,
      rating: args.rating,
      name: args.name,
      comment: args.comment,
      createdAt: Date.now(),
    });
  },
});
