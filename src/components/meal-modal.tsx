"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { X } from "lucide-react";
import type { Meal } from "./manage-menu";

type MealModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    mealCategory: "main" | "side" | "dessert";
    isVegetarian: boolean;
    isVegan: boolean;
    mealType: "breakfast" | "lunch" | "dinner";
  }) => Promise<void>;
  meal: Meal | null;
  defaultMealType: "breakfast" | "lunch" | "dinner";
};

export default function MealModal({
  isOpen,
  onClose,
  onSave,
  meal,
  defaultMealType,
}: MealModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"main" | "side" | "dessert">("main");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner">(
    defaultMealType,
  );
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);

  useEffect(() => {
    if (meal) {
      setName(meal.name);
      setCategory(meal.mealCategory);
      setMealType(meal.mealType);
      setIsVegetarian(meal.isVegetarian);
      setIsVegan(meal.isVegan);
    } else if (isOpen) {
      setName("");
      setCategory("main");
      setMealType(defaultMealType);
      setIsVegetarian(false);
      setIsVegan(false);
    }
  }, [meal, isOpen, defaultMealType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({
        name: name.trim(),
        mealCategory: category,
        mealType,
        isVegetarian,
        isVegan,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-xl font-semibold text-foreground">
            {meal ? "Edit Meal" : "Add New Meal"}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Meal Name */}
            <div>
              <label
                htmlFor="meal-name"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Item Name
              </label>
              <input
                id="meal-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border #f8f9f0 px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter meal name"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "main" | "side" | "dessert")
                }
                className="w-full rounded-lg border border-border #f8f9f0 px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="main">Main</option>
                <option value="side">Side</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={isVegetarian}
                  onChange={(e) => setIsVegetarian(e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
                <span className="text-sm font-medium text-foreground">
                  Vegetarian
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={isVegan}
                  onChange={(e) => setIsVegan(e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                />
                <span className="text-sm font-medium text-foreground">
                  Vegan
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border #f8f9f0 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {meal ? "Save Changes" : "Add Meal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
