import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Card } from "@/components/ui";
import specializationService from "@/services/specializationService";
import courseService from "@/services/courseService";
import type { Specialization, Course } from "@/types";

export default function AdminSpecializationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [s, setS] = useState<Specialization | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [specialization, courses] = await Promise.all([
        specializationService.getSpecializationById(id),
        courseService.getCourses(),
      ]);
      if (specialization) {
        setS(specialization);
        setName(specialization.name || "");
        setDescription(specialization.description || "");
        setSelectedCourseIds(specialization.courseIds || []);
      }
      setAvailableCourses(courses);
    } catch (error) {
      console.error("Failed to fetch specialization:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!s) return <div>Specialization not found</div>;

  async function save() {
    try {
      setSaving(true);
      const updated: Specialization = {
        id: String(s!.id),
        name,
        description,
        courseIds: selectedCourseIds,
      };
      await specializationService.updateSpecialization(updated.id, updated);
      navigate("/admin/specializations");
    } catch (error) {
      console.error("Failed to update specialization:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-lg sm:text-xl font-semibold">Edit Specialization</h2>
      <Card className="p-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-neutral-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div ref={wrapperRef}>
            <label className="block text-sm mb-1">Courses</label>
            <div className="border rounded p-2">
              <div className="flex gap-2 flex-wrap mb-2">
                {selectedCourseIds.map((id) => {
                  const c = availableCourses.find((x) => x.id === id);
                  if (!c) return null;
                  return (
                    <div
                      key={id}
                      className="inline-flex items-center gap-2 bg-neutral-100 px-2 py-1 rounded text-sm"
                    >
                      <span className="max-w-xs truncate">{c.title}</span>
                      <button
                        className="text-xs text-neutral-500 hover:text-neutral-700"
                        onClick={() =>
                          setSelectedCourseIds((prev) =>
                            prev.filter((x) => x !== id)
                          )
                        }
                        aria-label={`Remove ${c.title}`}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>

              <Input
                placeholder="Search courses..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
              />

              {open && (
                <div className="border mt-1 rounded max-h-48 overflow-y-auto bg-white z-10">
                  {availableCourses
                    .filter(
                      (c) =>
                        c.title.toLowerCase().includes(query.toLowerCase()) ||
                        c.instructor.name
                          .toLowerCase()
                          .includes(query.toLowerCase())
                    )
                    .slice(0, 200)
                    .map((c) => {
                      const selected = selectedCourseIds.includes(c.id);
                      return (
                        <div
                          key={c.id}
                          className={`flex items-center justify-between px-3 py-2 hover:bg-neutral-50 cursor-pointer ${
                            selected ? "bg-neutral-100" : ""
                          }`}
                          onMouseDown={(e) => e.preventDefault()} // prevent input blur
                          onClick={() =>
                            setSelectedCourseIds((prev) =>
                              prev.includes(c.id)
                                ? prev.filter((id) => id !== c.id)
                                : [...prev, c.id]
                            )
                          }
                        >
                          <div>
                            <div className="text-sm">{c.title}</div>
                            <div className="text-xs text-neutral-500">
                              {c.instructor.name}
                            </div>
                          </div>
                          {selected && (
                            <div className="text-xs text-neutral-500">
                              Selected
                            </div>
                          )}
                        </div>
                      );
                    }) || (
                    <div className="p-2 text-xs text-neutral-500">
                      No results
                    </div>
                  )}
                </div>
              )}

              <div className="text-xs text-neutral-500 mt-1">
                Selected: {selectedCourseIds.length}
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
