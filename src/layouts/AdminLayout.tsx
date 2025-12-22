import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Home,
  Users,
  BookOpen,
  BarChart3,
  LogOut,
  Menu,
  X,
  Medal,
  Tag as TagIcon,
  Clipboard,
} from "lucide-react";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: ".", label: "Dashboard", icon: Home, end: true },
    { to: "courses", label: "Courses", icon: BookOpen },
    { to: "quizzes", label: "Quizzes", icon: Clipboard },
    { to: "categories", label: "Categories", icon: BookOpen },
    { to: "tags", label: "Tags", icon: TagIcon },
    { to: "specializations", label: "Specializations", icon: Medal },
    { to: "certificates", label: "Certificates", icon: Medal },
    { to: "users", label: "Users", icon: Users },
    { to: "reports", label: "Reports", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b sticky top-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold px-2 text-sm">
                LMS
              </div>
            </Link>
            <div className="font-bold text-sm">Admin</div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-neutral-100 rounded"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex gap-4 px-3 md:px-4 py-4">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative left-0 top-16 md:top-0 w-64 bg-white border rounded-lg p-4 h-[calc(100vh-80px)] md:h-[calc(100vh-48px)] transition-transform duration-300 z-40 ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } md:sticky md:top-4`}
        >
          <div className="mb-6 hidden md:block">
            <div className="flex gap-1 items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold px-2">
                  LMS
                </div>
              </Link>
              <div className="font-bold">Admin</div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded text-sm ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-6 pt-4 border-t text-sm text-neutral-500 px-3">
            <button className="flex items-center gap-2 w-full text-left hover:text-neutral-700">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full md:flex-1">
          <div className="bg-white border rounded-lg p-4 md:p-6 min-h-[70vh]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
