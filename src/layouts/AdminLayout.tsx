import { Link, NavLink, Outlet } from "react-router-dom";
import { Home, Users, BookOpen, BarChart3, LogOut } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex gap-4 px-4 py-4">
        <aside className="w-64 bg-white border rounded-lg p-4 sticky top-4 h-[calc(100vh-48px)]">
          <div className="mb-6">
            <div className="flex gap-1 items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold px-2">
                  LMS
                </div>
              </Link>
              <div className="font-bold"> Admin</div>
            </div>
          </div>

          <nav className="space-y-1">
            <NavLink
              to="."
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`
              }
            >
              <Home className="w-4 h-4" />{" "}
              <span className="text-sm">Dashboard</span>
            </NavLink>

            <NavLink
              to="courses"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`
              }
            >
              <BookOpen className="w-4 h-4" />{" "}
              <span className="text-sm">Courses</span>
            </NavLink>

            <NavLink
              to="users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`
              }
            >
              <Users className="w-4 h-4" />{" "}
              <span className="text-sm">Users</span>
            </NavLink>

            <NavLink
              to="reports"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`
              }
            >
              <BarChart3 className="w-4 h-4" />{" "}
              <span className="text-sm">Reports</span>
            </NavLink>
          </nav>

          <div className="mt-6 pt-4 border-t text-sm text-neutral-500">
            <button className="flex items-center gap-2 w-full text-left hover:text-neutral-700">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="bg-white border rounded-lg p-6 min-h-[70vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
