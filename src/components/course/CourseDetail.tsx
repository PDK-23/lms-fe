import { Card } from "@/components/ui";
import type { Course, Section } from "@/types";
import { useState } from "react";

export function Curriculum({ sections }: { sections: Section[] }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-4">
      {sections.map((s) => (
        <Card key={s.id} className="p-4">
          <div>
            <button
              onClick={() =>
                setOpenSections((p) => ({ ...p, [s.id]: !p[s.id] }))
              }
              className="font-medium text-neutral-800"
            >
              {s.title}
            </button>
            <div className={`mt-2 ${openSections[s.id] ? "block" : "hidden"}`}>
              <ul className="space-y-2">
                {s.lessons.map((l) => (
                  <li key={l.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{l.title}</div>
                      <div className="text-xs text-neutral-500">
                        {l.duration} min
                      </div>
                    </div>
                    <div>{l.isCompleted ? "✓" : ""}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
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
