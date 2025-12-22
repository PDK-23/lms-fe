import { Card, Button, Input } from "@/components/ui";
import { useState } from "react";

export default function AdminCourseNew() {
  const [title, setTitle] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Create Course</h2>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-700 mb-2">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => alert(`Created ${title}`)} disabled={!title}>
              Create
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
