import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ALL_COURSES from "@/mocks/courses";

export function useSearch(initial = "") {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initial);
  const searchRef = useRef<HTMLInputElement | HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_COURSES.filter((c) => {
      return (
        c.title.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        (c.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }).slice(0, 6);
  }, [searchQuery]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = searchRef.current as any;
      if (el && !el.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef && (searchRef as any).current?.focus) {
      try {
        (searchRef as any).current.focus();
      } catch (e) {
        // ignore focus errors
      }
    }
  }, [searchOpen]);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const submitSearch = (q?: string) => {
    const value = (q ?? searchQuery).trim();
    if (!value) return;
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/courses?search=${encodeURIComponent(value)}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      closeSearch();
    }
  };

  return {
    searchOpen,
    openSearch,
    closeSearch,
    searchQuery,
    setSearchQuery,
    searchRef,
    filteredCourses,
    submitSearch,
    onSubmit,
    onKeyDown,
  };
}
