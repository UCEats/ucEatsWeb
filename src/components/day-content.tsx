"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import MealItem from "./meal-item";
import type { Meal } from "./manage-menu";

type DayContentProps = {
  day: string;
  date: Date;
  meals: Meal[];
  onAddMeal: (mealType: "breakfast" | "lunch" | "dinner") => void;
  onEditMeal: (meal: any) => void;
  onDeleteMeal: (meal: any) => void;
};

export default function DayContent({
  day,
  date,
  meals,
  onAddMeal,
  onEditMeal,
  onDeleteMeal,
}: DayContentProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "Breakfast"
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMealsByType = (type: "breakfast" | "lunch" | "dinner") => {
    return meals.filter((meal) => meal.mealType === type);
  };

  const breakfastMeals = getMealsByType("breakfast");
  const lunchMeals = getMealsByType("lunch");
  const dinnerMeals = getMealsByType("dinner");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderMealSection = (
    title: "breakfast" | "lunch" | "dinner",
    meals: Meal[],
    sectionKey: string
  ) => {
    const isExpanded = expandedSection === sectionKey;
    const newTitle = title.charAt(0).toUpperCase() + title.slice(1);

    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted/30"
        >
          <div className="flex items-center gap-3">
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                isExpanded ? "rotate-0" : "-rotate-90"
              }`}
            />
            <h3 className="text-lg font-semibold text-foreground">
              {newTitle}
            </h3>
            <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              {meals.length}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddMeal(title);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Meal
          </button>
        </button>

        <div
          className={`transition-all duration-200 ease-in-out ${
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="border-t border-border px-6 py-4">
            {meals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">
                  No meals added yet
                </p>
                <button
                  onClick={() => onAddMeal(title)}
                  className="mt-3 text-sm font-medium text-primary hover:underline"
                >
                  Add your first {title.toLowerCase()} meal
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {meals.map((meal) => (
                  <MealItem
                    key={meal._id}
                    meal={meal}
                    onEdit={() => onEditMeal(meal)}
                    onDelete={() => onDeleteMeal(meal._id!)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <div>
      {/* Day Header */}
      <div className="mb-6 rounded-xl border border-border bg-card px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{day}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDate(date)}
            </p>
          </div>
          {isToday && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Today
            </span>
          )}
        </div>
      </div>

      {/* Meal Sections */}
      <div className="space-y-4">
        {renderMealSection("breakfast", breakfastMeals, "breakfast")}
        {renderMealSection("lunch", lunchMeals, "lunch")}
        {renderMealSection("dinner", dinnerMeals, "dinner")}
      </div>
    </div>
  );
}
