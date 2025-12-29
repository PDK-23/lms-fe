import { Card, Button } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Edit2, Trash2, Eye } from "lucide-react";
import * as courseService from "@/services/courseService";
import type { Course } from "@/types";
import TanstackTable from "@/components/admin/TanstackTable";
import ReactPaginate from "react-paginate";

// ReactPaginate may be exported as a CJS module (default under `.default`) depending on bundler interop.
const RP: any = (ReactPaginate as any)?.default ?? ReactPaginate;

export default function AdminCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Server-side pagination state (driven by URL query params)
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") ?? "0");
  const initialSize = Number(searchParams.get("size") ?? "10");

  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchCourses = useCallback(async (p: number, s: number) => {
    try {
      setLoading(true);
      const resp = await courseService.getCoursesPaginated(p, s);
      setCourses(resp.content);
      setPage(resp.page || p);
      setTotalPages(resp.totalPages || 1);
      setTotalElements(resp.totalElements || 0);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync page/size from URL params when the URL changes
  useEffect(() => {
    const sp = Number(searchParams.get("page") ?? "0");
    const ss = Number(searchParams.get("size") ?? "10");
    if (sp !== page) setPage(sp);
    if (ss !== size) setSize(ss);

    // fetch current page
    fetchCourses(sp, ss);
  }, [searchParams, fetchCourses]);

  const handleDelete = async (course: Course) => {
    try {
      await courseService.deleteCourse(course.id);
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
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => navigate("/admin/courses/new")}
        >
          + New Course
        </Button>
      </div>

      {/* Desktop Table View: TanStack Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <TanstackTable
            data={courses}
            initialPageSize={size}
            showPagination={false}
            columns={[
              {
                header: "Title",
                accessorKey: "title",
                cell: (info: any) => (
                  <span className="truncate font-medium">
                    {info.getValue()}
                  </span>
                ),
              },
              {
                header: "Instructor",
                accessorFn: (row: any) => row.instructor?.name,
                id: "instructor",
                cell: (info: any) => (
                  <span className="text-neutral-600 truncate">
                    {info.getValue()}
                  </span>
                ),
              },
              {
                header: "Students",
                accessorKey: "students",
                cell: (info: any) => (
                  <span className="text-neutral-600">{info.getValue()}</span>
                ),
              },
              {
                header: "Price",
                accessorKey: "price",
                cell: (info: any) => (
                  <span className="text-neutral-600">
                    {(info.getValue() * 0.043).toFixed(2)} USD
                  </span>
                ),
              },
              {
                header: "Actions",
                id: "actions",
                cell: (info: any) => {
                  const row = info.row.original as Course;
                  return (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        title="View"
                        aria-label="View course"
                        onClick={() =>
                          navigate(`/admin/courses/${row.id}/view`)
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        title="Edit"
                        aria-label="Edit course"
                        onClick={() => navigate(`/admin/courses/${row.id}`)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        title="Delete"
                        aria-label="Delete course"
                        onClick={() => {
                          setCourseToDelete(row);
                          setConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  );
                },
              },
            ]}
          />
        </div>

        {/* Server-side pager (updates URL query params) */}
        <div className="mt-3 flex items-center justify-end gap-4">
          <div className="text-sm text-neutral-600">
            Showing {Math.min(totalElements, page * size + courses.length)} of{" "}
            {totalElements}
          </div>
          <div>
            {RP ? (
              <RP
                pageCount={totalPages}
                forcePage={page}
                onPageChange={({ selected }) =>
                  setSearchParams({
                    page: String(selected),
                    size: String(size),
                  })
                }
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                previousLabel={"Prev"}
                nextLabel={"Next"}
                containerClassName={"inline-flex items-center space-x-1"}
                pageLinkClassName={
                  "px-3 py-1 rounded hover:bg-neutral-100 cursor-pointer text-sm"
                }
                activeLinkClassName={"bg-indigo-600 text-white"}
              />
            ) : (
              <div className="inline-flex items-center gap-2 text-sm text-neutral-600">
                <button
                  onClick={() =>
                    setSearchParams({
                      page: String(Math.max(0, page - 1)),
                      size: String(size),
                    })
                  }
                  className="px-3 py-1 rounded hover:bg-neutral-100"
                  disabled={page <= 0}
                >
                  Prev
                </button>
                <div>
                  {page + 1} / {totalPages}
                </div>
                <button
                  onClick={() =>
                    setSearchParams({
                      page: String(Math.min(totalPages - 1, page + 1)),
                      size: String(size),
                    })
                  }
                  className="px-3 py-1 rounded hover:bg-neutral-100"
                  disabled={page >= totalPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <select
            className="ml-2 border rounded px-2 py-1 text-sm"
            value={String(size)}
            onChange={(e) =>
              setSearchParams({
                page: "0",
                size: String(Number(e.target.value)),
              })
            }
          >
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
        </div>
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
