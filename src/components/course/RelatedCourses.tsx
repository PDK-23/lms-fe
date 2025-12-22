import { Card } from "@/components/ui";
import type { Course } from "@/types";
import { Link } from "react-router-dom";

export default function RelatedCourses({
  courses,
  title,
}: {
  courses: Course[];
  title: string;
}) {
  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {courses.map((c) => (
          <Card key={c.id} className="p-3">
            <Link to={`/courses/${c.id}`} className="flex items-center gap-3">
              <img
                src={c.thumbnail}
                alt={c.title}
                className="w-20 h-12 object-cover rounded"
              />
              <div>
                <div className="font-medium text-sm">{c.title}</div>
                <div className="text-xs text-neutral-500">
                  {c.instructor.name}
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
