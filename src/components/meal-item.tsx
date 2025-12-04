"use client";

import { Edit2, Trash2 } from "lucide-react";
import type { Meal } from "./manage-menu";

type MealItemProps = {
  meal: Meal;
  onEdit: () => void;
  onDelete: () => void;
};

export default function MealItem({ meal, onEdit, onDelete }: MealItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3.5 transition-colors hover:bg-muted/70">
      <div className="flex items-center gap-3">
        <span className="font-medium text-foreground">{meal.name}</span>

        <div className="flex gap-2">
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            {meal.mealCategory}
          </span>

          {meal.isVegetarian && (
            <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
              Vegetarian
            </span>
          )}

          {meal.isVegan && (
            <span className="rounded-full bg-info/10 px-2.5 py-0.5 text-xs font-medium text-info">
              Vegan
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          aria-label="Edit meal"
        >
          <Edit2 className="h-4 w-4" />
        </button>

        <button
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Delete meal"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
