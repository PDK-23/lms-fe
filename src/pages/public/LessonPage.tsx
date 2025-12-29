import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { VideoLessonPlayer } from "@/components/course/VideoLessonPlayer";
import LessonCenter from "@/components/course/LessonCenter";
import { InstructorBlock } from "@/components/course/CourseDetail";
import courseService from "@/services/courseService";
import type { Lesson, Section, Course } from "@/types";

// Default lesson data structure
const defaultLessonData = {
  description:
    "This lesson covers important concepts in the course curriculum.",
  additionalInfo:
    "Take your time to understand the material and practice regularly.",
  comments: [] as Array<{
    id: string;
    author: string;
    authorInitials: string;
    avatarColor: string;
    timestamp: string;
    content: string;
    likes: number;
    replies: Array<{
      id: string;
      author: string;
      authorInitials: string;
      avatarColor: string;
      timestamp: string;
      content: string;
      likes: number;
    }>;
  }>,
};

export default function LessonPage() {
  const { t } = useTranslation();
  const params = useParams();
  const courseId = params.id || "";
  const lessonId = params.lessonId;
  const [activeTab, setActiveTab] = useState<"description" | "comments">(
    "description"
  );
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const courseData = await courseService.getCourseById(courseId);
      setCourse(courseData);
      // If backend doesn't include sections in course payload, fetch sections separately
      if (!courseData?.sections || courseData.sections.length === 0) {
        try {
          const fetchedSections = await courseService.getSections(courseId);
          setSections(fetchedSections || []);
        } catch (err) {
          console.error("Failed to fetch sections:", err);
          setSections([]);
        }
      } else {
        setSections(courseData.sections);
      }
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // Get lesson-specific data (using default for now)
  const lessonData = defaultLessonData;

  // Find current lesson (default to first lesson if not specified)
  const allLessons = sections.flatMap((s) => s.lessons);
  const currentLesson = lessonId
    ? allLessons.find((l) => l.id === lessonId)
    : allLessons[0];

  const handleLessonSelect = (lesson: Lesson) => {
    // navigate to lesson route so params reflect the current lesson
    navigate(`/courses/${courseId}/learn/lesson/${lesson.id}`);
  };

  const handleMarkComplete = () => {
    if (currentLesson) {
      currentLesson.isCompleted = true;
      // In a real app, you would update this in the backend
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-12">
        <Card className="max-w-4xl mx-auto p-6">{t("course.notFound")}</Card>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Main Content */}
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          {/* Left Sidebar - Course Contents */}
          <div className="lg:col-span-1">
            <VideoLessonPlayer
              courseId={course.id}
              sections={sections}
              currentLesson={currentLesson}
              onLessonSelect={handleLessonSelect}
            />
          </div>

          <LessonCenter
            key={currentLesson?.id ?? lessonId ?? "none"}
            lesson={currentLesson}
          />

          {/* Right Sidebar - Course Info & Instructor */}
          <div className="lg:col-span-1 space-y-6 hidden">
            {/* Course Card */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-neutral-200 relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-neutral-900 text-sm line-clamp-2">
                  {course.title}
                </h4>
                <div className="mt-2 space-y-2 text-xs text-neutral-600">
                  <div>
                    ⭐ {course.rating} ({course.totalRatings} reviews)
                  </div>
                  <div>👥 {course.students.toLocaleString()} students</div>
                  <div>⏱️ {course.duration} hours</div>
                </div>
                <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm">
                  View Course
                </button>
              </div>
            </Card>

            {/* Instructor Info */}
            <InstructorBlock course={course} />

            {/* Progress Card */}
            <Card className="p-4">
              <h4 className="font-bold text-neutral-900 text-sm mb-3">
                Your Progress
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-neutral-600">Overall Completion</span>
                    <span className="font-semibold text-neutral-900">45%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: "45%" }}
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-neutral-200">
                  <p className="text-xs text-neutral-600">
                    💡 Keep up the great work! You're almost halfway through.
                  </p>
                </div>
              </div>
            </Card>

            {/* Share & Actions */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors text-sm">
                Share
              </button>
              <button className="flex-1 px-3 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors text-sm">
                ❤️ Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
