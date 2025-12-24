import { useParams, useNavigate } from "react-router-dom";
import { Card, Button } from "@/components/ui";
import CodeEditor from "@/components/course/CodeEditor";
import practiceService from "@/services/practiceService";

export default function CodePracticePage() {
  const { id: courseId, lessonId, slug } = useParams();
  const navigate = useNavigate();

  const problemSlug = slug || lessonId || "";
  const practice = practiceService.getPracticeBySlug(problemSlug);

  return (
    <div className="px-4 bg-neutral-900 h-screen flex flex-col">
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="font-semibold text-neutral-100">
            {practice?.title || "Code Practice"}
          </h2>
          <div className="text-sm text-neutral-400">Course: {courseId}</div>
        </div>
        <div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      <CodeEditor practice={practice} />
    </div>
  );
}
