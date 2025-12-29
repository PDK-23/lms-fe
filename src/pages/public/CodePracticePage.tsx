import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import CodeEditor from "@/components/course/CodeEditor";
import practiceService from "@/services/practiceService";
import { useState, useEffect, useCallback } from "react";
import type { Practice } from "@/types";

export default function CodePracticePage() {
  const { id: courseId, lessonId, slug } = useParams();
  const navigate = useNavigate();

  const problemSlug = slug || lessonId || "";
  const [practice, setPractice] = useState<Practice | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPractice = useCallback(async () => {
    if (!problemSlug) return;
    try {
      setLoading(true);
      // First try by id; if not found, try by slug (some URLs contain slug)
      let data = await practiceService.getPracticeById(problemSlug);
      if (!data) {
        console.log("Not found by id, trying slug...");
        data = await practiceService.getPracticeBySlug(problemSlug);
      }

      console.log("Fetched practice:", data);
      setPractice(data);
    } catch (error) {
      console.error("Failed to fetch practice:", error);
    } finally {
      setLoading(false);
    }
  }, [problemSlug]);

  useEffect(() => {
    fetchPractice();
  }, [fetchPractice]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900">
        <div className="text-neutral-400">Practice not found</div>
      </div>
    );
  }

  return (
    <div className="px-4 bg-neutral-900 h-screen flex flex-col overflow-hidden">
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="font-semibold text-neutral-100">
            {practice?.title || "Code Practice"}
          </h2>
          <div className="text-sm text-neutral-400">Course: {courseId}</div>
        </div>
        <div>
          <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      <CodeEditor practice={practice} />
    </div>
  );
}
