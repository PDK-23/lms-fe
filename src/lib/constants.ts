import { CATEGORIES } from "@/mocks/categories";

export const LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const RATING_LEVELS = [
  { value: 5, label: "5 Stars" },
  { value: 4, label: "4 Stars & up" },
  { value: 3, label: "3 Stars & up" },
  { value: 2, label: "2 Stars & up" },
  { value: 1, label: "1 Star & up" },
];

export const PRICE_RANGES = [
  { min: 0, max: 500000, label: "Under 500k" },
  { min: 500000, max: 1000000, label: "500k - 1M" },
  { min: 1000000, max: 2000000, label: "1M - 2M" },
  { min: 2000000, max: Infinity, label: "Over 2M" },
];

import { MOCK_INSTRUCTORS } from "@/mocks/instructors";

export const NAVIGATION_ITEMS = [
  { label: "Browse", href: "/courses" },
  { label: "My Courses", href: "/my-courses" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const HERO_MESSAGES = [
  "Learn how AI is a busy teacher's best friend",
  "Master new skills at your own pace",
  "Join millions of learners worldwide",
  "Transform your career with expert-led courses",
];

export { CATEGORIES, MOCK_INSTRUCTORS };
