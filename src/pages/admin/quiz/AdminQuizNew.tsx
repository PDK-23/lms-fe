import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card } from "@/components/ui";
import quizService from "@/services/quizService";
import { ALL_COURSES } from "@/mocks/courses";
import type { Quiz } from "@/types";

export default function AdminQuizNew() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState(ALL_COURSES[0]?.id || "");
  const [passingScore, setPassingScore] = useState(70);
  const [duration, setDuration] = useState(15);

  function save() {
    const q: Quiz = {
      id: Date.now().toString(),
      title: title || "Untitled Quiz",
      courseId,
      questions: [],
      passingScore,
      duration,
    };
    quizService.addQuiz(q);
    navigate("/admin/quizzes");
  }

  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-lg sm:text-xl font-semibold">New Quiz</h2>
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
            <Button onClick={save}>Create</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
