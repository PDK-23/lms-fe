import { Card, Button, Input } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { Edit2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import quizService from "@/services/quizService";
import type { Quiz } from "@/types";

export default function AdminQuizzes() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await quizService.getQuizzes();
      setQuizzes(result);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    try {
      await quizService.deleteQuiz(id);
      setConfirmDelete(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    }
  };

  const filtered = quizzes.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Quizzes</h2>
        <div className="flex items-center gap-6">
          <Input
            value={search}
            placeholder="Search quizzes"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            className="flex gap-2 items-center"
            onClick={() => navigate("/admin/quizzes/new")}
          >
            <Plus className="w-4 h-4" />
            <span className="ml-2">New Quiz</span>
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b">
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Course</th>
                <th className="py-3 px-2">Questions</th>
                <th className="py-3 px-2">Duration</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id} className="border-t hover:bg-neutral-50">
                  <td className="py-3 px-2 font-medium">{q.title}</td>
                  <td className="py-3 px-2 text-neutral-600">
                    {q.courseId || "-"}
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    {q.questions.length}
                  </td>
                  <td className="py-3 px-2 text-neutral-600">
                    {q.duration} min
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/admin/quizzes/${q.id}/view`)}
                      >
                        View
                      </Button>
                      <Button
                        className="flex gap-2 items-center"
                        size="sm"
                        onClick={() => navigate(`/admin/quizzes/${q.id}`)}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span className="hidden lg:inline">Edit</span>
                      </Button>
                      <Button
                        className="flex gap-2 items-center"
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDelete(q.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden lg:inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="bg-white rounded-lg p-6 z-50 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Are you sure you want to delete this quiz?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(confirmDelete)}
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
