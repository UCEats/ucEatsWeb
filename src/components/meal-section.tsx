"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import MealItem from "./meal-item";
import type { Meal } from "./manage-menu";

type DayCardProps = {
  day: string;
  date: Date;
  meals: Meal[];
  onAddMeal: (mealType: "breakfast" | "lunch" | "dinner") => void;
  onEditMeal: (meal: Meal) => void;
  onDeleteMeal: (id: string) => void;
};

export default function DayCard({
  day,
  date,
  meals,
  onAddMeal,
  onEditMeal,
  onDeleteMeal,
}: DayCardProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

    return (
      <div className="border-t border-border">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/30"
        >
          <div className="flex items-center gap-2">
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                isExpanded ? "rotate-0" : "-rotate-90"
              }`}
            />
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {meals.length}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddMeal(title);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </button>

        <div
          className={`transition-all duration-200 ease-in-out ${
            isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="px-4 pb-3">
            {meals.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">
                No meals added
              </p>
            ) : (
              <div className="space-y-2">
                {meals.map((meal) => (
                  <MealItem
                    key={meal._id?.toString()}
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

  // Check if today
  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Day Header */}
      <div
        className={`px-4 py-4 ${
          isToday
            ? "bg-primary/5 border-b-2 border-primary"
            : "border-b border-border"
        }`}
      >
        <h2
          className={`text-lg font-semibold ${
            isToday ? "text-primary" : "text-foreground"
          }`}
        >
          {day}
        </h2>
        <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
      </div>

      {/* Meal Sections */}
      <div>
        {renderMealSection("breakfast", breakfastMeals, `${day}-breakfast`)}
        {renderMealSection("lunch", lunchMeals, `${day}-lunch`)}
        {renderMealSection("dinner", dinnerMeals, `${day}-dinner`)}
      </div>
    </div>
  );
}
