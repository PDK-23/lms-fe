import { SPECIALIZATIONS as SEED } from "@/mocks/specializations";
import type { Specialization } from "@/types";

const STORAGE_KEY = "mock_specializations_v1";

function load(): Specialization[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Specialization[];
  } catch (e) {
    console.warn("Failed to read specializations from localStorage", e);
  }
  return JSON.parse(JSON.stringify(SEED)) as Specialization[];
}

function save(items: Specialization[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Failed to write specializations to localStorage", e);
  }
}

let items = load();

export function getSpecializations(): Specialization[] {
  return items;
}

export function getSpecializationById(id: string): Specialization | undefined {
  return items.find((s) => s.id === id);
}

export function addSpecialization(s: Specialization) {
  items.push(JSON.parse(JSON.stringify(s)));
  save(items);
}

export function updateSpecialization(updated: Specialization) {
  const i = items.findIndex((s) => s.id === updated.id);
  if (i >= 0) {
    items[i] = JSON.parse(JSON.stringify(updated));
    save(items);
  }
}

export function deleteSpecialization(id: string) {
  items = items.filter((s) => s.id !== id);
  save(items);
}

export default {
  getSpecializations,
  getSpecializationById,
  addSpecialization,
  updateSpecialization,
  deleteSpecialization,
};
