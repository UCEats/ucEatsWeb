import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
export const getMealsForDate = query({
  args: {
    dateId: v.id("dates"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_dateId", q => q.eq("dateId", args.dateId))
      .collect();
  },
});

export const getMealById = query({
    args: { mealId: v.id("menuItems") },
    handler: async (ctx, args) => {
      return await ctx.db.get(args.mealId);
    },
  });

export const createMeal = mutation({
  args: {
    dateId: v.id("dates"),
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner")
    ),
    mealCategory: v.union(
      v.literal("main"),
      v.literal("side"),
      v.literal("dessert")
    ),
    name: v.string(),
    isVegan: v.boolean(),
    isVegetarian: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("menuItems", {
      name: args.name,
      mealCategory: args.mealCategory,
      dateId: args.dateId,
      mealType: args.mealType,
      isVegan: args.isVegan,
      isVegetarian: args.isVegetarian,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const updateMeal = mutation({
    args: {
      mealId: v.id("menuItems"),
      name: v.optional(v.string()),
      mealCategory: v.optional(v.union(
        v.literal("main"),
        v.literal("side"),
        v.literal("dessert")
      )),
      isVegan: v.optional(v.boolean()),
      isVegetarian: v.optional(v.boolean()),
      mealType: v.optional(
        v.union(
          v.literal("breakfast"),
          v.literal("lunch"),
          v.literal("dinner")
        )
      ),
      updatedAt: v.number()
    },
    handler: async (ctx, args) => {
      const { mealId, ...patch } = args;
  
    // Only update the table fields + updatedAt
    const updatedFields: Record<string, any> = {
      ...patch,
      updatedAt: Date.now(),
    };

    return await ctx.db.patch(mealId, updatedFields);
    }
  });
  
  

export const deleteMeal = mutation({
  args: {
    mealId: v.id("menuItems"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.mealId);
  },
});
