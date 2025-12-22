import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

const items = [
  { to: "/settings", label: "header.profile" },
  { to: "/my-courses", label: "header.myCourses" },
  { to: "/purchases", label: "header.purchases" },
  { to: "/certificates", label: "header.certificates" },
];

export default function UserMenu() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const doLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-2"
        aria-haspopup
        aria-expanded={open}
      >
        <span className="sr-only">{t("header.profile")}</span>
        <div className="w-5 h-5 bg-neutral-200 rounded-full flex items-center justify-center text-sm text-neutral-700">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline text-sm text-neutral-700">
          {user.name}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-md shadow-lg py-1 z-50">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              {t(it.label)}
            </Link>
          ))}
          <button
            onClick={doLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-50"
          >
            {t("header.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
