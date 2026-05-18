import { v } from "convex/values";
import { internalAction } from "../_generated/server";

export const sendPushNotification = internalAction({
    args: {
        pushToken: v.string(),
    },
    handler: async (_ctx, args) => {
        try {
            await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: args.pushToken,
                    title: "Feedback Acknowledged",
                    body: "Your feedback has been acknowledged!",
                }),
            });
        } catch {
            // Best-effort — silently ignore delivery failures
        }
    },
});
