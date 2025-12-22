import { QUIZZES as SEED } from "@/mocks/quizzes";
import type { Quiz } from "@/types";

const STORAGE_KEY = "mock_quizzes_v1";

function load(): Quiz[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Quiz[];
  } catch (e) {
    console.warn("Failed to read quizzes from localStorage", e);
  }
  return JSON.parse(JSON.stringify(SEED)) as Quiz[];
}

function save(items: Quiz[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Failed to write quizzes to localStorage", e);
  }
}

let items = load();

export function getQuizzes(): Quiz[] {
  return items;
}

export function getQuizById(id: string): Quiz | undefined {
  return items.find((q) => q.id === id);
}

export function addQuiz(q: Quiz) {
  items.push(JSON.parse(JSON.stringify(q)));
  save(items);
}

export function updateQuiz(updated: Quiz) {
  const i = items.findIndex((x) => x.id === updated.id);
  if (i >= 0) {
    items[i] = JSON.parse(JSON.stringify(updated));
    save(items);
  }
}

export function deleteQuiz(id: string) {
  items = items.filter((x) => x.id !== id);
  save(items);
}

export default {
  getQuizzes,
  getQuizById,
  addQuiz,
  updateQuiz,
  deleteQuiz,
};
