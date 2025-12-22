import { useState } from "react";
import { ChevronDown, ChevronUp, Play, Clock, Check } from "lucide-react";
import type { Section, Lesson } from "@/types";

interface VideoLessonPlayerProps {
  sections: Section[];
  currentLesson?: Lesson;
  onLessonSelect: (lesson: Lesson) => void;
}

export function VideoLessonPlayer({
  sections,
  currentLesson,
  onLessonSelect,
}: VideoLessonPlayerProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    [sections[0]?.id]: true,
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const getTotalLessons = () => {
    return sections.reduce((sum, s) => sum + (s.lessons?.length || 0), 0);
  };

  const getCompletedLessons = () => {
    return sections.reduce((sum, s) => {
      const completed = s.lessons?.filter((l) => l.isCompleted).length || 0;
      return sum + completed;
    }, 0);
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-200 p-4">
        <h3 className="font-bold text-lg text-neutral-900">Course Contents</h3>
        <p className="text-sm text-neutral-600 mt-1">
          {getCompletedLessons()} of {getTotalLessons()} lessons completed
        </p>
        <div className="mt-3 bg-neutral-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-300"
            style={{
              width: `${(getCompletedLessons() / getTotalLessons()) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Sections List */}
      <div className="overflow-y-auto flex-1">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-neutral-200">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-neutral-900">
                    {section.title}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    {section.lessons?.length || 0} lessons
                  </p>
                </div>
              </div>
              {expandedSections[section.id] ? (
                <ChevronUp className="w-4 h-4 text-neutral-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-600 flex-shrink-0" />
              )}
            </button>

            {/* Lessons List */}
            {expandedSections[section.id] && (
              <div className="bg-neutral-50">
                {section.lessons?.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => onLessonSelect(lesson)}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors border-l-2 ${
                      currentLesson?.id === lesson.id
                        ? "bg-indigo-50 border-l-indigo-600"
                        : "hover:bg-neutral-100 border-l-transparent"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {lesson.isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <Play className="w-4 h-4 text-neutral-400 fill-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {idx + 1}. {lesson.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-500 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{lesson.duration}m</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
