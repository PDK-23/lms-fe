import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui";
import { VideoPlayer } from "@/components/course/VideoPlayer";
import { ThumbsUp, Home } from "lucide-react";
import type { Lesson } from "@/types";
import courseService from "@/services/courseService";

interface LessonCenterProps {
  lesson?: Lesson | undefined;
  courseId?: string;
}

export default function LessonCenter({ lesson, courseId }: LessonCenterProps) {
  const [loading, setLoading] = useState(true);
  const [lessonData, setLessonData] = useState<any | null>(null);
  const navigate = useNavigate();
  console.log("LessonCenter lesson:", lesson);

  useEffect(() => {
    let mounted = true;
    async function fetchLessonData() {
      setLoading(true);
      try {
        if (!lesson?.id) {
          setLessonData(null);
          setLoading(false);
          return;
        }
        const data: any = await (courseService as any).getLessonDetails(
          lesson.id
        );
        if (!mounted) return;
        // map backend reviews to comment shape used by UI
        const comments: Array<any> = (data.comments || []).map((r: any) => ({
          id: r.id,
          author: r.userName || "Anonymous",
          authorInitials: (r.userName || "A")
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2),
          avatarColor: "bg-neutral-200",
          timestamp: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString()
            : "",
          content: r.comment,
          likes: r.helpful || 0,
          replies: [],
        }));

        setLessonData({
          description: data.description || "",
          additionalInfo: data.additionalInfo || "",
          comments,
        });
      } catch (e) {
        console.error("Failed to fetch lesson details:", e);
        setLessonData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchLessonData();

    return () => {
      mounted = false;
    };
  }, [lesson?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <Card className="max-w-4xl mx-auto p-6">Select a lesson to begin</Card>
    );
  }

  return (
    <div className="lg:col-span-3 space-y-6 z-10">
      <div className="flex justify-between py-2 px-4 items-center">
        <div className="font-semibold">{lesson.title}</div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <Home size={16} />
          Back to home
        </button>
      </div>

      {/* Render Video player for video lessons, otherwise show start action */}
      {(lesson?.type === "video" || !lesson?.type) && (
        <VideoPlayer
          videoUrl={lesson?.videoUrl}
          title={lesson?.title || "Select a lesson"}
          duration={lesson?.duration || 0}
          onMarkComplete={() => {
            // noop - parent may handle state changes
          }}
        />
      )}

      {(lesson?.type === "quiz" || lesson?.quizAvailable) && (
        <div className="p-6 bg-white h-[50vh] !mt-0">
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-lg font-semibold">Quiz: {lesson.title}</h3>
            <p className="text-neutral-700">
              This lesson contains a quiz. Click Start to begin.
            </p>
            <div>
              <button
                onClick={() =>
                  navigate(
                    `/courses/${courseId}/learn/lesson/${lesson.id}/quiz`
                  )
                }
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {(lesson?.type === "practice" || lesson?.practiceId) && (
        <Card className="p-6">
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-lg font-semibold">Practice: {lesson.title}</h3>
            <p className="text-neutral-700">
              This lesson contains a coding practice. Click Start to begin.
            </p>
            <div>
              <button
                onClick={() =>
                  navigate(
                    `/courses/${courseId}/learn/lesson/${lesson.slug}/practice/${lesson.practiceId}`
                  )
                }
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
              >
                Start Practice
              </button>
            </div>
          </div>
        </Card>
      )}
      {/* Lesson Tabs - Description & Comments */}

      <Card
        className={`overflow-hidden rounded-none !mt-0 ${
          (lesson?.type === "practice" ||
            lesson?.practiceId ||
            lesson?.type === "quiz" ||
            lesson?.quizAvailable) &&
          "hidden"
        }`}
        key={lesson.id}
      >
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-neutral-900 mb-3">
                About this lesson
              </h3>
              <p className="text-neutral-700 text-sm leading-relaxed mb-4">
                {lessonData?.description}
              </p>
              <p className="text-neutral-600 text-sm">
                {lessonData?.additionalInfo}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-neutral-900 mb-4">
                All Comments ({lessonData?.comments.length ?? 0})
              </h3>
              <div className="space-y-4">
                {lessonData?.comments.map((comment: any) => (
                  <div key={comment.id}>
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

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-12 mt-3 space-y-3">
                        {comment.replies.map((reply: any) => (
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
        </div>
      </Card>
    </div>
  );
}
