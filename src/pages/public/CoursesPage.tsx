import { Button } from "@/components/ui";
import { CourseCard, SearchBar } from "@/components/course";
import { CATEGORIES, LEVELS, RATING_LEVELS } from "@/lib/constants";
import courseService from "@/services/courseService";
import { type Course } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";

// Courses are provided by the API

interface Filters {
  category: string[];
  level: string[];
  rating: number;
  priceRange: [number, number];
}

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [_searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    category: [],
    level: [],
    rating: 0,
    priceRange: [0, 2000000],
  });
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Read category from query params and apply as initial filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: [categoryParam] }));
    }
  }, [location.search]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(categoryId)
        ? prev.category.filter((id) => id !== categoryId)
        : [...prev.category, categoryId],
    }));
  };

  const handleLevelToggle = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      level: prev.level.includes(level)
        ? prev.level.filter((l) => l !== level)
        : [...prev.level, level],
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: [],
      level: [],
      rating: 0,
      priceRange: [0, 2000000],
    });
  };

  const activeFiltersCount =
    filters.category.length +
    filters.level.length +
    (filters.rating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-white border-b border-neutral-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold mb-4">Browse Courses</h1>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block lg:col-span-1`}
          >
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-32">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b border-neutral-200">
                <h3 className="font-semibold mb-3 flex items-center justify-between cursor-pointer">
                  Category
                  <ChevronDown className="w-4 h-4" />
                </h3>
                <div className="space-y-2">
                  {CATEGORIES.slice(0, 6).map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.category.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="w-4 h-4 accent-primary-600"
                      />
                      <span className="text-sm text-neutral-700">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-6 pb-6 border-b border-neutral-200">
                <h3 className="font-semibold mb-3 flex items-center justify-between cursor-pointer">
                  Level
                  <ChevronDown className="w-4 h-4" />
                </h3>
                <div className="space-y-2">
                  {LEVELS.map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.level.includes(level)}
                        onChange={() => handleLevelToggle(level)}
                        className="w-4 h-4 accent-primary-600"
                      />
                      <span className="text-sm text-neutral-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center justify-between cursor-pointer">
                  Rating
                  <ChevronDown className="w-4 h-4" />
                </h3>
                <div className="space-y-2">
                  {RATING_LEVELS.map((rating) => (
                    <label
                      key={rating.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating.value}
                        onChange={() =>
                          setFilters((prev) => ({
                            ...prev,
                            rating: rating.value,
                          }))
                        }
                        className="w-4 h-4 accent-primary-600"
                      />
                      <span className="text-sm text-neutral-700">
                        {rating.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <span className="text-sm font-semibold">
                {activeFiltersCount > 0
                  ? `${activeFiltersCount} filters applied`
                  : "No filters applied"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={(courseId) => console.log("Enrolled:", courseId)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
