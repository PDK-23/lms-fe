import type { CartItem, Course } from "@/types";

const STORAGE_KEY = "mock_cart_v1";
let items: CartItem[] = load();

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartItem[];
  } catch (e) {
    console.warn("Failed to read cart from localStorage", e);
  }
  return [];
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn("Failed to write cart to localStorage", e);
  }
  notify();
}

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((cb) => cb());
}

export function getCart(): CartItem[] {
  return items;
}

export function getCount(): number {
  return items.reduce((s, i) => s + (i.quantity || 0), 0);
}

export function addToCart(course: Course, quantity = 1) {
  const existing = items.find((i) => i.courseId === course.id);
  if (existing) {
    existing.quantity = (existing.quantity || 0) + quantity;
  } else {
    items.push({ courseId: course.id, course, quantity });
  }
  save();
}

export function removeFromCart(courseId: string) {
  items = items.filter((i) => i.courseId !== courseId);
  save();
}

export function updateQuantity(courseId: string, quantity: number) {
  const it = items.find((i) => i.courseId === courseId);
  if (!it) return;
  it.quantity = Math.max(0, quantity);
  if (it.quantity === 0) items = items.filter((i) => i.courseId !== courseId);
  save();
}

export function clearCart() {
  items = [];
  save();
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export default {
  getCart,
  getCount,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  subscribe,
};
