import { Card } from "@/components/ui";
import { useParams } from "react-router-dom";
import specializationService from "@/services/specializationService";
import courseService from "@/services/courseService";

export default function AdminSpecializationView() {
  const { id } = useParams();
  const s = id ? specializationService.getSpecializationById(id) : undefined;

  if (!s) return <div>Specialization not found</div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg sm:text-xl font-semibold">Specialization</h2>
      <Card className="p-4">
        <h3 className="font-semibold text-lg">{s.name}</h3>
        <p className="text-sm text-neutral-600 mt-2">{s.description}</p>
        <p className="text-sm text-neutral-600 mt-2">
          Courses: {s.courseIds?.length || 0}
        </p>
        {s.courseIds && s.courseIds.length > 0 && (
          <div className="mt-3 space-y-2">
            {s.courseIds.map((id) => {
              const c = courseService.getCourseById(id);
              if (!c) return null;
              return (
                <div key={id} className="text-sm text-neutral-700">
                  {c.title}{" "}
                  <span className="text-xs text-neutral-500">
                    by {c.instructor.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
