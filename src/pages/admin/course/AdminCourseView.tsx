import { Card, Button, Input } from "@/components/ui";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Plus, Eye } from "lucide-react";
import * as courseService from "@/services/courseService";
import * as quizService from "@/services/quizService";
import * as practiceService from "@/services/practiceService";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import type { Course, Section, Lesson, Quiz, Practice } from "@/types";

export default function AdminCourseView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [sectionEditorOpen, setSectionEditorOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [confirmDeleteSection, setConfirmDeleteSection] =
    useState<Section | null>(null);

  const [lessonEditorOpen, setLessonEditorOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessonParentSection, setLessonParentSection] = useState<string | null>(
    null
  );
  const [confirmDeleteLesson, setConfirmDeleteLesson] = useState<{
    sectionId: string;
    lessonId: string;
  } | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const c = await courseService.getCourseById(id);
      setCourseData(c);
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRelatedData = useCallback(async () => {
    try {
      const [quizzesData, practicesData] = await Promise.all([
        quizService.getQuizzes(),
        practiceService.getPractices(),
      ]);
      setQuizzes(quizzesData);
      setPractices(practicesData);
    } catch (error) {
      console.error("Failed to fetch related data:", error);
    }
  }, []);

  useEffect(() => {
    fetchCourse();
    fetchRelatedData();
  }, [fetchCourse, fetchRelatedData]);

  const ensureSections = () => {
    if (!courseData) return [] as Section[];
    return courseData.sections || [];
  };

  async function onDragEnd(result: DropResult) {
    if (!result.destination || !courseData) return;

    const { source, destination, type } = result;

    if (type === "SECTION") {
      const sections = ensureSections();
      const moved = Array.from(sections);
      const [removed] = moved.splice(source.index, 1);
      moved.splice(destination.index, 0, removed);
      try {
        await courseService.reorderSections(courseData.id, moved.map(s => s.id));
        fetchCourse();
      } catch (error) {
        console.error("Failed to reorder sections:", error);
      }
      return;
    }

    // Lessons drag (within same or between sections)
    if (type === "LESSON") {
      const fromSectionId = source.droppableId;
      const toSectionId = destination.droppableId;
      const fromSection = ensureSections().find((s) => s.id === fromSectionId);
      const toSection = ensureSections().find((s) => s.id === toSectionId);
      if (!fromSection || !toSection) return;

      try {
        // moving within same section
        if (fromSectionId === toSectionId) {
          const moved = Array.from(fromSection.lessons);
          const [removed] = moved.splice(source.index, 1);
          moved.splice(destination.index, 0, removed);
          await courseService.reorderLessons(courseData.id, fromSectionId, moved.map(l => l.id));
          fetchCourse();
          return;
        }

        // moving across sections
        const fromLessons = Array.from(fromSection.lessons);
        const [removed] = fromLessons.splice(source.index, 1);
        const toLessons = Array.from(toSection.lessons);
        toLessons.splice(destination.index, 0, removed);
        await courseService.reorderLessons(courseData.id, fromSectionId, fromLessons.map(l => l.id));
        await courseService.reorderLessons(courseData.id, toSectionId, toLessons.map(l => l.id));
        fetchCourse();
      } catch (error) {
        console.error("Failed to reorder lessons:", error);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/admin/courses")}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="text-center py-8">
          <p className="text-neutral-600">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/courses")}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-semibold">{courseData.title}</h2>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="md:flex md:gap-6">
          <div className="w-full md:w-1/3">
            <img
              src={courseData.thumbnail}
              alt={courseData.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="mt-4">
              <p className="text-sm text-neutral-600">
                {courseData.category.name}
              </p>
              <p className="text-sm text-neutral-600">
                Instructor: {courseData.instructor.name}
              </p>
              <p className="text-sm text-neutral-600">
                Level: {courseData.level}
              </p>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <h3 className="text-lg font-semibold mb-2">Overview</h3>
            <p className="text-neutral-700 mb-4">{courseData.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <div className="text-neutral-600">Price</div>
                <div className="font-medium">
                  {courseData.price.toLocaleString()} VND
                </div>
              </div>
              <div>
                <div className="text-neutral-600">Duration</div>
                <div className="font-medium">{courseData.duration} hours</div>
              </div>
              <div>
                <div className="text-neutral-600">Students</div>
                <div className="font-medium">{courseData.students}</div>
              </div>
              <div>
                <div className="text-neutral-600">Rating</div>
                <div className="font-medium">
                  {courseData.rating} ({courseData.totalRatings})
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex gap-2 flex-wrap">
                {(courseData.tags || []).map((t: string) => (
                  <div
                    key={t}
                    className="px-3 py-1 bg-neutral-100 rounded-full text-sm"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="shadow-none hover:shadow-none">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-4">Content</h3>
          <div className="flex gap-2 mb-4">
            <Button
              className="flex gap-2 items-center"
              onClick={() => {
                setEditingSection(null);
                setSectionEditorOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              <span className="ml-2">Add Section</span>
            </Button>
          </div>
        </div>

        <div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections" type="SECTION">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {(courseData.sections || []).map((sec, sIdx) => (
                    <Draggable draggableId={sec.id} index={sIdx} key={sec.id}>
                      {(dr) => (
                        <div
                          ref={dr.innerRef}
                          {...dr.draggableProps}
                          className="bg-white border rounded-lg"
                        >
                          <div
                            className="flex items-center justify-between px-4 py-3"
                            {...dr.dragHandleProps}
                          >
                            <div className="flex items-center gap-3">
                              <div className="font-medium">{sec.title}</div>
                              <div className="text-xs text-neutral-500">
                                {sec.lessons.length} lessons
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingSection(sec);
                                  setSectionEditorOpen(true);
                                }}
                                className="p-1 hover:bg-neutral-100 rounded"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteSection(sec)}
                                className="p-1 hover:bg-neutral-100 rounded text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <Droppable droppableId={sec.id} type="LESSON">
                            {(providedLessons) => (
                              <div
                                ref={providedLessons.innerRef}
                                {...providedLessons.droppableProps}
                                className="bg-neutral-50 border-t border-neutral-100 rounded-b"
                              >
                                {sec.lessons.map((lesson, lIdx) => (
                                  <Draggable
                                    draggableId={lesson.id}
                                    index={lIdx}
                                    key={lesson.id}
                                  >
                                    {(drL) => (
                                      <div
                                        ref={drL.innerRef}
                                        {...drL.draggableProps}
                                        {...drL.dragHandleProps}
                                        className="md:flex items-center justify-between px-4 py-3 border-b last:border-b-0"
                                      >
                                        <div>
                                          <div className="font-medium flex items-center gap-2">
                                            {lesson.title}
                                            <span className="inline-block text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                                              {lesson.type || "video"}
                                            </span>
                                          </div>
                                          <div className="text-xs text-neutral-600">
                                            {lesson.duration} min
                                            {lesson.type === "video" &&
                                              lesson.videoUrl && (
                                                <span className="ml-2 text-neutral-500">
                                                  • {lesson.videoUrl}
                                                </span>
                                              )}
                                            {lesson.type === "quiz" &&
                                              lesson.quizId && (
                                                <span className="ml-2 text-neutral-500">
                                                  • Quiz: {lesson.quizId}
                                                </span>
                                              )}
                                            {lesson.type === "practice" &&
                                              lesson.practiceId && (
                                                <span className="ml-2 text-neutral-500">
                                                  • Practice:{" "}
                                                  {lesson.practiceId}
                                                </span>
                                              )}
                                          </div>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                          <Button size="sm">
                                            <Link
                                              to={`/courses/${courseData.id}/learn/lesson/${lesson.id}`}
                                              className="text-sm text-white hover:underline"
                                              aria-label={`View ${lesson.title}`}
                                              title="View Lesson"
                                            >
                                              <Eye className="w-4 h-4" />
                                            </Link>
                                          </Button>
                                          <Button
                                            size="sm"
                                            onClick={() => {
                                              setEditingLesson(lesson);
                                              setLessonParentSection(sec.id);
                                              setLessonEditorOpen(true);
                                            }}
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              setConfirmDeleteLesson({
                                                sectionId: sec.id,
                                                lessonId: lesson.id,
                                              })
                                            }
                                          >
                                            Delete
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {providedLessons.placeholder}

                                <div className="px-4 py-3">
                                  <Button
                                    onClick={() => {
                                      setEditingLesson(null);
                                      setLessonParentSection(sec.id);
                                      setLessonEditorOpen(true);
                                    }}
                                  >
                                    Add Lesson
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Card>

      {/* Section Editor Modal */}
      {sectionEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => setSectionEditorOpen(false)}
          />
          <div className="bg-white rounded-lg p-6 z-50 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">
              {editingSection ? "Edit Section" : "Add Section"}
            </h3>
            <Input
              value={editingSection?.title || ""}
              onChange={(e) =>
                setEditingSection((s) => ({
                  ...(s || {
                    id: Date.now().toString(),
                    title: "",
                    lessons: [],
                  }),
                  title: e.target.value,
                }))
              }
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setSectionEditorOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!courseData) return;
                  const sec = editingSection || {
                    id: Date.now().toString(),
                    title: "",
                    lessons: [],
                  };
                  try {
                    if (courseData.sections?.some((s) => s.id === sec.id)) {
                      await courseService.updateSection(courseData.id, sec.id, sec);
                    } else {
                      await courseService.addSection(courseData.id, sec);
                    }
                    setSectionEditorOpen(false);
                    fetchCourse();
                  } catch (error) {
                    console.error("Failed to save section:", error);
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Editor Modal */}
      {lessonEditorOpen && lessonParentSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => setLessonEditorOpen(false)}
          />
          <div className="bg-white rounded-lg p-6 z-50 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">
              {editingLesson ? "Edit Lesson" : "Add Lesson"}
            </h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm text-neutral-700 mb-1">
                  Title
                </label>
                <Input
                  value={editingLesson?.title || ""}
                  onChange={(e) =>
                    setEditingLesson((l) => ({
                      ...(l || {
                        id: Date.now().toString(),
                        title: "",
                        duration: 0,
                        type: "video",
                      }),
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-1">
                  Type
                </label>
                <select
                  value={(editingLesson as any)?.type || "video"}
                  onChange={(e) =>
                    setEditingLesson((l) => ({
                      ...(l || {
                        id: Date.now().toString(),
                        title: "",
                        duration: 0,
                      }),
                      type: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                >
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                  <option value="practice">Code Practice</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-neutral-700 mb-1">
                  Duration (min)
                </label>
                <Input
                  type="number"
                  value={editingLesson?.duration || 0}
                  onChange={(e) =>
                    setEditingLesson((l) => ({
                      ...(l || {
                        id: Date.now().toString(),
                        title: "",
                        duration: 0,
                      }),
                      duration: Number(e.target.value),
                    }))
                  }
                />
              </div>

              {/* Type-specific fields */}
              {(editingLesson as any)?.type === "video" && (
                <div>
                  <label className="block text-sm text-neutral-700 mb-1">
                    Video URL
                  </label>
                  <Input
                    value={editingLesson?.videoUrl || ""}
                    onChange={(e) =>
                      setEditingLesson((l) => ({
                        ...(l || {
                          id: Date.now().toString(),
                          title: "",
                          duration: 0,
                        }),
                        videoUrl: e.target.value,
                      }))
                    }
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
              )}

              {(editingLesson as any)?.type === "quiz" && (
                <div className="space-y-2">
                  <label className="block text-sm text-neutral-700 mb-1">
                    Quiz
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={(editingLesson as any)?.quizId || ""}
                      onChange={(e) =>
                        setEditingLesson((l) => ({
                          ...(l || {
                            id: Date.now().toString(),
                            title: "",
                            duration: 0,
                          }),
                          quizAvailable: true,
                          quizId: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border rounded"
                    >
                      <option value="">Select a quiz</option>
                      {quizzes.map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.title}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLessonEditorOpen(false);
                        navigate("/admin/quizzes/new");
                      }}
                    >
                      New
                    </Button>
                  </div>
                </div>
              )}

              {(editingLesson as any)?.type === "practice" && (
                <div className="space-y-2">
                  <label className="block text-sm text-neutral-700 mb-1">
                    Practice
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={(editingLesson as any)?.practiceId || ""}
                      onChange={(e) =>
                        setEditingLesson((l) => ({
                          ...(l || {
                            id: Date.now().toString(),
                            title: "",
                            duration: 0,
                          }),
                          practiceId: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border rounded"
                    >
                      <option value="">Select a practice</option>
                      {practices.map((p) => (
                        <option key={p.id} value={p.slug}>
                          {p.title} ({p.slug})
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLessonEditorOpen(false);
                        navigate("/admin/practices/new");
                      }}
                    >
                      New
                    </Button>
                  </div>

                  <label className="block text-sm text-neutral-700 mb-1">
                    Practice Language (optional)
                  </label>
                  <Input
                    value={(editingLesson as any)?.practiceLanguage || ""}
                    onChange={(e) =>
                      setEditingLesson((l) => ({
                        ...(l || {
                          id: Date.now().toString(),
                          title: "",
                          duration: 0,
                        }),
                        practiceLanguage: e.target.value,
                      }))
                    }
                    placeholder="javascript"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setLessonEditorOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!courseData || !lessonParentSection) return;
                  const l = editingLesson || {
                    id: Date.now().toString(),
                    title: "",
                    duration: 0,
                    type: "video",
                  };
                  // ensure type present
                  if (!(l as any).type) (l as any).type = "video";

                  try {
                    if (
                      courseData.sections
                        ?.find((s) => s.id === lessonParentSection)
                        ?.lessons.some((x) => x.id === l.id)
                    ) {
                      await courseService.updateLesson(
                        courseData.id,
                        lessonParentSection,
                        l.id,
                        l
                      );
                    } else {
                      await courseService.addLesson(
                        courseData.id,
                        lessonParentSection,
                        l
                      );
                    }
                    setLessonEditorOpen(false);
                    fetchCourse();
                  } catch (error) {
                    console.error("Failed to save lesson:", error);
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Section */}
      {confirmDeleteSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => setConfirmDeleteSection(null)}
          />
          <div className="bg-white rounded-lg p-6 z-50 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Are you sure you want to delete section "
              {confirmDeleteSection.title}"? This will also remove its lessons.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteSection(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (courseData) {
                    try {
                      await courseService.deleteSection(
                        courseData.id,
                        confirmDeleteSection.id
                      );
                      setConfirmDeleteSection(null);
                      fetchCourse();
                    } catch (error) {
                      console.error("Failed to delete section:", error);
                    }
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Lesson */}
      {confirmDeleteLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-40"
            onClick={() => setConfirmDeleteLesson(null)}
          />
          <div className="bg-white rounded-lg p-6 z-50 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Are you sure you want to delete this lesson?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDeleteLesson(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (courseData && confirmDeleteLesson) {
                    try {
                      await courseService.deleteLesson(
                        courseData.id,
                        confirmDeleteLesson.sectionId,
                        confirmDeleteLesson.lessonId
                      );
                      setConfirmDeleteLesson(null);
                      fetchCourse();
                    } catch (error) {
                      console.error("Failed to delete lesson:", error);
                    }
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/courses/${courseData.id}`)}
        >
          Edit Course
        </Button>
      </div>
    </div>
  );
}
