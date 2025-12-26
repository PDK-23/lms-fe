import {
  get,
  post,
  put,
  del,
  type PageResponse,
  type ApiResponse,
} from "@/lib/api";
import type { Course, Section, Lesson, Category, Instructor } from "@/types";

// Backend DTOs
interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  courseCount?: number;
}

interface InstructorDTO {
  id: number;
  userId: number;
  bio?: string;
  specialization?: string;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  isVerified: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface LessonDTO {
  id: number;
  title: string;
  description?: string;
  videoUrl?: string;
  duration: number;
  sortOrder: number;
  type: string;
  isPreview: boolean;
  materials?: string;
}

interface SectionDTO {
  id: number;
  title: string;
  description?: string;
  sortOrder: number;
  lessons?: LessonDTO[];
}

interface CourseDTO {
  id: number;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  thumbnail?: string;
  price: number;
  originalPrice?: number;
  level: string;
  duration: number;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  isFeatured: boolean;
  isTrending: boolean;
  isNew: boolean;
  isBestseller: boolean;
  isPublished: boolean;
  category?: CategoryDTO;
  categoryId?: number;
  instructorId?: number;
  instructor?: InstructorDTO;
  sections?: SectionDTO[];
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

// Transform functions
function toCategory(dto: CategoryDTO): Category {
  return {
    id: String(dto.id),
    name: dto.name,
    icon: dto.icon || "📚",
    color: dto.color || "#3B82F6",
    courseCount: dto.courseCount || 0,
  };
}

function toInstructor(dto: InstructorDTO): Instructor {
  return {
    id: String(dto.id),
    name: dto.user?.name || "Unknown Instructor",
    avatar: dto.user?.avatar || "",
    bio: dto.bio || "",
    rating: dto.rating,
    totalRatings: dto.totalRatings,
    students: dto.totalStudents,
    isVerified: dto.isVerified,
  };
}

function toLesson(dto: LessonDTO): Lesson {
  return {
    id: String(dto.id),
    title: dto.title,
    duration: dto.duration,
    type: (dto.type?.toLowerCase() as "video" | "quiz" | "practice") || "video",
    videoUrl: dto.videoUrl,
    materials: dto.materials ? JSON.parse(dto.materials) : undefined,
    isCompleted: false,
  };
}

function toSection(dto: SectionDTO): Section {
  return {
    id: String(dto.id),
    title: dto.title,
    lessons: dto.lessons?.map(toLesson) || [],
  };
}

function toCourse(dto: CourseDTO): Course {
  const defaultCategory: Category = {
    id: "0",
    name: "Uncategorized",
    icon: "📚",
    color: "#6B7280",
    courseCount: 0,
  };

  const defaultInstructor: Instructor = {
    id: "0",
    name: "Unknown",
    avatar: "",
    bio: "",
    rating: 0,
    totalRatings: 0,
    students: 0,
  };

  return {
    id: String(dto.id),
    title: dto.title,
    description: dto.description || "",
    category: dto.category ? toCategory(dto.category) : defaultCategory,
    categoryId: dto.categoryId ? String(dto.categoryId) : undefined,
    instructor: dto.instructor
      ? toInstructor(dto.instructor)
      : defaultInstructor,
    price: dto.price,
    originalPrice: dto.originalPrice,
    rating: dto.rating,
    totalRatings: dto.totalRatings,
    students: dto.totalStudents,
    thumbnail: dto.thumbnail || "",
    duration: dto.duration,
    level:
      (dto.level as "Beginner" | "Intermediate" | "Advanced") || "Beginner",
    tags: dto.tags || [],
    isBestseller: dto.isBestseller,
    isTrending: dto.isTrending,
    isNew: dto.isNew,
    sections: dto.sections?.map(toSection),
  };
}

// API Functions
export async function getCourses(): Promise<Course[]> {
  const data = await get<PageResponse<CourseDTO[]>>("/courses");
  console.log("Fetched courses:", data);
  return data.content.map(toCourse) || [];
}

export async function getCoursesPaginated(
  page = 0,
  size = 10
): Promise<PageResponse<Course>> {
  const response = await get<PageResponse<CourseDTO>>("/courses", {
    page,
    size,
  });
  return {
    ...response,
    content: response.content.map(toCourse),
  };
}

export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const data = await get<CourseDTO>(`/courses/${id}`);
    return toCourse(data);
  } catch {
    return null;
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const data = await get<CourseDTO>(`/courses/slug/${slug}`);
    return toCourse(data);
  } catch {
    return null;
  }
}

export async function getCoursesByCategory(
  categoryId: string,
  page = 0,
  size = 10
): Promise<PageResponse<Course>> {
  const response = await get<PageResponse<CourseDTO>>(
    `/courses/category/${categoryId}`,
    { page, size }
  );
  return {
    ...response,
    content: response.content.map(toCourse),
  };
}

