"use client";

import { X } from "lucide-react";

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
};

export default function GeneralFeedbackModal({
  isOpen,
  onClose,
  feedbackItems,
  lastViewedAt,
}: GeneralFeedbackModalProps) {
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
              {feedbackItems.map((item) => (
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
