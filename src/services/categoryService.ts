import { CATEGORIES as SEED } from "@/mocks/categories";
import type { Category } from "@/types";

const STORAGE_KEY = "mock_categories_v1";

function load(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Category[];
  } catch (e) {
    console.warn("Failed to read categories from localStorage", e);
  }
  // deep clone
  return JSON.parse(JSON.stringify(SEED)) as Category[];
}

function save(categories: Category[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.warn("Failed to write categories to localStorage", e);
  }
}

let categories = load();

export function getCategories(): Category[] {
  return categories;
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function addCategory(cat: Category) {
  categories.push(JSON.parse(JSON.stringify(cat)));
  save(categories);
}

export function updateCategory(updated: Category) {
  const i = categories.findIndex((c) => c.id === updated.id);
  if (i >= 0) {
    categories[i] = JSON.parse(JSON.stringify(updated));
    save(categories);
  }
}

export function deleteCategory(id: string) {
  categories = categories.filter((c) => c.id !== id);
  save(categories);
}

export default {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
