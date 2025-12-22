import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Card } from "@/components/ui";
import { Plus } from "lucide-react";
import quizService from "@/services/quizService";
import { ALL_COURSES } from "@/mocks/courses";
import type { Quiz, QuizQuestion } from "@/types";

export default function AdminQuizDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const q = id ? quizService.getQuizById(id) : undefined;

  const [title, setTitle] = useState(q?.title || "");
  const [courseId, setCourseId] = useState(q?.courseId || "");
  const [passingScore, setPassingScore] = useState(q?.passingScore || 70);
  const [duration, setDuration] = useState(q?.duration || 15);

  // Questions state
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    q?.questions || []
  );
  const [questionEditorOpen, setQuestionEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(
    null
  );
  const [confirmDeleteQuestion, setConfirmDeleteQuestion] = useState<
    string | null
  >(null);

  if (!q) return <div>Quiz not found</div>;

  function save() {
    const updated: Quiz = {
      id: String(q!.id),
      title,
      courseId,
      passingScore,
      duration,
      questions: q!.questions,
    };
    quizService.updateQuiz(updated);
    navigate("/admin/quizzes");
  }

  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-lg sm:text-xl font-semibold">Edit Quiz</h2>
      <Card className="p-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm mb-1">Course</label>
            <select
              className="mt-1 block w-full rounded border p-2"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">None</option>
              {ALL_COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Passing Score (%)</label>
              <Input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Duration (min)</label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold mb-2">Questions</h3>
          <div>
            <Button
              className="flex gap-2 items-center"
              onClick={() => {
                setEditingQuestion(null);
                setQuestionEditorOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              <span className="ml-2">Add Question</span>
            </Button>
          </div>
        </div>

        <div className="mt-3">
          {questions.length === 0 ? (
            <p className="text-sm text-neutral-600">No questions yet.</p>
          ) : (
            <div className="space-y-3">
              {questions.map((qq) => (
                <div
                  key={qq.id}
                  className="flex items-start justify-between p-3 border rounded"
                >
                  <div>
                    <div className="font-medium">{qq.text}</div>
                    <div className="text-xs text-neutral-600">
                      {qq.type} • Correct:{" "}
                      {Array.isArray(qq.correctAnswer)
                        ? (qq.correctAnswer as any[]).join(", ")
                        : String(qq.correctAnswer)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingQuestion(qq);
                        setQuestionEditorOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmDeleteQuestion(qq.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Question Editor Modal */}
      {questionEditorOpen && (
        <QuestionEditorModal
          question={editingQuestion}
          onClose={() => setQuestionEditorOpen(false)}
          onSave={(qq) => {
            // validate and persist
            const copy = { ...q } as Quiz;
            copy.questions = copy.questions || [];
            const idx = copy.questions.findIndex((x) => x.id === qq.id);
            if (idx >= 0) copy.questions[idx] = qq;
            else copy.questions.push(qq);
            quizService.updateQuiz(copy);
            setQuestions(copy.questions);
            setQuestionEditorOpen(false);
          }}
        />
      )}

      {/* Confirm Delete Question */}
      {confirmDeleteQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => setConfirmDeleteQuestion(null)}
          />
          <div className="bg-white rounded-lg p-6 z-50 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Are you sure you want to delete this question?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteQuestion(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const copy = { ...q } as Quiz;
                  copy.questions = (copy.questions || []).filter(
                    (x) => x.id !== confirmDeleteQuestion
                  );
                  quizService.updateQuiz(copy);
                  setQuestions(copy.questions);
                  setConfirmDeleteQuestion(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Question editor modal component
function QuestionEditorModal({
  question,
  onClose,
  onSave,
}: {
  question: QuizQuestion | null;
  onClose: () => void;
  onSave: (q: QuizQuestion) => void;
}) {
  const [text, setText] = useState(question?.text || "");
  const [type, setType] = useState<
    "multiple-choice" | "true-false" | "short-answer"
  >(question?.type || "multiple-choice");
  const [options, setOptions] = useState<string[]>(
    question?.options || ["", ""]
  );

  // For multiple-choice we track a set of selected correct option values
  const initialCorrectSet = new Set<string>(
    (Array.isArray(question?.correctAnswer)
      ? (question?.correctAnswer as any[]).map(String)
      : question?.correctAnswer
      ? [String(question.correctAnswer)]
      : []) as string[]
  );
  const [correctAnswers, setCorrectAnswers] =
    useState<Set<string>>(initialCorrectSet);
  const [tfCorrect, setTfCorrect] = useState<string>(
    question && !Array.isArray(question.correctAnswer)
      ? String(question.correctAnswer ?? "")
      : ""
  );
  const [shortCorrect, setShortCorrect] = useState<string>(
    question && !Array.isArray(question.correctAnswer)
      ? String(question.correctAnswer ?? "")
      : ""
  );

  function addOption() {
    setOptions((s) => [...s, ""]);
  }
  function updateOption(i: number, v: string) {
    setOptions((s) => s.map((x, idx) => (idx === i ? v : x)));
    // remove any correct answers that were removed later
    setCorrectAnswers((set) => {
      const newSet = new Set(set);
      // if option removed (empty), remove from set when it no longer exists
      return newSet;
    });
  }
  function removeOption(i: number) {
    const opt = options[i];
    setOptions((s) => s.filter((_, idx) => idx !== i));
    setCorrectAnswers((set) => {
      const newSet = new Set(set);
      newSet.delete(opt);
      return newSet;
    });
  }

  function toggleCorrect(opt: string) {
    setCorrectAnswers((set) => {
      const newSet = new Set(set);
      if (newSet.has(opt)) newSet.delete(opt);
      else newSet.add(opt);
      return newSet;
    });
  }

  function handleSave() {
    if (!text.trim()) return alert("Question text is required");
    if (type === "multiple-choice") {
      const valid = options.filter((o) => o.trim() !== "");
      if (valid.length < 2)
        return alert("Multiple choice requires at least 2 options");
      if (correctAnswers.size === 0)
        return alert("Please select at least one correct answer");
    }

    const id = question?.id || Date.now().toString();

    let correctAnswerValue: any = "";
    if (type === "multiple-choice") {
      const selected = Array.from(correctAnswers).filter(
        (s) => s.trim() !== ""
      );
      correctAnswerValue = selected.length === 1 ? selected[0] : selected;
    } else if (type === "true-false") {
      correctAnswerValue = String(tfCorrect);
    } else {
      correctAnswerValue = shortCorrect;
    }

    const qq: QuizQuestion = {
      id,
      text,
      type,
      options: type === "multiple-choice" ? options : undefined,
      correctAnswer: correctAnswerValue,
    } as any;
    onSave(qq);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white rounded-lg p-6 z-50 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-2">
          {question ? "Edit Question" : "Add Question"}
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Question text</label>
            <Input value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select
              className="mt-1 block w-full rounded border p-2"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True / False</option>
              <option value="short-answer">Short Answer</option>
            </select>
          </div>

          {type === "multiple-choice" && (
            <div className="space-y-2">
              <label className="block text-sm mb-1">Options</label>
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={correctAnswers.has(opt)}
                    onChange={() => toggleCorrect(opt)}
                  />
                  <Input
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(i)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={addOption}>
                  Add option
                </Button>
                <div className="text-xs text-neutral-600 self-center">
                  Check all correct answers
                </div>
              </div>
            </div>
          )}

          {type === "true-false" && (
            <div>
              <label className="block text-sm mb-1">Correct answer</label>
              <select
                className="mt-1 block w-full rounded border p-2"
                value={tfCorrect}
                onChange={(e) => setTfCorrect(e.target.value)}
              >
                <option value="">Select</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          )}

          {type === "short-answer" && (
            <div>
              <label className="block text-sm mb-1">
                Expected answer (optional)
              </label>
              <Input
                value={shortCorrect || ""}
                onChange={(e) => setShortCorrect(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
