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
    <div className="min-h-screen">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-neutral-600">
              Overview of site metrics and recent activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="flex items-center gap-2"
              onClick={() => navigate("/admin/courses/new")}
            >
              <PlusCircle className="w-4 h-4" />
              New Course
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={() => alert("Exported CSV")}
            >
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-neutral-500">{s.label}</div>
                  <div className="text-2xl font-bold mt-1">{s.value}</div>
                  <div className="text-xs text-green-600 mt-2">{s.delta}</div>
                </div>
                <div className="bg-neutral-100 rounded p-3">
                  <s.icon className="w-6 h-6 text-neutral-700" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-4">
            <h3 className="font-semibold mb-4">Weekly Active Users</h3>
            <div className="w-full h-40">
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

            <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
              <div>
                Active users this week:{" "}
                <span className="font-semibold text-neutral-900">34,210</span>
              </div>
              <div className="mx-2">•</div>
              <div>
                New signups:{" "}
                <span className="font-semibold text-neutral-900">1,320</span>
              </div>
              <div className="mx-2">•</div>
              <div>
                Avg. watch time:{" "}
                <span className="font-semibold text-neutral-900">21m</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Recent Enrollments</h3>
            <ul className="space-y-3 text-sm">
              {recentEnrollments.map((r) => (
                <li key={r.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.user}</div>
                    <div className="text-xs text-neutral-500">{r.course}</div>
                  </div>
                  <div className="text-xs text-neutral-400">{r.date}</div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Courses</h3>
              <Button size="sm" onClick={() => navigate("/admin/courses")}>
                Manage
              </Button>
            </div>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500">
                    <th className="py-2">Title</th>
                    <th className="py-2">Instructor</th>
                    <th className="py-2">Students</th>
                    <th className="py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCourses.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="py-3">{c.title}</td>
                      <td className="py-3 text-neutral-600">
                        {c.instructor.name}
                      </td>
                      <td className="py-3 text-neutral-600">{c.students}</td>
                      <td className="py-3 text-neutral-600">
                        {(c.price * 0.043).toFixed(2)} USD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => navigate("/admin/courses/new")}
              >
                Create Course
              </Button>
              <Button
                className="w-full"
                onClick={() => navigate("/admin/users")}
              >
                Manage Users
              </Button>
              <Button
                className="w-full"
                onClick={() => alert("Exported report")}
              >
                Export Reports
              </Button>
            </div>
          </Card>
        </div>

        <div className="pt-6">
          <p className="text-xs text-neutral-500">
            Tip: add filters and charts as needed. This dashboard is a starting
            point — tell me which sections you want detailed (e.g., revenue
            chart, user cohorts, course quality).
          </p>
        </div>
      </div>
    </div>
  );
}
