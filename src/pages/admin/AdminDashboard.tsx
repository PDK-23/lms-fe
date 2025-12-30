import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import courseService from "@/services/courseService";
import dashboardService from "@/services/dashboardService";
import type { Course } from "@/types";
import type { Dashboard } from "@/types/dashboard";
import {
  Users,
  BookOpen,
  BarChart3,
  DollarSign,
  PlusCircle,
  Download,
} from "lucide-react";

// Charts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();

    // fetch dashboard data (charts) - fall back to existing mock data if API fails
    const fetchDashboard = async () => {
      try {
        const data = await dashboardService.getDashboard();
        setDashboard(data);
      } catch (err) {
        console.warn("Failed to fetch dashboard data, using client mock", err);
      }
    };
    fetchDashboard();
  }, [fetchCourses]);

  const getStat = (id: string, fallback: string | number) =>
    dashboard?.stats?.find((s) => s.id === id)?.value ?? fallback;

  const stats = [
    {
      id: "courses",
      label: "Courses",
      value: getStat("courses", courses.length),
      icon: BookOpen,
      delta:
        dashboard?.stats?.find((s) => s.id === "courses")?.delta ??
        "+3 this week",
    },
    {
      id: "students",
      label: "Students",
      value: getStat("students", 45230),
      icon: Users,
      delta:
        dashboard?.stats?.find((s) => s.id === "students")?.delta ?? "+1.2%",
    },
    {
      id: "revenue",
      label: "Revenue (USD)",
      value: getStat("revenue", "$72,400"),
      icon: DollarSign,
      delta: dashboard?.stats?.find((s) => s.id === "revenue")?.delta ?? "+8%",
    },
    {
      id: "engagement",
      label: "Engagement",
      value: getStat("engagement", "72%"),
      icon: BarChart3,
      delta:
        dashboard?.stats?.find((s) => s.id === "engagement")?.delta ?? "+4%",
    },
  ];

  const recentCourses = courses.slice(0, 5);
  const recentEnrollments = [
    {
      id: 1,
      user: "Anh Tran",
      course: courses[0]?.title || "Course A",
      date: "2 hours ago",
    },
    {
      id: 2,
      user: "Minh Le",
      course: courses[1]?.title || "Course B",
      date: "1 day ago",
    },
    {
      id: 3,
      user: "Linh Nguyen",
      course: courses[2]?.title || "Course C",
      date: "2 days ago",
    },
  ];

  // If the backend returns recent courses, normalize them to a consistent shape for the table
  const displayRecentCourses =
    dashboard?.recentCourses ??
    recentCourses.map((c) => ({
      id: c.id,
      title: c.title,
      instructor: c.instructor.name,
      students: c.students,
      price: c.price,
    }));

  const displayRecentEnrollments =
    dashboard?.recentEnrollments ?? recentEnrollments;

  // --- Mock chart data (replace with real API data when available) ---
  const lineData = useMemo(() => {
    const labels = dashboard?.weeklyLabels ?? [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];
    const data = dashboard?.weeklyActive ?? [
      3420, 3600, 4000, 3800, 4300, 4400, 4720,
    ];
    return {
      labels,
      datasets: [
        {
          label: "Active Users",
          data,
          borderColor: "#4f46e5",
          backgroundColor: "rgba(79,70,229,0.15)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [dashboard]);

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "#f3f4f6" } },
      },
    }),
    []
  );

  const barData = useMemo(() => {
    const labels = dashboard?.categoryLabels ?? [
      "Design",
      "Development",
      "Marketing",
      "Business",
    ];
    const data = dashboard?.categoryEnrollments ?? [120, 210, 90, 150];
    return {
      labels,
      datasets: [
        {
          label: "Enrollments",
          data,
          backgroundColor: ["#60a5fa", "#34d399", "#fbbf24", "#f97316"],
        },
      ],
    };
  }, [dashboard]);

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "#f3f4f6" } },
      },
    }),
    []
  );

  const doughnutData = useMemo(() => {
    const labels = dashboard?.subscriptionLabels ?? [
      "Free",
      "Paid",
      "Subscription",
    ];
    const data = dashboard?.subscriptionData ?? [42, 38, 20];
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#60a5fa", "#a78bfa", "#34d399"],
        },
      ],
    };
  }, [dashboard]);

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    }),
    []
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
        <div className="lg:col-span-2 p-3 md:p-4 h-[400px]">
          <h3 className="font-semibold text-sm md:text-base mb-3 md:mb-4">
            Weekly Active Users
          </h3>
          <div className="w-full h-[80%]">
            <Line options={lineOptions} data={lineData} className="h-full" />
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
        </div>

        <div className="p-3 md:p-4">
          <h3 className="font-semibold text-sm md:text-base">Categories</h3>
          <div className="mt-4 h-[320px]">
            <Bar options={barOptions} data={barData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="p-3 md:p-4 col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="font-semibold text-sm md:text-base">
              Recent Courses
            </h3>
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
                {displayRecentCourses.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-neutral-50">
                    <td className="py-4 px-1 truncate">{c.title}</td>
                    <td className="py-4 px-1 text-neutral-600 hidden sm:table-cell truncate">
                      {c.instructor}
                    </td>
                    <td className="py-4 px-1 text-neutral-600">{c.students}</td>
                    <td className="py-4 px-1 text-neutral-600 hidden md:table-cell">
                      {(c.price * 0.043).toFixed(2)} USD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-3 md:p-4">
          <h3 className="font-semibold text-sm md:text-base mb-3">
            User Subscription Types
          </h3>

          <div className="mb-4 h-[300px]">
            <Doughnut options={doughnutOptions} data={doughnutData} />
          </div>
        </div>
      </div>
      <div className="!mt-0">
        <p className="text-xs text-neutral-500">
          Tip: add filters and charts as needed. This dashboard is a starting
          point — tell me which sections you want detailed (e.g., revenue chart,
          user cohorts, course quality).
        </p>
      </div>
    </div>
  );
}
