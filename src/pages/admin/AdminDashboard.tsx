import { useMemo } from "react";
import { Card, Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { ALL_COURSES } from "@/mocks/courses";
import {
  Users,
  BookOpen,
  BarChart3,
  DollarSign,
  PlusCircle,
  Download,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = useMemo(
    () => [
      {
        id: "courses",
        label: "Courses",
        value: ALL_COURSES.length,
        icon: BookOpen,
        delta: "+3 this week",
      },
      {
        id: "students",
        label: "Students",
        value: 45230,
        icon: Users,
        delta: "+1.2%",
      },
      {
        id: "revenue",
        label: "Revenue (USD)",
        value: "$72,400",
        icon: DollarSign,
        delta: "+8%",
      },
      {
        id: "engagement",
        label: "Engagement",
        value: "72%",
        icon: BarChart3,
        delta: "+4%",
      },
    ],
    []
  );

  const recentCourses = useMemo(() => ALL_COURSES.slice(0, 5), []);
  const recentEnrollments = useMemo(
    () => [
      {
        id: 1,
        user: "Anh Tran",
        course: ALL_COURSES[0]?.title || "Course A",
        date: "2 hours ago",
      },
      {
        id: 2,
        user: "Minh Le",
        course: ALL_COURSES[1]?.title || "Course B",
        date: "1 day ago",
      },
      {
        id: 3,
        user: "Linh Nguyen",
        course: ALL_COURSES[2]?.title || "Course C",
        date: "2 days ago",
      },
    ],
    []
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Overview of site metrics and recent activity
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            className="flex items-center justify-center gap-2 text-sm"
            onClick={() => navigate("/admin/courses/new")}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Course</span>
            <span className="sm:hidden">New</span>
          </Button>
          <Button
            className="flex items-center justify-center gap-2 text-sm"
            onClick={() => alert("Exported CSV")}
            variant="outline"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {stats.map((s) => (
          <Card key={s.id} className="p-3 md:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs md:text-sm text-neutral-500">
                  {s.label}
                </div>
                <div className="text-lg md:text-2xl font-bold mt-1 break-words">
                  {s.value}
                </div>
                <div className="text-xs text-green-600 mt-2">{s.delta}</div>
              </div>
              <div className="bg-neutral-100 rounded p-2 md:p-3 flex-shrink-0">
                <s.icon className="w-5 h-5 md:w-6 md:h-6 text-neutral-700" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="lg:col-span-2 p-3 md:p-4">
          <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4">
            Weekly Active Users
          </h3>
          <div className="w-full h-32 md:h-40">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
            >
              <rect x="0" y="10" width="8" height="30" fill="#eef2ff" />
              <rect x="12" y="4" width="8" height="36" fill="#c7d2fe" />
              <rect x="24" y="6" width="8" height="34" fill="#c7d2fe" />
              <rect x="36" y="2" width="8" height="38" fill="#4f46e5" />
              <rect x="48" y="8" width="8" height="32" fill="#c7d2fe" />
              <rect x="60" y="12" width="8" height="28" fill="#eef2ff" />
              <rect x="72" y="6" width="8" height="34" fill="#c7d2fe" />
              <rect x="84" y="10" width="8" height="30" fill="#c7d2fe" />
            </svg>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2 text-xs sm:text-sm text-neutral-500">
            <div>
              Active users:{" "}
              <span className="font-semibold text-neutral-900">34,210</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div>
              Signups:{" "}
              <span className="font-semibold text-neutral-900">1,320</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div>
              Avg. watch:{" "}
              <span className="font-semibold text-neutral-900">21m</span>
            </div>
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <h3 className="font-semibold text-sm md:text-base mb-3">
            Recent Enrollments
          </h3>
          <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
            {recentEnrollments.map((r) => (
              <li key={r.id} className="flex flex-col gap-1">
                <div className="font-medium truncate">{r.user}</div>
                <div className="text-xs text-neutral-500 truncate">
                  {r.course}
                </div>
                <div className="text-xs text-neutral-400">{r.date}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-3 md:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="font-semibold text-sm md:text-base">
              Recent Courses
            </h3>
            <Button size="sm" onClick={() => navigate("/admin/courses")}>
              Manage
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="text-left text-neutral-500 border-b">
                  <th className="py-2 px-1">Title</th>
                  <th className="py-2 px-1 hidden sm:table-cell">Instructor</th>
                  <th className="py-2 px-1">Students</th>
                  <th className="py-2 px-1 hidden md:table-cell">Price</th>
                </tr>
              </thead>
              <tbody>
                {recentCourses.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-neutral-50">
                    <td className="py-2 px-1 truncate">{c.title}</td>
                    <td className="py-2 px-1 text-neutral-600 hidden sm:table-cell truncate">
                      {c.instructor.name}
                    </td>
                    <td className="py-2 px-1 text-neutral-600">{c.students}</td>
                    <td className="py-2 px-1 text-neutral-600 hidden md:table-cell">
                      {(c.price * 0.043).toFixed(2)} USD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <h3 className="font-semibold text-sm md:text-base mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button
              className="w-full text-sm"
              onClick={() => navigate("/admin/courses/new")}
            >
              Create Course
            </Button>
            <Button
              className="w-full text-sm"
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </Button>
            <Button
              className="w-full text-sm"
              onClick={() => alert("Exported report")}
            >
              Export Reports
            </Button>
          </div>
        </Card>
      </div>
      <div className="pt-4 md:pt-6">
        <p className="text-xs text-neutral-500">
          Tip: add filters and charts as needed. This dashboard is a starting
          point — tell me which sections you want detailed (e.g., revenue chart,
          user cohorts, course quality).
        </p>
      </div>
    </div>
  );
}
