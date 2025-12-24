import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card } from "@/components/ui";
import quizService from "@/services/quizService";
import courseService from "@/services/courseService";
import type { Quiz, Course } from "@/types";

export default function AdminQuizNew() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [duration, setDuration] = useState(15);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses();
      setCourses(data);
      if (data.length > 0) {
        setCourseId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  async function save() {
    try {
      setSaving(true);
      const q: Omit<Quiz, "id"> = {
        title: title || "Untitled Quiz",
        courseId,
        questions: [],
        passingScore,
        duration,
      };
      await quizService.addQuiz(q);
      navigate("/admin/quizzes");
    } catch (error) {
      console.error("Failed to create quiz:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
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
              {courses.map((c) => (
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
            <Button onClick={save} disabled={saving}>
              {saving ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
