import { Card, Button } from "@/components/ui";
import { ALL_COURSES } from "@/mocks/courses";
import { useNavigate } from "react-router-dom";

export default function AdminCourses() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Courses</h2>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/admin/courses/new")}>
            New Course
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500">
                <th className="py-2">Title</th>
                <th className="py-2">Instructor</th>
                <th className="py-2">Students</th>
                <th className="py-2">Price</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ALL_COURSES.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="py-3">{c.title}</td>
                  <td className="py-3 text-neutral-600">{c.instructor.name}</td>
                  <td className="py-3 text-neutral-600">{c.students}</td>
                  <td className="py-3 text-neutral-600">
                    {(c.price * 0.043).toFixed(2)} USD
                  </td>
                  <td className="py-3 text-neutral-600">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/admin/courses/${c.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => alert("Deleted")}
                        variant="outline"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
