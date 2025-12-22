import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CATEGORIES } from "@/lib/constants";
import { CategoryCard } from "@/components/course";

export default function CategoryMenu() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (panelRef.current && btnRef.current) {
        if (
          !panelRef.current.contains(e.target as Node) &&
          !btnRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // close on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((s) => !s)}
        className="text-neutral-700 hover:text-primary-600 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {t("header.browse")}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute left-0 top-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 w-[min(90vw,56rem)] max-w-3xl p-6"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className="text-left w-full"
                onClick={() => {
                  navigate(`/courses?category=${cat.id}`);
                  setOpen(false);
                }}
              >
                <CategoryCard category={cat} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
