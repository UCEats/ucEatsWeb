import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getUnseenAcknowledgments = query({
    args: {
        pushToken: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("feedbackAcknowledgments")
            .withIndex("by_pushToken_seen", (q) =>
                q.eq("pushToken", args.pushToken).eq("seen", false)
            )
            .order("desc")
            .collect();
    },
});

export const markAcknowledgmentsSeen = mutation({
    args: {
        ids: v.array(v.id("feedbackAcknowledgments")),
    },
    handler: async (ctx, args) => {
        await Promise.all(
            args.ids.map((id) => ctx.db.patch(id, { seen: true }))
        );
    },
});
