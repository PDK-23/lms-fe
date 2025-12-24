import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { VideoLessonPlayer } from "@/components/course/VideoLessonPlayer";
import { InstructorBlock } from "@/components/course/CourseDetail";
import ALL_COURSES, { getCourseSections } from "@/mocks/courses";
import { getLessonData } from "@/mocks/lessonData";
import type { Lesson, Section } from "@/types";
import { ThumbsUp, Home } from "lucide-react";

export default function LessonPage() {
  const { t } = useTranslation();
  const params = useParams();
  const courseId = params.id || "";
  const lessonId = params.lessonId;
  const [activeTab, setActiveTab] = useState<"description" | "comments">(
    "description"
  );

  const course = ALL_COURSES.find((c) => c.id === courseId);

  // Get lesson-specific data based on current lesson ID
  const lessonData = getLessonData(lessonId || "l1");

  // Get course sections from mock data
  const sections = useMemo((): Section[] => {
    if (!course) return [];
    return getCourseSections(courseId);
  }, [course, courseId]);

  // Find current lesson (default to first lesson if not specified)
  const allLessons = sections.flatMap((s) => s.lessons);
  const currentLesson = lessonId
    ? allLessons.find((l) => l.id === lessonId)
    : allLessons[0];

  const navigate = useNavigate();

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

          {/* Center - Video Player & Info */}
          <div className="lg:col-span-3 space-y-6 z-10">
            <div className="flex justify-between py-2 px-4 items-center">
              <div className="font-semibold">{currentLesson?.title}</div>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Home size={16} />
                Back to home
              </button>
            </div>
            <VideoPlayer
              videoUrl={currentLesson?.videoUrl}
              title={currentLesson?.title || "Select a lesson"}
              duration={currentLesson?.duration || 0}
              onMarkComplete={handleMarkComplete}
            />

            {/* Lesson Tabs - Description & Comments */}
            <Card
              className="overflow-hidden rounded-none !mt-0"
              key={currentLesson?.id}
            >
              {/* Tab Navigation */}
              <div className="flex border-b border-neutral-200">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === "description"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                      : "text-neutral-600 hover:text-neutral-900 bg-neutral-50"
                  }`}
                >
                  Lesson Description
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === "comments"
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-white"
                      : "text-neutral-600 hover:text-neutral-900 bg-neutral-50"
                  }`}
                >
                  Comments
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "description" && (
                  <div className="space-y-6">
                    {/* About Lesson */}
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900 mb-3">
                        About this lesson
                      </h3>
                      <p className="text-neutral-700 text-sm leading-relaxed mb-4">
                        {lessonData.description}
                      </p>
                      <p className="text-neutral-600 text-sm">
                        {lessonData.additionalInfo}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "comments" && (
                  <div className="space-y-6">
                    {/* Comment Input */}
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900 mb-4">
                        Share your thoughts
                      </h3>
                      <textarea
                        placeholder="Write a comment..."
                        className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        rows={4}
                      />
                      <div className="flex justify-end mt-2">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm">
                          Post Comment
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900 mb-4">
                        All Comments ({lessonData.comments.length})
                      </h3>
                      <div className="space-y-4">
                        {lessonData.comments.map((comment) => (
                          <div key={comment.id}>
                            {/* Main Comment */}
                            <div className="flex gap-3 p-4 border border-neutral-200 rounded-lg">
                              <div
                                className={`w-10 h-10 rounded-full ${comment.avatarColor} flex items-center justify-center flex-shrink-0`}
                              >
                                <span className="font-bold text-sm">
                                  {comment.authorInitials}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm text-neutral-900">
                                    {comment.author}
                                  </span>
                                  <span className="text-xs text-neutral-500">
                                    {comment.timestamp}
                                  </span>
                                </div>
                                <p className="text-sm text-neutral-700">
                                  {comment.content}
                                </p>
                                <div className="flex gap-4 mt-2">
                                  <button className="text-xs text-neutral-500 hover:text-indigo-600 flex items-center gap-2">
                                    <ThumbsUp size={12} /> {comment.likes}
                                  </button>
                                  <button className="text-xs text-neutral-500 hover:text-indigo-600">
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="ml-12 mt-3 space-y-3">
                                {comment.replies.map((reply) => (
                                  <div
                                    key={reply.id}
                                    className="flex gap-3 p-3 border border-neutral-200 rounded-lg bg-neutral-50"
                                  >
                                    <div
                                      className={`w-8 h-8 rounded-full ${reply.avatarColor} flex items-center justify-center flex-shrink-0`}
                                    >
                                      <span className="font-bold text-xs">
                                        {reply.authorInitials}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-xs text-neutral-900">
                                          {reply.author}
                                        </span>
                                        <span className="text-xs text-neutral-500">
                                          {reply.timestamp}
                                        </span>
                                      </div>
                                      <p className="text-xs text-neutral-700">
                                        {reply.content}
                                      </p>
                                      <div className="flex gap-4 mt-2">
                                        <button className="text-xs text-neutral-500 hover:text-indigo-600 flex gap-2 items-center">
                                          <ThumbsUp size={12} /> {reply.likes}
                                        </button>
                                        <button className="text-xs text-neutral-500 hover:text-indigo-600">
                                          Reply
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

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
