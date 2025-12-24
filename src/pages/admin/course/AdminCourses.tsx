import { Card, Button } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import * as courseService from "@/services/courseService";
import type { Course } from "@/types";

export default function AdminCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const result = await courseService.getCourses();
      setCourses(result);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDelete = async (course: Course) => {
    try {
      await courseService.deleteCourse(course.id);
      fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
    } finally {
      setConfirmOpen(false);
      setCourseToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Courses</h2>
        <Button
          className="w-full sm:w-auto"
          onClick={() => navigate("/admin/courses/new")}
        >
          New Course
        </Button>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b">
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Instructor</th>
                <th className="py-3 px-2">Students</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-t hover:bg-neutral-50">
                  <td className="py-3 px-2 truncate font-medium">{c.title}</td>
                  <td className="py-3 px-2 text-neutral-600 truncate">
                    {c.instructor.name}
                  </td>
                  <td className="py-3 px-2 text-neutral-600">{c.students}</td>
                  <td className="py-3 px-2 text-neutral-600">
                    {(c.price * 0.043).toFixed(2)} USD
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => navigate(`/admin/courses/${c.id}/view`)}
                      >
                        <span className="hidden lg:inline">View</span>
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => navigate(`/admin/courses/${c.id}`)}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span className="hidden lg:inline">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          setCourseToDelete(c);
                          setConfirmOpen(true);
                        }}
                        variant="outline"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="hidden lg:inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {courses.map((c) => (
          <Card key={c.id} className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-sm truncate">{c.title}</h3>
              <p className="text-xs text-neutral-600 mt-1">
                {c.instructor.name}
              </p>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-neutral-600">{c.students} students</span>
                <span className="mx-2">•</span>
                <span className="text-neutral-600">
                  {(c.price * 0.043).toFixed(2)} USD
                </span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                onClick={() => navigate(`/admin/courses/${c.id}/view`)}
              >
                View
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                onClick={() => navigate(`/admin/courses/${c.id}`)}
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs flex items-center justify-center gap-1"
                onClick={() => {
                  setCourseToDelete(c);
                  setConfirmOpen(true);
                }}
                variant="outline"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {confirmOpen && courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => {
              setConfirmOpen(false);
              setCourseToDelete(null);
            }}
          />
          <div className="bg-white rounded-lg shadow-lg p-6 z-50 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Are you sure you want to delete "{courseToDelete.title}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmOpen(false);
                  setCourseToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(courseToDelete)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
