import { PRACTICES as SEED } from "@/mocks/practices";
import type { Practice } from "@/types";

const STORAGE_KEY = "mock_practices_v1";

function load(): Practice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Practice[];
  } catch (e) {
    console.warn("Failed to read practices from localStorage", e);
  }
  return JSON.parse(JSON.stringify(SEED)) as Practice[];
}

function save(items: Practice[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Failed to write practices to localStorage", e);
  }
}

let items = load();

export function getPractices(): Practice[] {
  return items;
}

export function getPracticeById(id: string): Practice | undefined {
  return items.find((p) => p.id === id);
}

export function getPracticeBySlug(slug: string): Practice | undefined {
  return items.find((p) => p.slug === slug);
}

export function addPractice(p: Practice) {
  items.push(JSON.parse(JSON.stringify(p)));
  save(items);
}

export function updatePractice(updated: Practice) {
  const i = items.findIndex((x) => x.id === updated.id);
  if (i >= 0) {
    items[i] = JSON.parse(JSON.stringify(updated));
    save(items);
  }
}

export function deletePractice(id: string) {
  items = items.filter((x) => x.id !== id);
  save(items);
}

export default {
  getPractices,
  getPracticeById,
  getPracticeBySlug,
  addPractice,
  updatePractice,
  deletePractice,
};
