export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  courseCount: number;
  // Optional parent category id to support category hierarchies
  parentId?: string;
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
  // Keep the full category object for backward compatibility in UI,
  // but store the canonical relation as categoryId so edits can be persisted
  category: Category;
  categoryId?: string;
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
  // A course can belong to one specialization (later feature)
  specializationId?: string;
  isBestseller?: boolean;
  isTrending?: boolean;
  isNew?: boolean;

  // Optional course sections with lessons
  sections?: Section[];
}

export type LessonType = "video" | "quiz" | "practice";

export interface Lesson {
  id: string;
  title: string;
  duration: number; // in minutes
  type?: LessonType; // defaults to 'video'

  // Video lesson fields
  videoUrl?: string;
  materials?: string[];

  // Quiz fields
  quizAvailable?: boolean; // whether this lesson has a quiz
  quizId?: string; // optional id of a quiz

  // Practice fields
  practiceId?: string; // optional practice slug/id
  practiceLanguage?: string; // optional default language for practice

  isCompleted?: boolean;
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
  // correctAnswer may be a single value or an array (for multiple correct options)
  correctAnswer: string | number | Array<string | number>;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Specialization {
  id: string;
  name: string;
  description?: string;
  // a specialization can include many course ids
  courseIds?: string[];
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
  phone?: string;
  role?: "student" | "instructor" | "admin";
  isActive?: boolean;
  lastLogin?: Date | string;
  location?: string;
  provider?: string;
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
