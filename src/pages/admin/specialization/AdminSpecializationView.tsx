import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui";
import { useParams } from "react-router-dom";
import specializationService from "@/services/specializationService";
import courseService from "@/services/courseService";
import type { Specialization, Course } from "@/types";

export default function AdminSpecializationView() {
  const { id } = useParams();
  const [s, setS] = useState<Specialization | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [specialization, allCourses] = await Promise.all([
        specializationService.getSpecializationById(id),
        courseService.getCourses(),
      ]);
      setS(specialization || null);
      setCourses(allCourses);
    } catch (error) {
      console.error("Failed to fetch specialization:", error);
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
            {s.courseIds.map((courseId) => {
              const c = courses.find((course) => course.id === courseId);
              if (!c) return null;
              return (
                <div key={courseId} className="text-sm text-neutral-700">
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
