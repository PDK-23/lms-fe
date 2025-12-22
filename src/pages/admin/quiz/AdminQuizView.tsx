import { Card } from "@/components/ui";
import { useParams } from "react-router-dom";
import quizService from "@/services/quizService";

export default function AdminQuizView() {
  const { id } = useParams();
  const q = id ? quizService.getQuizById(id) : undefined;

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
