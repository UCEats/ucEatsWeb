import { useEffect } from "react";
import type { Meal } from "./manage-menu";

interface PresentationViewProps {
  section: "breakfast" | "lunch" | "dinner";
  date: string;
  sectionMeals: Meal[];
  sectionImage?: string | null;
  onBack: () => void;
}

export default function PresentationView({
  section,
  date,
  sectionMeals,
  sectionImage,
  onBack,
}: PresentationViewProps) {
  const groupMeals = (category: "main" | "side" | "dessert") => {
    const filtered = sectionMeals.filter(
      (meal) => meal.mealCategory === category
    );
    return filtered.length ? filtered : [{ name: `No ${category}` } as Meal];
  };

  // Optional: Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-pink-50 text-center font-sans relative">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white shadow-md hover:bg-gray-100 font-semibold"
      >
        ← Back
      </button>

      {/* Date & Section */}
      <div className="mb-6">
        <h1
          className="text-5xl font-extrabold text-primary mb-2"
          style={{ fontFamily: "'Fredoka One', cursive" }}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </h1>
        <p className="text-xl text-muted-foreground">{date}</p>
      </div>

      {/* Section Image */}
      {sectionImage && (
        <div className="mb-6 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <img
            src={sectionImage}
            alt={`${section} image`}
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />
        </div>
      )}

      {/* Meals */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-20">
        {(["main", "side", "dessert"] as const).map((category) => (
          <div key={category} className="flex flex-col items-center">
            <h2
              className="text-3xl font-bold text-secondary mb-2"
              style={{ fontFamily: "'Fredoka One', cursive" }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            <ul className="space-y-1 text-lg font-medium">
              {groupMeals(category).map((meal: Meal) => (
                <li key={meal._id || meal.name}>{meal.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
