import type { Certificate } from "@/types";

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: "cert-1",
    courseId: "1",
    courseName: "The Complete JavaScript Course",
    studentName: "Alice Johnson",
    issueDate: new Date("2025-06-15"),
    certificateNumber: "JS-2025-0001",
    instructorName: "John Doe",
  },
  {
    id: "cert-2",
    courseId: "2",
    courseName: "Python for Data Science",
    studentName: "Bob Smith",
    issueDate: new Date("2025-08-20"),
    certificateNumber: "PY-2025-0002",
    instructorName: "Jane Roe",
  },
];

export default MOCK_CERTIFICATES;
