"use client";

import { useState } from "react";
import { X, ThumbsUp } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type GeneralFeedbackItem = {
  _id: string;
  name: string;
  comment: string;
  createdAt: number;
};

type GeneralFeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  feedbackItems: GeneralFeedbackItem[];
  lastViewedAt: number;
  deviceId: string;
};

export default function GeneralFeedbackModal({
  isOpen,
  onClose,
  feedbackItems,
  lastViewedAt,
  deviceId,
}: GeneralFeedbackModalProps) {
  const toggleGeneralFeedbackLike = useMutation(api.tables.feedbackLikes.toggleGeneralFeedbackLike);
  const myGeneralLikesQuery = useQuery(
    api.tables.feedbackLikes.getMyGeneralLikes,
    isOpen ? { deviceId } : "skip",
  );
  const likedGeneralIds = new Set<string>(myGeneralLikesQuery ?? []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg flex-col rounded-xl bg-card shadow-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-foreground">General Feedback</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {feedbackItems.length} submission{feedbackItems.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          {feedbackItems.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
              No feedback submitted yet.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {feedbackItems.map((item) => {
                const isLiked = likedGeneralIds.has(item._id as string);
                return (
                  <li key={item._id} className="px-6 py-4">
                    <div className="flex items-baseline justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{item.name}</span>
                        {item.createdAt > lastViewedAt && (
                          <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">New</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(item.createdAt).toLocaleString("en-AU", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">{item.comment}</p>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() =>
                          toggleGeneralFeedbackLike({
                            feedbackId: item._id as Id<"generalFeedback">,
                            deviceId,
                          })
                        }
                        className="p-1.5 rounded-full transition-colors hover:bg-gray-100"
                        aria-label={isLiked ? "Unlike" : "Like"}
                      >
                        <ThumbsUp
                          className={`w-4 h-4 transition-colors ${
                            isLiked ? "fill-primary text-primary" : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
