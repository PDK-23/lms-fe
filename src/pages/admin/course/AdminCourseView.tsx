import { Input } from "@/components/ui";
import {
  Form,
  Select,
  Modal,
  message,
  Button as AntButton,
  Tooltip,
} from "antd";
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
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);

  // Reusable forms at component scope to avoid calling hooks inside callbacks
  const [sectionForm] = Form.useForm();
  const [lessonForm] = Form.useForm();

  const fetchCourse = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [c, sectionsData] = await Promise.all([
        courseService.getCourseById(id),
        courseService.getSections(id),
      ]);

      // Normalize sections/lessons to avoid runtime errors when backend returns null
      const normalized = {
        ...c,
        sections: (c?.sections || []).map((s) => ({
          ...s,
          lessons: s?.lessons || [],
        })),
      } as Course | null;

      setCourseData(normalized);
      setSections(sectionsData);
    } catch (error) {
      console.error("Failed to fetch course:", error);
      setCourseData(null);
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

      console.log("Fetched quizzes:", practicesData);
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

  const showDeleteSectionConfirm = useCallback(
    (sec: Section) => {
      Modal.confirm({
        title: "Confirm Delete",
        content: `Are you sure you want to delete section "${sec.title}"? This will also remove its lessons.`,
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          if (!courseData) return;
          try {
            await courseService.deleteSection(courseData.id, sec.id);
            message.success("Section deleted");
            fetchCourse();
          } catch (error) {
            console.error("Failed to delete section:", error);
          }
        },
      });
    },
    [courseData, fetchCourse]
  );

  const showDeleteLessonConfirm = useCallback(
    (sectionId: string, lessonId: string) => {
      Modal.confirm({
        title: "Confirm Delete",
        content: "Are you sure you want to delete this lesson?",
        okText: "Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk: async () => {
          if (!courseData) return;
          try {
            await courseService.deleteLesson(
              courseData.id,
              sectionId,
              lessonId
            );
            message.success("Lesson deleted");
            fetchCourse();
          } catch (error) {
            console.error("Failed to delete lesson:", error);
          }
        },
      });
    },
    [courseData, fetchCourse]
  );

  // Section editor implemented as a modal.confirm wrapper with a compact form
  const showSectionEditor = useCallback(
    (sec?: Section) => {
      if (!courseData) return;
      sectionForm.resetFields();
      sectionForm.setFieldsValue({ title: sec?.title || "" });
      Modal.confirm({
        title: sec ? "Edit Section" : "Add Section",
        content: (
          <Form form={sectionForm} layout="vertical">
            <Form.Item
              name="title"
              label="Section Title"
              rules={[
                { required: true, message: "Please enter section title" },
              ]}
            >
              <Input placeholder="Enter section title" />
            </Form.Item>
          </Form>
        ),
        okText: "Save",
        onOk: async () => {
          try {
            const values = await sectionForm.validateFields();
            const s =
              sec ||
              ({
                id: Date.now().toString(),
                title: "",
                lessons: [],
              } as Section);
            s.title = values.title;
            if (sec) {
              await courseService.updateSection(courseData.id, s.id, s);
              message.success("Section updated");
            } else {
              await courseService.addSection(courseData.id, s);
              message.success("Section added");
            }
            sectionForm.resetFields();
            fetchCourse();
          } catch (e) {
            // validation failed or save failed
            throw e;
          }
        },
      });
    },
    [courseData, fetchCourse]
  );

  // Lesson editor implemented as modal.confirm with a compact form
  const showLessonEditor = useCallback(
    (sectionId: string, lesson?: Lesson) => {
      if (!courseData) return;
      // use component-scoped lessonForm to avoid calling hooks inside callbacks
      lessonForm.resetFields();
      lessonForm.setFieldsValue({
        title: lesson?.title || "",
        type: (lesson?.type as any) || "video",
        duration: lesson?.duration || 0,
        videoUrl: lesson?.videoUrl || "",
        quizId: lesson?.quizId || "",
        practiceId: lesson?.practiceId || "",
        practiceLanguage: "javascript",
      });

      Modal.confirm({
        width: 600,
        title: lesson ? "Edit Lesson" : "Add Lesson",
        content: (
          <Form form={lessonForm} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter lesson title" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Video", value: "video" },
                  { label: "Quiz", value: "quiz" },
                  { label: "Code Practice", value: "practice" },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration (minutes)"
              rules={[{ required: true }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item noStyle dependencies={["type"]}>
              {({ getFieldValue }) =>
                getFieldValue("type") === "video" ? (
                  <Form.Item name="videoUrl" label="Video URL">
                    <Input />
                  </Form.Item>
                ) : null
              }
            </Form.Item>

            <Form.Item noStyle dependencies={["type"]}>
              {({ getFieldValue }) =>
                getFieldValue("type") === "quiz" ? (
                  <Form.Item name="quizId" label="Quiz">
                    <Select
                      options={[
                        { label: "-- Create New Quiz --", value: "__new__" },
                        ...quizzes.map((q) => ({
                          label: q.title,
                          value: q.id,
                        })),
                      ]}
                      onChange={(v) => {
                        if (v === "__new__") {
                          Modal.destroyAll();
                          navigate("/admin/quizzes/new");
                        }
                      }}
                    />
                  </Form.Item>
                ) : null
              }
            </Form.Item>

            <Form.Item noStyle dependencies={["type"]}>
              {({ getFieldValue }) =>
                getFieldValue("type") === "practice" ? (
                  <>
                    <Form.Item name="practiceId" label="Practice">
                      <Select
                        options={[
                          {
                            label: "-- Create New Practice --",
                            value: "__new__",
                          },
                          ...practices.map((p) => ({
                            label: `${p.title} (${p.slug})`,
                            value: p.id,
                          })),
                        ]}
                        onChange={(v) => {
                          if (v === "__new__") {
                            Modal.destroyAll();
                            navigate("/admin/practices/new");
                          }
                        }}
                      />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
          </Form>
        ),
        okText: "Save",
        onOk: async () => {
          try {
            const values = await lessonForm.validateFields();
            const l =
              lesson ||
              ({
                id: Date.now().toString(),
                title: "",
                duration: 0,
                type: "video",
              } as Lesson);
            l.title = values.title;
            l.type = values.type;
            l.duration = values.duration;
            l.videoUrl = values.videoUrl || undefined;
            l.quizId = values.quizId || undefined;
            l.practiceId = values.practiceId || undefined;
            l.practiceLanguage = values.practiceLanguage || undefined;

            if (lesson) {
              await courseService.updateLesson(
                courseData.id,
                sectionId,
                l.id,
                l
              );
              message.success("Lesson updated");
            } else {
              await courseService.addLesson(courseData.id, sectionId, l);
              message.success("Lesson added");
            }
            fetchCourse();
          } catch (e) {
            throw e;
          }
        },
      });
    },
    [courseData, fetchCourse, navigate, quizzes, practices, lessonForm]
  );

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
        await courseService.reorderSections(
          courseData.id,
          moved.map((s) => s.id)
        );
        message.success("Sections reordered");
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
          await courseService.reorderLessons(
            courseData.id,
            fromSectionId,
            moved.map((l) => l.id)
          );
          message.success("Lessons reordered");
          fetchCourse();
          return;
        }

        // moving across sections
        const fromLessons = Array.from(fromSection.lessons);
        const [removed] = fromLessons.splice(source.index, 1);
        const toLessons = Array.from(toSection.lessons);
        toLessons.splice(destination.index, 0, removed);
        await courseService.reorderLessons(
          courseData.id,
          fromSectionId,
          fromLessons.map((l) => l.id)
        );
        await courseService.reorderLessons(
          courseData.id,
          toSectionId,
          toLessons.map((l) => l.id)
        );
        message.success("Lessons reordered");
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
        <Tooltip title="Back to courses">
          <AntButton
            type="text"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate("/admin/courses")}
            aria-label="Back to courses"
            size="small"
          />
        </Tooltip>
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
          <Tooltip title="Back to courses">
            <AntButton
              type="text"
              icon={<ArrowLeft className="w-5 h-5" />}
              onClick={() => navigate("/admin/courses")}
              aria-label="Back to courses"
              size="small"
            />
          </Tooltip>
          <h2 className="text-2xl font-semibold">{courseData.title}</h2>
        </div>
      </div>

      <div className="space-y-6">
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
      </div>

      <div className="">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-4">Content</h3>
          <div className="flex gap-2 mb-4">
            <Tooltip title="Add Section">
              <AntButton
                className="flex items-center"
                onClick={() => showSectionEditor()}
                icon={<Plus className="w-4 h-4" />}
                shape="circle"
                aria-label="Add Section"
                size="small"
              />
            </Tooltip>
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
                  {(sections || []).map((sec, sIdx) => (
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
                              <Tooltip title="Edit Section">
                                <AntButton
                                  type="text"
                                  icon={<Edit2 className="w-4 h-4" />}
                                  onClick={() => showSectionEditor(sec)}
                                  aria-label={`Edit section ${sec.title}`}
                                  size="small"
                                />
                              </Tooltip>
                              <Tooltip title="Delete Section">
                                <AntButton
                                  type="text"
                                  danger
                                  icon={<Trash2 className="w-4 h-4" />}
                                  onClick={() => showDeleteSectionConfirm(sec)}
                                  aria-label={`Delete section ${sec.title}`}
                                  size="small"
                                />
                              </Tooltip>
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
                                          <Tooltip title="View Lesson">
                                            <Link
                                              to={`/courses/${courseData.id}/learn/lesson/${lesson.id}`}
                                              aria-label={`View ${lesson.title}`}
                                              title="View Lesson"
                                            >
                                              <AntButton
                                                icon={
                                                  <Eye className="w-4 h-4" />
                                                }
                                                shape="circle"
                                                size="small"
                                              />
                                            </Link>
                                          </Tooltip>
                                          <Tooltip title="Edit Lesson">
                                            <AntButton
                                              icon={
                                                <Edit2 className="w-4 h-4" />
                                              }
                                              onClick={() =>
                                                showLessonEditor(sec.id, lesson)
                                              }
                                              size="small"
                                            />
                                          </Tooltip>
                                          <Tooltip title="Delete Lesson">
                                            <AntButton
                                              type="text"
                                              danger
                                              icon={
                                                <Trash2 className="w-4 h-4" />
                                              }
                                              onClick={() =>
                                                showDeleteLessonConfirm(
                                                  sec.id,
                                                  lesson.id
                                                )
                                              }
                                              size="small"
                                            />
                                          </Tooltip>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {providedLessons.placeholder}

                                <div className="px-4 py-3">
                                  <Tooltip title="Add Lesson">
                                    <AntButton
                                      icon={<Plus className="w-4 h-4" />}
                                      onClick={() => showLessonEditor(sec.id)}
                                      shape="circle"
                                      size="small"
                                      aria-label="Add Lesson"
                                    />
                                  </Tooltip>
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
      </div>

      <div className="flex justify-end">
        <Tooltip title="Edit Course">
          <AntButton
            type="text"
            icon={<Edit2 className="w-4 h-4" />}
            onClick={() => navigate(`/admin/courses/${courseData.id}`)}
            aria-label="Edit Course"
            size="small"
          />
        </Tooltip>
      </div>
    </div>
  );
}
