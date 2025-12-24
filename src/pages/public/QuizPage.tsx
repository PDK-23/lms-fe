import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { ArrowLeft, Clock, Flag } from "lucide-react";
import MOCK_QUIZ_QUESTIONS, { getQuizMeta } from "@/mocks/quizQuestions";

export default function QuizPage() {
  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();

  // Questions now come from a mock file
  const questions = MOCK_QUIZ_QUESTIONS;

  // Quiz metadata (title, duration, due)
  const quizMeta = getQuizMeta(lessonId);

  // user's answers by question id
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const selectAnswer = (qId: string, idx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  // Flags (questions to review)
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [reviewOnly, setReviewOnly] = useState(false);

  // Load/save flags to localStorage per course+lesson
  const flagsStorageKey = `quizFlags:${courseId || "default"}:${
    lessonId || "default"
  }`;
  useEffect(() => {
    try {
      const raw = localStorage.getItem(flagsStorageKey);
      if (raw) setFlags(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, [flagsStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(flagsStorageKey, JSON.stringify(flags));
    } catch (e) {
      // ignore
    }
  }, [flags, flagsStorageKey]);

  const toggleFlag = (qId: string) => {
    setFlags((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const jumpToFirstFlagged = () => {
    const idx = questions.findIndex((q) => flags[q.id]);
    if (idx >= 0) {
      questionRefs.current[idx]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Quiz timer (seconds)
  const QUIZ_DURATION_MINUTES = 30;
  const [secondsLeft, setSecondsLeft] = useState(QUIZ_DURATION_MINUTES * 60);
  const hasAutoSubmitted = useRef(false);
  // Refs to question elements for quick navigation
  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0 && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      // auto-submit (mock)
      alert("Time's up — auto-submitting (mock)");
      // TODO: call actual submit handler when implemented
    }
  }, [secondsLeft]);

  const handleSubmit = () => {
    if (secondsLeft === 0) {
      alert("Cannot submit — time is up. Auto-submitted (mock).");
      return;
    }

    alert("Submitted (mock)");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="">
        {/* Header */}
        <div className="flex items-start justify-between border-b p-4 sticky top-0 bg-white z-20">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-indigo-600"
            >
              <ArrowLeft size={12} />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div>
              <h2 className="font-semibold">{quizMeta.title}</h2>
              <div className="text-xs text-neutral-500">
                {quizMeta.isGraded ? "Graded Assignment" : "Practice"} •{" "}
                {quizMeta.duration} min
                {quizMeta.due ? ` • Due ${quizMeta.due}` : ""}
                {courseId ? ` • Course: ${courseId}` : ""}
                {lessonId ? ` • Lesson: ${lessonId}` : ""}
              </div>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium items-center flex ${
              secondsLeft <= 60
                ? "bg-red-100 text-red-600"
                : "bg-neutral-100 text-neutral-600"
            }`}
          >
            <Clock size={14} className="inline-block mr-2 text-neutral-500" />
            {secondsLeft === 0
              ? "Time's up"
              : `${Math.floor(secondsLeft / 60)}:${String(
                  secondsLeft % 60
                ).padStart(2, "0")}`}
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left: Quiz content (scrollable) */}
            <div className="lg:col-span-3">
              <div
                className="overflow-auto space-y-4"
                id="quiz-scroll-container"
              >
                {questions.map((q, i) => (
                  <div
                    key={q.id}
                    ref={(el) => {
                      questionRefs.current[i] = el;
                    }}
                    className="pl-2 bg-white flex gap-4 items-start"
                  >
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="text-sm text-neutral-600 font-medium"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">
                              {i + 1}. {q.text}
                            </div>
                            <div className="flex-shrink-0 mt-1 flex gap-2">
                              <div className="px-3 py-1 rounded-full bg-neutral-100 text-xs text-neutral-600 flex items-center">
                                1 point
                              </div>
                              <button
                                onClick={() => toggleFlag(q.id)}
                                className={`flex items-center gap-2 text-xs px-2 py-2 rounded-lg ${
                                  flags[q.id]
                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                    : "text-neutral-600 hover:bg-neutral-50"
                                }`}
                              >
                                <Flag size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-1">
                            {q.choices.map((c, idx) => (
                              <label
                                key={idx}
                                onClick={() => selectAnswer(q.id, idx)}
                                className="flex items-center gap-2 py-2 cursor-pointer rounded-lg hover:bg-neutral-50 px-2"
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  checked={answers[q.id] === idx}
                                  onChange={() => selectAnswer(q.id, idx)}
                                  className="sr-only"
                                />

                                <div
                                  className={`w-4 h-4 rounded-full border-2 ${
                                    answers[q.id] === idx
                                      ? "border-indigo-600"
                                      : "border-neutral-300"
                                  } flex items-center justify-center`}
                                >
                                  <div
                                    className={`${
                                      answers[q.id] === idx
                                        ? "w-2 h-2 bg-indigo-600 rounded-full"
                                        : "w-0 h-0"
                                    } `}
                                  />
                                </div>

                                <span className="text-sm">{c}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick navigation */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-md border p-4 space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  {(reviewOnly
                    ? questions.filter((q) => flags[q.id])
                    : questions
                  ).map((q, i) => (
                    <button
                      key={q.id}
                      onClick={() =>
                        questionRefs.current[i]?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        })
                      }
                      className={`px-3 py-2 text-sm rounded-md border ${
                        flags[q.id]
                          ? "bg-yellow-400 text-white border-yellow-400"
                          : answers[q.id] !== undefined
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-neutral-700"
                      }`}
                    >
                      {questions.indexOf(q) + 1}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex gap-2 justify-end">
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={secondsLeft === 0}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
