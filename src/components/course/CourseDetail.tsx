import { Card } from "@/components/ui";
import { Play } from "lucide-react";
import type { Course, Section } from "@/types";
import { useState } from "react";

export function Curriculum({ sections }: { sections: Section[] }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  return (
    <div className="divide-y-2 border-zinc-500">
      {sections.map((s) => (
        <div key={s.id} className="border-zinc-300">
          <div className="bg-zinc-200">
            <button
              onClick={() =>
                setOpenSections((p) => ({ ...p, [s.id]: !p[s.id] }))
              }
              aria-expanded={!!openSections[s.id]}
              className="w-full flex items-center justify-between font-medium text-neutral-800 p-4"
            >
              <div className="flex gap-4 items-center">
                <svg
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    openSections[s.id] ? "rotate-90" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                </svg>
                <div>{s.title}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-neutral-500">
                  {s.lessons?.length ?? 0} lessons
                </div>
              </div>
            </button>

            <div
              className={`overflow-hidden transition-[max-height] duration-200 ease-in-out ${
                openSections[s.id] ? "max-h-96" : "max-h-0"
              }`}
            >
              {s.lessons && s.lessons.length > 0 ? (
                <ul className="divide-y border-zinc-300">
                  {s.lessons.map((l) => (
                    <li
                      key={l.id}
                      className="flex items-center justify-between px-4 py-2 bg-zinc-50 border-x hover:bg-zinc-100 cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        {(l.type ?? "video") === "video" && (
                          <Play
                            className="w-4 h-4 text-neutral-500"
                            aria-hidden="true"
                          />
                        )}
                        <div>
                          <div className="font-medium text-sm">{l.title}</div>
                          <div className="text-xs text-neutral-500">
                            {l.duration} min
                          </div>
                        </div>
                      </div>
                      <div className="text-green-600">
                        {l.isCompleted ? "✓" : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-2 text-sm text-neutral-500">
                  No lessons yet
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function InstructorBlock({ course }: { course: Course }) {
  const { instructor } = course;
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <img
          src={instructor.avatar}
          alt={instructor.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <div className="font-bold">{instructor.name}</div>
          <div className="text-sm text-neutral-600">{instructor.bio}</div>
          <div className="text-sm text-neutral-500 mt-2">
            {instructor.students} students
          </div>
        </div>
      </div>
    </Card>
  );
}
