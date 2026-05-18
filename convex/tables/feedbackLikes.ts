import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { internal } from "../_generated/api";

export const toggleMealFeedbackLike = mutation({
  args: {
    feedbackId: v.id("feedback"),
    deviceId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("mealFeedbackLikes")
      .withIndex("by_device_feedbackId", (q) =>
        q.eq("deviceId", args.deviceId).eq("feedbackId", args.feedbackId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { liked: false };
    } else {
      await ctx.db.insert("mealFeedbackLikes", {
        feedbackId: args.feedbackId,
        deviceId: args.deviceId,
        createdAt: Date.now(),
      });
      const feedback = await ctx.db.get(args.feedbackId);
      if (feedback?.pushToken) {
        await ctx.scheduler.runAfter(0, internal.tables.notifications.sendPushNotification, {
          pushToken: feedback.pushToken,
        });
        await ctx.db.insert("feedbackAcknowledgments", {
          pushToken: feedback.pushToken,
          feedbackType: "meal",
          mealType: feedback.mealType,
          name: feedback.name,
          comment: feedback.comment,
          rating: feedback.rating,
          seen: false,
          createdAt: Date.now(),
        });
      }
      return { liked: true };
    }
  },
});

export const toggleGeneralFeedbackLike = mutation({
  args: {
    feedbackId: v.id("generalFeedback"),
    deviceId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("generalFeedbackLikes")
      .withIndex("by_device_feedbackId", (q) =>
        q.eq("deviceId", args.deviceId).eq("feedbackId", args.feedbackId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { liked: false };
    } else {
      await ctx.db.insert("generalFeedbackLikes", {
        feedbackId: args.feedbackId,
        deviceId: args.deviceId,
        createdAt: Date.now(),
      });
      const feedback = await ctx.db.get(args.feedbackId);
      if (feedback?.pushToken) {
        await ctx.scheduler.runAfter(0, internal.tables.notifications.sendPushNotification, {
          pushToken: feedback.pushToken,
        });
        await ctx.db.insert("feedbackAcknowledgments", {
          pushToken: feedback.pushToken,
          feedbackType: "general",
          name: feedback.name,
          comment: feedback.comment,
          seen: false,
          createdAt: Date.now(),
        });
      }
      return { liked: true };
    }
  },
});

export const getMyMealLikes = query({
  args: {
    deviceId: v.string(),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("mealFeedbackLikes")
      .withIndex("by_device_feedbackId", (q) => q.eq("deviceId", args.deviceId))
      .collect();
    return likes.map((l) => l.feedbackId);
  },
});

export const getMyGeneralLikes = query({
  args: {
    deviceId: v.string(),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("generalFeedbackLikes")
      .withIndex("by_device_feedbackId", (q) => q.eq("deviceId", args.deviceId))
      .collect();
    return likes.map((l) => l.feedbackId);
  },
});
