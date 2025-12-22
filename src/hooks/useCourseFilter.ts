import { useState, useCallback } from 'react';
import { Course } from '@/types';

interface UseCourseFilterOptions {
  initialCategory?: string[];
  initialLevel?: string[];
  initialRating?: number;
}

export function useCourseFilter(courses: Course[], options?: UseCourseFilterOptions) {
  const [filters, setFilters] = useState({
    category: options?.initialCategory || [],
    level: options?.initialLevel || [],
    rating: options?.initialRating || 0,
    searchQuery: '',
  });

  const filteredCourses = useCallback(() => {
    return courses.filter((course) => {
      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(course.category.id)) {
        return false;
      }

      // Level filter
      if (filters.level.length > 0 && !filters.level.includes(course.level)) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && course.rating < filters.rating) {
        return false;
      }

      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [courses, filters]);

  const updateCategoryFilter = useCallback((categories: string[]) => {
    setFilters((prev) => ({ ...prev, category: categories }));
  }, []);

  const updateLevelFilter = useCallback((levels: string[]) => {
    setFilters((prev) => ({ ...prev, level: levels }));
  }, []);

  const updateRatingFilter = useCallback((rating: number) => {
    setFilters((prev) => ({ ...prev, rating }));
  }, []);

  const updateSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      category: [],
      level: [],
      rating: 0,
      searchQuery: '',
    });
  }, []);

  return {
    filters,
    filteredCourses: filteredCourses(),
    updateCategoryFilter,
    updateLevelFilter,
    updateRatingFilter,
    updateSearchQuery,
    resetFilters,
  };
}
