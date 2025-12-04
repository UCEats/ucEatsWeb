"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChefHat, LogOut } from "lucide-react";
import DayContent from "./day-content";
import MealModal from "./meal-modal";
import { api } from "../../convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import ContentLoader from "react-content-loader";
import type { Id } from "../../convex/_generated/dataModel";
import { Star } from "lucide-react";
import { Filter } from "lucide-react";

export type Meal = {
  _id?: Id<"menuItems">;
  name: string;
  mealCategory: "main" | "side" | "dessert";
  mealType: "breakfast" | "lunch" | "dinner";
  isVegetarian: boolean;
  isVegan: boolean;
  date: string; // ISO string
};

interface ManageMenuProps {
  onLogout?: () => void;
}

interface FeedbackItem {
  _id: Id<"feedback">;
  mealType: "breakfast" | "lunch" | "dinner";
  name?: string;
  rating: number;
  comment?: string;
}

type mealType = "breakfast" | "lunch" | "dinner" | "All";

export default function ManageMenu({ onLogout }: ManageMenuProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>(""); // YYYY-MM-DD
  const [selectedDateID, setSelectedDateID] = useState<Id<"dates"> | null>(
    null
  );
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner"
  >("breakfast");
  const [localMeals, setLocalMeals] = useState<Meal[]>([]);
  //const [mealsForDay, setMealsForDay] = useState<any[]>([]);
  const [selectedFeedbackFilter, setSelectedFeedbackFilter] =
    useState<mealType>("All");

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const LoadingSkeleton = () => (
    <ContentLoader height={100} width={400} speed={2}>
      <rect x="0" y="0" rx="8" ry="8" width="400" height="20" />
      <rect x="0" y="30" rx="8" ry="8" width="400" height="20" />
      <rect x="0" y="60" rx="8" ry="8" width="400" height="20" />
    </ContentLoader>
  );

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = day === 0 ? -6 : 1 - day; // shift Sunday to last
    start.setDate(start.getDate() + diff);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates(currentWeek);

  const currentDay = daysOfWeek[selectedDayIndex];
  const currentDate = weekDates[selectedDayIndex];

  const getOrCreateDate = useMutation(api.tables.dates.getOrCreateDate);
  const createMealMutation = useMutation(api.tables.meals.createMeal);
  const updateMealMutation = useMutation(api.tables.meals.updateMeal);
  const deleteMealMutation = useMutation(api.tables.meals.deleteMeal);

  const queryArgs = useMemo(
    () => (selectedDateID ? { dateId: selectedDateID as Id<"dates"> } : "skip"),
    [selectedDateID]
  );

  // Convex query for meals
  const mealsQuery =
    useQuery(api.tables.meals.getMealsForDate, queryArgs) ?? null;

  const isQueryLoaded = !!mealsQuery;

  const isLoadingForDate = selectedDateID && !mealsQuery;

  // Initialize selected date on mount
  useEffect(() => {
    const init = async () => {
      const today = new Date();
      setCurrentWeek(today);
      const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
      setSelectedDayIndex(todayIndex);
      const todayISO = toLocalDateString(today);
      await handleDateSelect(todayISO);
    };
    init();
  }, []);

  useEffect(() => {
    // Compute selectedDate from current week + selected day
    const newSelectedDate = toLocalDateString(weekDates[selectedDayIndex]);
    setSelectedDate(newSelectedDate);
  }, [currentWeek, selectedDayIndex]);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchDateId = async () => {
      const dateRecord = await getOrCreateDate({ date: selectedDate });
      setSelectedDateID(dateRecord as Id<"dates">);
    };

    fetchDateId();
  }, [selectedDate, getOrCreateDate]);

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    const dateRecord = await getOrCreateDate({ date });
    setSelectedDateID(dateRecord as Id<"dates">);
  };

  const handleCreateOrEditMeal = async (mealData: {
    name: string;
    mealCategory: "main" | "side" | "dessert";
    isVegetarian: boolean;
    isVegan: boolean;
    mealType: "breakfast" | "lunch" | "dinner";
  }) => {
    if (!selectedDateID) {
      console.error("No selectedDateID — cannot save meal");
      return;
    }

    try {
      if (editingMeal && editingMeal._id) {
        await updateMealMutation({
          adminToken: localStorage.getItem("adminToken") || "",
          mealId: editingMeal._id as Id<"menuItems">,
          ...mealData,
          updatedAt: Date.now(),
        });
        setLocalMeals((prev) =>
          prev.map((m) =>
            m._id === editingMeal._id ? { ...m, ...mealData } : m
          )
        );
      } else {
        const newMealId = await createMealMutation({
          adminToken: localStorage.getItem("adminToken") || "",
          dateId: selectedDateID,
          ...mealData,
        });
        setLocalMeals((prev) => [
          ...prev,
          {
            _id: newMealId,
            date: selectedDate,
            ...mealData,
          },
        ]);
      }
      setEditingMeal(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving meal:", err);
    }
  };

  const toLocalDateString = (date: Date) => {
    // Pads month/day with leading zeros
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      await deleteMealMutation({
        adminToken: localStorage.getItem("adminToken") || "",
        mealId: mealId as Id<"menuItems">,
      });
      setLocalMeals((prev) => prev.filter((m) => m._id !== mealId));
    } catch (err) {
      console.error("Error deleting meal:", err);
    }
  };

  const handleAddMeal = (mealType: "breakfast" | "lunch" | "dinner") => {
    setSelectedMealType(mealType);
    setEditingMeal(null);
    setIsModalOpen(true);
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setSelectedMealType(meal.mealType);
    setIsModalOpen(true);
  };

  const mealsForCurrentDay = (
    localMeals.length > 0 ? localMeals : mealsQuery || []
  )
    .map((meal: any) => {
      const mealDate = new Date(meal.date || selectedDate);
      return {
        ...meal,
        day: mealDate.toLocaleDateString("en-US", { weekday: "long" }),
      };
    })
    .filter((meal) => meal.day === currentDay);

  const allMeals =
    localMeals.length > 0
      ? localMeals
      : isLoadingForDate
        ? null
        : mealsQuery || [];

  const mealsByDay = useMemo(() => {
    if (!allMeals) return {}; // or return null to show loader in UI
    const dayMap = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return allMeals.reduce((acc: any, meal: any) => {
      const mealDate = new Date(meal.date || selectedDate);
      const dayName =
        dayMap[mealDate.getDay() === 0 ? 6 : mealDate.getDay() - 1];
      if (!acc[dayName]) acc[dayName] = [];
      acc[dayName].push(meal);
      return acc;
    }, {});
  }, [allMeals, selectedDate]);

  const getMealsForDay = (day: string) => {
    return mealsByDay[day] || [];
  };

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    // Adjust so Monday = start of week
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const allFeedbackQuery = useQuery(
    api.tables.feedback.getAllFeedbackForDate,
    selectedDateID ? { dateId: selectedDateID } : "skip"
  );

  const mealFeedbackQuery = useQuery(
    api.tables.feedback.getFeedbackForDateAndMealType,
    selectedDateID && selectedFeedbackFilter !== "All"
      ? { dateId: selectedDateID, mealType: selectedFeedbackFilter }
      : "skip"
  );

  const getFeedback =
    selectedFeedbackFilter === "All" ? allFeedbackQuery : mealFeedbackQuery;

  const filteredFeedback = useMemo(() => {
    if (!getFeedback) return [];
    if (selectedFeedbackFilter === "All") return getFeedback;
    return getFeedback?.filter(
      (item: FeedbackItem) => item.mealType === selectedFeedbackFilter
    );
  }, [getFeedback, selectedFeedbackFilter]);

  const averageRating = useMemo(() => {
    if (!filteredFeedback || filteredFeedback.length === 0) return 0;
    const sum = filteredFeedback.reduce(
      (acc: number, item: FeedbackItem) => acc + item.rating,
      0
    );
    return (sum / filteredFeedback.length).toFixed(1);
  }, [filteredFeedback]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const isLoadingForFeedback = !selectedDateID && !getFeedback;

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 lg:p-12">
      <div className="mx-auto max-w-6xl">
        {/* Title & Week Navigation */}
        <div className="mb-8 space-y-6">
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ChefHat className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-foreground">
                    UC Eats
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Plan your weekly meals with ease
                  </p>
                </div>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:border-red-300 hover:shadow-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              )}
            </div>
            <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-primary/30"></div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePreviousWeek}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary/30 hover:shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="rounded-full border border-border bg-card px-6 py-2.5 shadow-sm text-center">
              <span className="text-base font-medium text-foreground">
                {getWeekRange(currentWeek)}
              </span>
            </div>
            <button
              onClick={handleNextWeek}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground hover:border-primary/30 hover:shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Day selector */}
        <div className="mb-6">
          <div className="flex justify-start mb-2">
            <button
              onClick={async () => {
                const today = new Date();
                setCurrentWeek(today);
                const index = today.getDay() === 0 ? 6 : today.getDay() - 1;
                setSelectedDayIndex(index);
                const dateISO = toLocalDateString(today);
                await handleDateSelect(dateISO);
              }}
              className="flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-md hover:scale-105 hover:shadow-lg hover:from-primary/90 hover:to-primary transition-all duration-200"
            >
              Go to Today
            </button>
          </div>

          <div className="flex gap-1 border border-border bg-card p-1 rounded-xl shadow-sm">
            {daysOfWeek.map((day, index) => {
              const isToday =
                weekDates[index].toDateString() === new Date().toDateString();
              const isSelected = selectedDayIndex === index;
              const mealCount = isQueryLoaded ? getMealsForDay(day).length : 0;

              return (
                <button
                  key={day}
                  onClick={async () => {
                    setSelectedDayIndex(index);
                    const dateISO = toLocalDateString(weekDates[index]);
                    await handleDateSelect(dateISO);
                  }}
                  className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={
                        isToday && !isSelected
                          ? "text-primary font-semibold"
                          : ""
                      }
                    >
                      {day.slice(0, 3)}
                    </span>
                    <span className="text-xs opacity-70">
                      {weekDates[index].toLocaleDateString("en-SG", {
                        month: "numeric",
                        day: "numeric",
                      })}
                    </span>
                    {isQueryLoaded && mealCount > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          isSelected
                            ? "bg-primary-foreground/20"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {mealCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {isLoadingForDate ? (
          // Only replace the DayContent section
          <div className="mt-4">
            <LoadingSkeleton />
          </div>
        ) : (
          <DayContent
            day={currentDay}
            date={currentDate}
            meals={mealsForCurrentDay}
            onAddMeal={handleAddMeal}
            onEditMeal={handleEditMeal}
            onDeleteMeal={handleDeleteMeal}
          />
        )}
      </div>

      <MealModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMeal(null);
        }}
        onSave={handleCreateOrEditMeal}
        meal={editingMeal}
        defaultMealType={selectedMealType}
      />
      <section className="bg-background-50 border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Header with title and filter */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-foreground">
              Feedback for {selectedDate}
            </h3>

            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={selectedFeedbackFilter}
                onChange={(e) =>
                  setSelectedFeedbackFilter(e.target.value as mealType)
                }
                className="px-4 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="All">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>

          {/* Average Rating */}
          {isLoadingForFeedback ? (
            // Loading Skeleton
            <div className="space-y-6">
              {/* Skeleton for average rating */}
              <div className="bg-gray-200 rounded-xl h-32 w-full animate-pulse"></div>

              {/* Skeleton for feedback cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 rounded-xl h-48 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border mb-8">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-primary">
                    {averageRating}
                  </div>
                  <div className="flex flex-col gap-1">
                    {renderStars(Math.round(Number(averageRating)))}
                    <p className="text-sm text-muted-foreground">
                      Based on {filteredFeedback.length}{" "}
                      {filteredFeedback.length === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feedback Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFeedback.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {item.name || "Anonymous"}
                        </h4>
                        <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {item.mealType.charAt(0).toUpperCase() +
                            item.mealType.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="mb-3">{renderStars(item.rating)}</div>

                    {/* Feedback Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.comment}
                    </p>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredFeedback.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No feedback available for this filter.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
