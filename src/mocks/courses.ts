import { type Course, type Section } from "@/types";
import { CATEGORIES } from "./categories";
import { MOCK_INSTRUCTORS } from "./instructors";

// Default sections for all courses
export const DEFAULT_COURSE_SECTIONS: Section[] = [
  {
    id: "s1",
    title: "Getting Started",
    lessons: [
      {
        id: "l1",
        title: "Introduction to the Course",
        duration: 5,
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        isCompleted: false,
      },
      {
        id: "l2",
        title: "Course Overview",
        duration: 10,
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        isCompleted: true,
        quizAvailable: true,
      },
      {
        id: "l3",
        title: "Tools and Setup",
        duration: 15,
        videoUrl: undefined,
        isCompleted: false,
      },
    ],
  },
  {
    id: "s2",
    title: "Core Concepts",
    lessons: [
      {
        id: "l4",
        title: "Fundamental Principles",
        duration: 20,
        videoUrl:
          "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        isCompleted: false,
        practiceId: "two-sum",
      },
      {
        id: "l5",
        title: "Deep Dive into Topic A",
        duration: 25,
        videoUrl: undefined,
        isCompleted: false,
      },
      {
        id: "l6",
        title: "Practical Examples",
        duration: 18,
        videoUrl: undefined,
        isCompleted: false,
      },
    ],
  },
  {
    id: "s3",
    title: "Advanced Topics",
    lessons: [
      {
        id: "l7",
        title: "Building Real Projects",
        duration: 30,
        videoUrl: undefined,
        isCompleted: false,
        quizAvailable: true,
      },
      {
        id: "l8",
        title: "Best Practices",
        duration: 22,
        videoUrl: undefined,
        isCompleted: false,
      },
      {
        id: "l9",
        title: "Optimization Techniques",
        duration: 28,
        videoUrl: undefined,
        isCompleted: false,
      },
    ],
  },
  {
    id: "s4",
    title: "Projects & Assessment",
    lessons: [
      {
        id: "l10",
        title: "Capstone Project",
        duration: 45,
        videoUrl: undefined,
        isCompleted: false,
      },
      {
        id: "l11",
        title: "Final Quiz",
        duration: 15,
        videoUrl: undefined,
        isCompleted: false,
      },
    ],
  },
];

// Helper function to get sections for a course
export const getCourseSections = (courseId: string): Section[] => {
  const course = ALL_COURSES.find((c) => c.id === courseId);
  return course?.sections || DEFAULT_COURSE_SECTIONS;
};

export const ALL_COURSES: Course[] = [
  {
    id: "1",
    title: "The Complete JavaScript Course",
    description: "Master JavaScript from basics to advanced",
    category: CATEGORIES[1],
    instructor: MOCK_INSTRUCTORS[0],
    price: 499000,
    originalPrice: 799000,
    rating: 4.8,
    totalRatings: 2500,
    students: 50000,
    thumbnail:
      "https://images.pexels.com/photos/34638798/pexels-photo-34638798.jpeg",
    duration: 40,
    level: "Beginner",
    tags: ["web", "programming", "javascript"],
    isBestseller: true,
    // Use default sections
    sections: DEFAULT_COURSE_SECTIONS,
  },
  {
    id: "2",
    title: "Python for Data Science",
    description: "Learn Python and data science tools",
    category: CATEGORIES[2],
    instructor: MOCK_INSTRUCTORS[2],
    price: 599000,
    rating: 4.9,
    totalRatings: 3200,
    students: 60000,
    thumbnail: "https://placehold.co/600x400?text=Python",
    duration: 45,
    level: "Intermediate",
    tags: ["python", "data-science"],
    isTrending: true,
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass",
    description: "Create stunning user interfaces",
    category: CATEGORIES[3],
    instructor: MOCK_INSTRUCTORS[3],
    price: 549000,
    rating: 4.7,
    totalRatings: 1800,
    students: 35000,
    thumbnail: "https://placehold.co/600x400?text=Design",
    duration: 35,
    level: "Beginner",
    tags: ["design", "ux", "ui"],
    isBestseller: false,
    isTrending: true,
  },
  {
    id: "4",
    title: "Business Analytics",
    description: "Data-driven decision making",
    category: CATEGORIES[0],
    instructor: MOCK_INSTRUCTORS[1],
    price: 699000,
    rating: 4.6,
    totalRatings: 1500,
    students: 28000,
    thumbnail: "https://placehold.co/600x400?text=Business%20Analytics",
    duration: 32,
    level: "Intermediate",
    tags: ["business", "analytics", "data"],
    isBestseller: false,
    isTrending: false,
  },
];

export default ALL_COURSES;
