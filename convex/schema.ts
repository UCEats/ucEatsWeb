import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...

  admins: defineTable({
    password: v.string(),
    username: v.string(),
  }),
  dates: defineTable({
    date: v.string(), // "2025-11-22" (ISO format)
    createdAt: v.number(),
  }).index("by_date", ["date"]), 
  menuItems: defineTable({
    dateId: v.string(),
    name: v.string(),
    mealType: v.union(v.literal("breakfast"), v.literal("lunch"), v.literal("dinner")),
    mealCategory: v.union(v.literal("main"), v.literal("side"), v.literal("dessert")),
    isVegan: v.boolean(),
    isVegetarian: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_dateId", ["dateId"]),

  feedback: defineTable({
    deviceId: v.string(),
    dateId: v.id("dates"),
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"), v.literal("dinner")),
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
    createdAt: v.number(),
  })
  .index("by_device_date_mealType", ["deviceId","mealType", "dateId"])
  .index("bydate_mealType", ["mealType", "dateId"])
  .index("by_dateId", ["dateId"]),

  
});

