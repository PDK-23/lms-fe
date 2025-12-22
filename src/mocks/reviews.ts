import type { Review } from "@/types";

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    courseId: "1",
    studentName: "Nguyen A",
    rating: 5,
    comment: "Khóa học rất hay, giảng viên giải thích rõ ràng.",
    date: new Date("2024-11-01"),
    helpful: 12,
  },
  {
    id: "r2",
    courseId: "1",
    studentName: "Tran B",
    rating: 4,
    comment: "Nội dung thực tế, bài tập phù hợp.",
    date: new Date("2025-01-15"),
    helpful: 3,
  },
  {
    id: "r3",
    courseId: "2",
    studentName: "Le C",
    rating: 5,
    comment: "Giáo trình rất tốt cho người mới bắt đầu.",
    date: new Date("2024-12-20"),
    helpful: 5,
  },
];

export default MOCK_REVIEWS;
