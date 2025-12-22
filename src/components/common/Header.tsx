import { Button } from "@/components/ui";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CATEGORIES } from "@/lib/constants";
import { useAppStore } from "@/store/useAppStore";
import { useAuth } from "@/hooks/useAuth";
import SearchBox from "@/components/common/SearchBox";
import UserMenu from "@/components/common/UserMenu";
import NavLinks from "@/components/common/NavLinks";
import CategoryMenu from "@/components/common/CategoryMenu";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // use persisted language from Zustand store
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const { user, logout } = useAuth();

  // logout handled inside UserMenu component

  const languageOptions = [
    { value: "en", label: "EN" },
    { value: "vi", label: "VI" },
  ];

  const userMenuOptions = [
    { to: "/my-courses", label: "header.myCourses" },
    { to: "/about", label: "header.about" },
    { to: "/settings", label: "header.profile" },
    { to: "/purchases", label: "header.purchases" },
    { to: "/certificates", label: "header.certificates" },
    {
      action: () => {
        logout();
        navigate("/login");
      },
      label: "header.logout",
      danger: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold px-2">
                  LMS
                </div>
              </Link>
              <div className="hidden md:flex items-center gap-8 text-sm">
                <div className="relative">
                  {/* Category menu (shadcn-like) */}
                  <CategoryMenu />
                </div>

                <NavLinks className="" />
                <SearchBox />
              </div>
            </div>

            {/* Desktop Navigation */}

            {/* Right Actions */}
            <div className="hidden sm:flex items-center gap-4">
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors relative">
                <ShoppingCart className="w-5 h-5 text-neutral-600" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
              <UserMenu />

              {/* Language Switcher */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent border border-neutral-200 rounded-md px-2 py-1 text-sm"
                aria-label={t("header.language")}
              >
                {languageOptions.map((lo) => (
                  <option key={lo.value} value={lo.value}>
                    {lo.label}
                  </option>
                ))}
              </select>

              {!user && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  {t("header.signIn")}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <div className="px-4">
              {/* mobile search */}
              <SearchBox mobile />
            </div>
            <details className="group">
              <summary className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer">
                {t("header.browse")}
              </summary>
              <div className="px-4 py-2 grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/courses?category=${cat.id}`}
                    className="block px-3 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </details>

            {userMenuOptions.map((item, idx) =>
              item.to ? (
                <Link
                  key={idx}
                  to={item.to}
                  className="block px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {t(item.label)}
                </Link>
              ) : (
                <button
                  key={idx}
                  onClick={() => {
                    item.action?.();
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 ${
                    item.danger ? "text-red-600" : "text-neutral-700"
                  }`}
                >
                  {t(item.label)}
                </button>
              )
            )}

            <div className="px-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full mb-3 bg-transparent border border-neutral-200 rounded-md px-2 py-2 text-sm"
              >
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
              </select>

              {!user && (
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => navigate("/login")}
                >
                  {t("header.signIn")}
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
