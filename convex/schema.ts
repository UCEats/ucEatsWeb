import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...
  dates: defineTable({
    date: v.string(), // "2025-11-22" (ISO format)
    createdAt: v.number(),
  }).index("by_date", ["date"]),

  menuItems: defineTable({
    dateId: v.string(),
    name: v.string(),
    mealType: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
    ),
    mealCategory: v.union(
      v.literal("main"),
      v.literal("side"),
      v.literal("dessert"),
    ),
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
      v.literal("lunch"),
      v.literal("dinner"),
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
      v.literal(5),
    ),
    name: v.optional(v.string()),
    comment: v.optional(v.string()),
    pushToken: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_device_date_mealType", ["deviceId", "mealType", "dateId"])
    .index("bydate_mealType", ["mealType", "dateId"])
    .index("by_dateId", ["dateId"]),

  generalFeedback: defineTable({
    deviceId: v.string(),
    name: v.string(),
    comment: v.string(),
    pushToken: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  sectionImages: defineTable({
    date: v.string(),
    section: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
    ),
    storageId: v.id("_storage"),
    imageUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
  }).index("by_date_section", ["date", "section"]),

  mealFeedbackLikes: defineTable({
    feedbackId: v.id("feedback"),
    deviceId: v.string(),
    createdAt: v.number(),
  })
    .index("by_feedbackId", ["feedbackId"])
    .index("by_device_feedbackId", ["deviceId", "feedbackId"]),

  generalFeedbackLikes: defineTable({
    feedbackId: v.id("generalFeedback"),
    deviceId: v.string(),
    createdAt: v.number(),
  })
    .index("by_feedbackId", ["feedbackId"])
    .index("by_device_feedbackId", ["deviceId", "feedbackId"]),

  feedbackAcknowledgments: defineTable({
    pushToken: v.string(),
    feedbackType: v.union(v.literal("meal"), v.literal("general")),
    mealType: v.optional(v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
    )),
    name: v.optional(v.string()),
    comment: v.optional(v.string()),
    rating: v.optional(v.number()),
    seen: v.boolean(),
    createdAt: v.number(),
  }).index("by_pushToken_seen", ["pushToken", "seen"]),
});
