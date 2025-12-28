import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui";
import { useParams } from "react-router-dom";
import quizService from "@/services/quizService";
import type { Quiz } from "@/types";

export default function AdminQuizView() {
  const { id } = useParams();
  const [q, setQ] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const result = await quizService.getQuizById(id);
      setQ(result || null);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!q) return <div>Quiz not found</div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg sm:text-xl font-semibold">Quiz</h2>
      <Card className="p-4">
        <h3 className="font-semibold text-lg">{q.title}</h3>
        <p className="text-sm text-neutral-600 mt-1">
          Course: {q.courseId || "-"}
        </p>
        <p className="text-sm text-neutral-600 mt-1">
          Duration: {q.duration} minutes
        </p>
        <p className="text-sm text-neutral-600 mt-1">
          Passing score: {q.passingScore}%
        </p>
        <p className="text-sm text-neutral-600 mt-3">
          Questions: {q.questions.length}
        </p>
      </Card>
    </div>
  );
}
