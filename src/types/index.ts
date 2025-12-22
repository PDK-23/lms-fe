export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  courseCount: number;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  rating: number;
  totalRatings: number;
  students: number;
  isVerified?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: Category;
  instructor: Instructor;
  price: number;
  originalPrice?: number;
  rating: number;
  totalRatings: number;
  students: number;
  thumbnail: string;
  duration: number; // in hours
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  isBestseller?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  duration: number; // in minutes
  videoUrl?: string;
  materials?: string[];
  isCompleted?: boolean;
  quizAvailable?: boolean; // whether this lesson has a quiz
  practiceId?: string; // optional practice slug/id
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  questions: QuizQuestion[];
  passingScore: number;
  duration: number; // in minutes
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: string | number;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  studentName: string;
  issueDate: Date;
  certificateNumber: string;
  instructorName: string;
}

export interface Review {
  id: string;
  courseId: string;
  studentName: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  enrolledCourses: string[];
  completedCourses: string[];
  certificates: Certificate[];
  createdAt: Date;
}

export interface CartItem {
  courseId: string;
  course: Course;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
