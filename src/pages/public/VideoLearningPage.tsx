import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { VideoLessonPlayer } from "@/components/course/VideoLessonPlayer";
import { InstructorBlock } from "@/components/course/CourseDetail";
import ALL_COURSES from "@/mocks/courses";
import type { Lesson, Section } from "@/types";

export default function VideoLearningPage() {
  const { t } = useTranslation();
  const params = useParams();
  const courseId = params.id || "";
  const lessonId = params.lessonId;

  const course = ALL_COURSES.find((c) => c.id === courseId);

  // Mock course sections with lessons
  const sections = useMemo((): Section[] => {
    if (!course) return [];
    return [
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
  }, [course]);

  // Find current lesson (default to first lesson if not specified)
  const allLessons = sections.flatMap((s) => s.lessons);
  const currentLesson = lessonId
    ? allLessons.find((l) => l.id === lessonId)
    : allLessons[0];

  const handleLessonSelect = (lesson: Lesson) => {
    // In a real app, you would navigate to the lesson URL
    // navigate(`/course/${courseId}/lesson/${lesson.id}`);
    console.log("Selected lesson:", lesson);
  };

  const handleMarkComplete = () => {
    if (currentLesson) {
      currentLesson.isCompleted = true;
      // In a real app, you would update this in the backend
    }
  };

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
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Course Contents */}
          <div className="lg:col-span-1">
            <VideoLessonPlayer
              sections={sections}
              currentLesson={currentLesson}
              onLessonSelect={handleLessonSelect}
            />
          </div>

          {/* Center - Video Player & Info */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer
              videoUrl={currentLesson?.videoUrl}
              title={currentLesson?.title || "Select a lesson"}
              duration={currentLesson?.duration || 0}
              onMarkComplete={handleMarkComplete}
            />

            {/* Additional Resources */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-neutral-900 mb-4">
                Lesson Resources
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">📄</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-neutral-900">
                      Lesson Notes
                    </p>
                    <p className="text-xs text-neutral-500">PDF Document</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">🔗</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-neutral-900">
                      Related Articles
                    </p>
                    <p className="text-xs text-neutral-500">
                      3 external resources
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">💾</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-neutral-900">
                      Code Examples
                    </p>
                    <p className="text-xs text-neutral-500">
                      GitHub Repository
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-neutral-900 mb-3">
                About this lesson
              </h3>
              <p className="text-neutral-700 text-sm leading-relaxed">
                {currentLesson?.title ||
                  "Select a lesson to see its description"}
              </p>
              <p className="text-neutral-600 text-sm mt-4">
                In this lesson, you'll learn the fundamental concepts and
                practical applications. We'll cover step-by-step examples and
                provide hands-on exercises to reinforce your understanding.
              </p>
            </Card>
          </div>

          {/* Right Sidebar - Course Info & Instructor */}
          <div className="lg:col-span-1 space-y-6">
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
