import type { Quiz } from "@/types";

export const QUIZZES: Quiz[] = [
  {
    id: "q1",
    title: "Intro to JavaScript Quiz",
    courseId: "1",
    questions: [
      {
        id: "q1-1",
        text: "What is the correct way to declare a variable in JavaScript?",
        type: "multiple-choice",
        options: ["var x", "let x", "x = 1"],
        correctAnswer: "let x",
      },
    ],
    passingScore: 70,
    duration: 15,
  },
  {
    id: "q2",
    title: "Data Science Basics",
    courseId: "3",
    questions: [],
    passingScore: 60,
    duration: 20,
  },
];

export default QUIZZES;
