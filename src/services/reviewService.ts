import MOCK_REVIEWS from "@/mocks/reviews";
import type { Review } from "@/types";

const STORAGE_KEY = "mock_reviews_v1";

function loadAll(): Review[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Review[];
      return parsed.map((r) => ({ ...r, date: new Date(r.date) }));
    } catch (e) {
      console.error("Failed to parse reviews from storage", e);
      // fall through to seed
    }
  }

  // seed from mocks
  const seed = MOCK_REVIEWS.map((r) => ({ ...r }));
  saveAll(seed);
  return seed.map((r) => ({ ...r, date: new Date(r.date) }));
}

function saveAll(items: Review[]) {
  const serial = items.map((r) => ({
    ...r,
    date: r.date instanceof Date ? r.date.toISOString() : r.date,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serial));
}

function getByCourseId(courseId: string): Review[] {
  return loadAll()
    .filter((r) => r.courseId === courseId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

function addReview(payload: {
  courseId: string;
  studentName: string;
  rating: number;
  comment: string;
}): Review {
  const all = loadAll();
  const id = `r${Date.now()}`;
  const review: Review = {
    id,
    courseId: payload.courseId,
    studentName: payload.studentName,
    rating: payload.rating,
    comment: payload.comment,
    date: new Date(),
    helpful: 0,
  };
  all.push(review);
  saveAll(all);
  return review;
}

export default {
  getByCourseId,
  addReview,
  _loadAll: loadAll,
  _saveAll: saveAll,
};
