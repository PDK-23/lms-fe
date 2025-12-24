import type { Course } from "@/types";
import { ALL_COURSES } from "./courses";

export interface Purchase {
  id: string;
  courseId: string;
  course: Course;
  purchaseDate: Date;
  amount: number;
  status: "completed" | "pending" | "refunded";
  paymentMethod: string;
}

export const MOCK_PURCHASES: Purchase[] = [
  {
    id: "purch-1",
    courseId: "1",
    course: ALL_COURSES[0],
    purchaseDate: new Date("2025-06-10"),
    amount: 499000,
    status: "completed",
    paymentMethod: "Credit Card",
  },
  {
    id: "purch-2",
    courseId: "2",
    course: ALL_COURSES[1],
    purchaseDate: new Date("2025-08-15"),
    amount: 599000,
    status: "completed",
    paymentMethod: "PayPal",
  },
  {
    id: "purch-3",
    courseId: "3",
    course: ALL_COURSES[2],
    purchaseDate: new Date("2025-12-01"),
    amount: 549000,
    status: "pending",
    paymentMethod: "Bank Transfer",
  },
];

export default MOCK_PURCHASES;
