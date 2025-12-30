import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { ArrowLeft, Clock, Flag } from "lucide-react";
import MOCK_QUIZ_QUESTIONS, { getQuizMeta } from "@/mocks/quizQuestions";
import quizService from "@/services/quizService";
import courseService from "@/services/courseService";

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

    // autosave to backend when attempt exists
    if (attemptId) {
      const answersPayload = Object.entries({ ...answers, [qId]: idx }).map(
        ([questionId, selectedIndex]) => ({ questionId, selectedIndex })
      );
      const timeTaken = (QUIZ_DURATION_MINUTES * 60) - secondsLeft;
      // fire-and-forget
      (async () => {
        try {
          await quizService.saveAttemptProgress({
            attemptId: attemptId,
            lessonId: lessonId || "",
            timeTaken,
            answers: answersPayload,
          });
        } catch (e) {
          // ignore autosave errors
        }
      })();
    }
  };

  // Flags (questions to review)
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [reviewOnly] = useState(false);

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

  // Quiz timer (seconds)
  const QUIZ_DURATION_MINUTES = 30;
  const [secondsLeft, setSecondsLeft] = useState(QUIZ_DURATION_MINUTES * 60);
  const hasAutoSubmitted = useRef(false);
  // Refs to question elements for quick navigation
  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);

  // initialize from active attempt if exists
  useEffect(() => {
    let mounted = true;
    async function loadAttempt() {
      if (!lessonId) return;
      try {
        const resp: any = await quizService.getActiveAttempt(lessonId);
        if (!mounted || !resp) return;
        const attempt = resp; // may be null
        if (attempt && attempt.id) {
          setAttemptId(attempt.id);

          // prefill answers
          if (attempt.answers && attempt.answers.length) {
            const map: Record<string, number> = {};
            for (const a of attempt.answers) {
              // if backend returns selectedOptionId, try to find index
              const q = questions.find((qq) => qq.id === a.questionId);
              if (!q) continue;
              if (a.selectedOptionId) {
                // try to match by option text or id fallback - for mock we try not available
                // no-op here
              }
              // if backend didn't include index, leave undefined; but if selectedOptionId absent and we had stored selectedIndex in answers during save, backend should return it - otherwise skip
              if ((a as any).selectedIndex !== undefined) {
                map[a.questionId] = (a as any).selectedIndex;
              }
            }
            setAnswers(map);
          }

          // compute secondsLeft from startedAt
          if (attempt.startedAt) {
            const started = new Date(attempt.startedAt).getTime();
            const elapsed = Math.floor((Date.now() - started) / 1000);
            const totalSeconds = (quizMeta.duration || QUIZ_DURATION_MINUTES) * 60;
            setSecondsLeft(Math.max(0, totalSeconds - elapsed));
          }

          // if attempt already completed, mark submitted
          if (attempt.status && attempt.status !== "PENDING") {
            setIsSubmitted(true);
            setResult({
              id: attempt.id,
              score: attempt.score ?? 0,
              earnedPoints: attempt.earnedPoints ?? 0,
              totalPoints: attempt.totalPoints ?? 0,
              timeTaken: attempt.timeTaken ?? 0,
              passed: attempt.status === "PASSED",
            });
          }
        }
      } catch (err) {
        // ignore if unauthenticated or no attempt
      }
    }

    loadAttempt();

    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [lessonId]);

  useEffect(() => {
    if (secondsLeft === 0 && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      // auto-submit (mock)
      alert("Time's up — auto-submitting (mock)");
      // TODO: call actual submit handler when implemented
    }
  }, [secondsLeft]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<null | {
    id: string;
    score: number;
    earnedPoints: number;
    totalPoints: number;
    timeTaken: number;
    passed: boolean;
  }>(null);

  const [attemptId, setAttemptId] = useState<string | null>(null);

  const PASSING_SCORE = 70; // fallback when quiz metadata doesn't include passingScore

  const handleSubmit = async () => {
    if (secondsLeft === 0) {
      alert("Cannot submit — time is up. Auto-submitted (mock).");
      return;
    }

    // compute time taken
    const durationSeconds = QUIZ_DURATION_MINUTES * 60;
    const timeTaken = durationSeconds - secondsLeft;

    // build answers array and compute score locally (mock)
    const answersPayload = questions.map((q) => ({
      questionId: q.id,
      selectedIndex: answers[q.id],
    }));

    let earned = 0;
    let total = questions.length; // each question 1 point in mock
    for (const q of questions) {
      const sel = answers[q.id];
      if (sel !== undefined && sel === q.correct) earned++;
    }
    const percent = total === 0 ? 0 : (earned / total) * 100;
    const passed = percent >= PASSING_SCORE;

    try {
      // call backend to save attempt and grading
      const payload = {
        lessonId: lessonId || "",
        timeTaken,
        answers: answersPayload,
      };
        // include attemptId if we have one so backend finalizes the existing attempt
      if (attemptId) (payload as any).attemptId = attemptId;
      const response: any = await (quizService as any).submitAttempt(payload);

      setIsSubmitted(true);
      setResult({
        id: response.id || response.attemptId || attemptId || "",
        score: response.score ?? percent,
        earnedPoints: response.earnedPoints ?? earned,
        totalPoints: response.totalPoints ?? total,
        timeTaken: response.timeTaken ?? timeTaken,
        passed: response.status === "PASSED" || passed,
      });

      // mark attempt id if returned
      if (response?.id) setAttemptId(response.id);

      // when passed, notify parent UI (e.g., Lesson page) via history or event
      try {
        if (response?.status === "PASSED" && lessonId) {
          // call lesson progress endpoint via courseService to refresh progress later - optional
          await (courseService as any).getCompletedLessons(lessonId);
        }
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      alert("Failed to submit quiz. Please try again.");
    }
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
                                onClick={() =>
                                  !isSubmitted && selectAnswer(q.id, idx)
                                }
                                className={`flex items-center gap-2 py-2 cursor-pointer rounded-lg hover:bg-neutral-50 px-2 ${
                                  isSubmitted
                                    ? "opacity-70 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  checked={answers[q.id] === idx}
                                  onChange={() =>
                                    !isSubmitted && selectAnswer(q.id, idx)
                                  }
                                  className="sr-only"
                                  disabled={isSubmitted}
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

                {/* Grading info after submit */}
                {isSubmitted && result && (
                  <div className="mt-4 p-3 bg-neutral-50 rounded border text-sm text-neutral-700">
                    <div className="flex items-center justify-between mb-1">
                      <div>Score</div>
                      <div className="font-semibold">
                        {Math.round(result.score)}%
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <div>Points</div>
                      <div className="font-semibold">
                        {result.earnedPoints}/{result.totalPoints}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Time taken</div>
                      <div className="font-semibold">
                        {Math.floor(result.timeTaken / 60)}m{" "}
                        {result.timeTaken % 60}s
                      </div>
                    </div>
                    <div
                      className={`mt-3 inline-block px-3 py-1 rounded-full text-xs ${
                        result.passed
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {result.passed ? "Passed" : "Failed"}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-2 justify-end">
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={secondsLeft === 0 || isSubmitted}
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
