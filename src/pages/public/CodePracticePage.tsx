import { useParams, useNavigate } from "react-router-dom";
import { Card, Button } from "@/components/ui";

export default function CodePracticePage() {
  const { id: courseId, lessonId, slug } = useParams();
  const navigate = useNavigate();

  const problemSlug = slug || lessonId || "";
  const externalUrl = `https://practice.com/problems/${problemSlug}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">practice Practice</h2>
          <div className="text-sm text-neutral-500">
            Course: {courseId} • Problem: {problemSlug}
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
          This will open the practice problem in a new tab. You can also show
          embedded editor or a custom coding playground here.
        </p>
        <div className="flex gap-2">
          <a href={externalUrl} target="_blank" rel="noreferrer">
            <Button>Open on practice</Button>
          </a>
          <Button
            variant="outline"
            onClick={() => alert("Open in in-app editor (mock)")}
          >
            Open Editor
          </Button>
        </div>
      </Card>
    </div>
  );
}
