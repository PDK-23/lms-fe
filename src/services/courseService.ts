import { ALL_COURSES as SEED } from "@/mocks/courses";
import type { Course, Section, Lesson } from "@/types";

const STORAGE_KEY = "mock_courses_v1";

function load(): Course[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Course[];
  } catch (e) {
    console.warn("Failed to read courses from localStorage", e);
  }
  // deep clone seed
  return JSON.parse(JSON.stringify(SEED)) as Course[];
}

function save(courses: Course[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch (e) {
    console.warn("Failed to write courses to localStorage", e);
  }
}

let courses = load();

export function getCourses(): Course[] {
  return courses;
}

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

export function updateCourse(updated: Course) {
  const i = courses.findIndex((c) => c.id === updated.id);
  if (i >= 0) {
    courses[i] = JSON.parse(JSON.stringify(updated));
    save(courses);
  }
}

export function addSection(courseId: string, section: Section) {
  const course = getCourseById(courseId);
  if (!course) return;
  course.sections = course.sections || [];
  course.sections.push(section);
  save(courses);
}

export function updateSection(courseId: string, section: Section) {
  const course = getCourseById(courseId);
  if (!course || !course.sections) return;
  const i = course.sections.findIndex((s) => s.id === section.id);
  if (i >= 0) {
    course.sections[i] = section;
    save(courses);
  }
}

export function deleteSection(courseId: string, sectionId: string) {
  const course = getCourseById(courseId);
  if (!course || !course.sections) return;
  course.sections = course.sections.filter((s) => s.id !== sectionId);
  save(courses);
}

export function addLesson(courseId: string, sectionId: string, lesson: Lesson) {
  const course = getCourseById(courseId);
  if (!course || !course.sections) return;
  const sec = course.sections.find((s) => s.id === sectionId);
  if (!sec) return;
  sec.lessons.push(lesson);
  save(courses);
}

export function updateLesson(
  courseId: string,
  sectionId: string,
  lesson: Lesson
) {
  const course = getCourseById(courseId);
  if (!course || !course.sections) return;
  const sec = course.sections.find((s) => s.id === sectionId);
  if (!sec) return;
  const i = sec.lessons.findIndex((l) => l.id === lesson.id);
  if (i >= 0) {
    sec.lessons[i] = lesson;
    save(courses);
  }
}

export function deleteLesson(
  courseId: string,
  sectionId: string,
  lessonId: string
) {
  const course = getCourseById(courseId);
  if (!course || !course.sections) return;
  const sec = course.sections.find((s) => s.id === sectionId);
  if (!sec) return;
  sec.lessons = sec.lessons.filter((l) => l.id !== lessonId);
  save(courses);
}

export function reorderSections(courseId: string, newOrder: Section[]) {
  const course = getCourseById(courseId);
  if (!course) return;
  course.sections = newOrder;
  save(courses);
}

export function reorderLessons(
  courseId: string,
  sectionId: string,
  newOrder: Lesson[]
) {
  const course = getCourseById(courseId);
  if (!course || !course.sections) return;
  const sec = course.sections.find((s) => s.id === sectionId);
  if (!sec) return;
  sec.lessons = newOrder;
  save(courses);
}

export default {
  getCourses,
  getCourseById,
  updateCourse,
  addSection,
  updateSection,
  deleteSection,
  addLesson,
  updateLesson,
  deleteLesson,
  reorderSections,
  reorderLessons,
};