export async function getCoursesByInstructor(
  instructorId: string,
  page = 0,
  size = 10
): Promise<PageResponse<Course>> {
  const response = await get<PageResponse<CourseDTO>>(
    `/courses/instructor/${instructorId}`,
    { page, size }
  );
  return {
    ...response,
    content: response.content.map(toCourse),
  };
}

export async function searchCourses(
  keyword: string,
  page = 0,
  size = 10
): Promise<PageResponse<Course>> {
  const response = await get<PageResponse<CourseDTO>>("/courses/search", {
    keyword,
    page,
    size,
  });
  return {
    ...response,
    content: response.content.map(toCourse),
  };
}

export async function getFeaturedCourses(): Promise<Course[]> {
  const data = await get<CourseDTO[]>("/courses/featured");
  return data.map(toCourse);
}

export async function getTrendingCourses(): Promise<Course[]> {
  const data = await get<CourseDTO[]>("/courses/trending");
  return data.map(toCourse);
}

export async function createCourse(course: Partial<Course>): Promise<Course> {
  const dto = {
    title: course.title,
    description: course.description,
    categoryId: course.categoryId ? Number(course.categoryId) : undefined,
    price: course.price,
    originalPrice: course.originalPrice,
    level: course.level,
    duration: course.duration,
    thumbnail: course.thumbnail,
    tags: course.tags,
  };
  const data = await post<CourseDTO>("/courses", dto);
  return toCourse(data);
}

export async function updateCourse(
  id: string,
  course: Partial<Course>
): Promise<Course> {
  const dto = {
    title: course.title,
    description: course.description,
    categoryId: course.categoryId ? Number(course.categoryId) : undefined,
    price: course.price,
    originalPrice: course.originalPrice,
    level: course.level,
    duration: course.duration,
    thumbnail: course.thumbnail,
    tags: course.tags,
  };
  const data = await put<CourseDTO>(`/courses/${id}`, dto);
  return toCourse(data);
}

export async function deleteCourse(id: string): Promise<void> {
  await del(`/courses/${id}`);
}

// Section management
export async function getSections(courseId: string): Promise<Section[]> {
  const data = await get<SectionDTO[]>(`/courses/${courseId}/sections`);
  return data.map(toSection);
}

export async function addSection(
  courseId: string,
  section: Partial<Section>
): Promise<Section> {
  const dto = {
    title: section.title,
    description: "",
  };
  const data = await post<SectionDTO>(`/courses/${courseId}/sections`, dto);
  return toSection(data);
}

export async function updateSection(
  courseId: string,
  sectionId: string,
  section: Partial<Section>
): Promise<Section> {
  const dto = {
    title: section.title,
  };
  const data = await put<SectionDTO>(
    `/courses/${courseId}/sections/${sectionId}`,
    dto
  );
  return toSection(data);
}

export async function deleteSection(
  courseId: string,
  sectionId: string
): Promise<void> {
  await del(`/courses/${courseId}/sections/${sectionId}`);
}

export async function reorderSections(
  courseId: string,
  sectionIds: string[]
): Promise<void> {
  await put(`/courses/${courseId}/sections/reorder`, {
    sectionIds: sectionIds.map(Number),
  });
}

// Lesson management
export async function getLessons(sectionId: string): Promise<Lesson[]> {
  const data = await get<LessonDTO[]>(`/courses/sections/${sectionId}/lessons`);
  return data.map(toLesson);
}

export async function addLesson(
  courseId: string,
  sectionId: string,
  lesson: Partial<Lesson>
): Promise<Lesson> {
  const dto = {
    title: lesson.title,
    duration: lesson.duration || 0,
    type: lesson.type?.toUpperCase() || "VIDEO",
    videoUrl: lesson.videoUrl,
  };
  const data = await post<LessonDTO>(
    `/courses/${courseId}/sections/${sectionId}/lessons`,
    dto
  );
  return toLesson(data);
}

export async function updateLesson(
  courseId: string,
  sectionId: string,
  lessonId: string,
  lesson: Partial<Lesson>
): Promise<Lesson> {
  const dto = {
    title: lesson.title,
    duration: lesson.duration,
    type: lesson.type?.toUpperCase(),
    videoUrl: lesson.videoUrl,
  };
  const data = await put<LessonDTO>(
    `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
    dto
  );
  return toLesson(data);
}

export async function deleteLesson(
  courseId: string,
  sectionId: string,
  lessonId: string
): Promise<void> {
  await del(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
}

export async function reorderLessons(
  courseId: string,
  sectionId: string,
  lessonIds: string[]
): Promise<void> {
  await put(`/courses/${courseId}/sections/${sectionId}/lessons/reorder`, {
    lessonIds: lessonIds.map(Number),
  });
}

export default {
  getCourses,
  getCoursesPaginated,
  getCourseById,
  getCourseBySlug,
  getCoursesByCategory,
  getCoursesByInstructor,
  searchCourses,
  getFeaturedCourses,
  getTrendingCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getSections,
  addSection,
  updateSection,
  deleteSection,
  reorderSections,
  getLessons,
  addLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
};
