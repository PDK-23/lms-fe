import { useParams, useNavigate } from "react-router-dom";
import { Card, Button } from "@/components/ui";

export default function QuizPage() {
  const { id: courseId, lessonId } = useParams();
  const navigate = useNavigate();

  // Mock questions (in real app fetch by lessonId)
  const questions = [
    {
      id: "q1",
      text: "What is the time complexity of binary search?",
      choices: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correct: 1,
    },
    {
      id: "q2",
      text: "Which data structure uses FIFO?",
      choices: ["Stack", "Queue", "Tree", "Graph"],
      correct: 1,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Quiz</h2>
          <div className="text-sm text-neutral-500">
            Course: {courseId} • Lesson: {lessonId}
          </div>
        </div>
        <div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <p className="text-neutral-700 mb-4">
          This is a short quiz. Answer all questions and submit to see your
          score.
        </p>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={q.id} className="p-3 border rounded">
              <div className="font-medium mb-2">
                {i + 1}. {q.text}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.choices.map((c, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 p-2 border rounded hover:bg-neutral-50 cursor-pointer"
                  >
                    <input type="radio" name={q.id} />
                    <span className="text-sm">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={() => alert("Submitted (mock)")}>Submit</Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
