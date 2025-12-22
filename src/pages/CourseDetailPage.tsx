import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui";
import ALL_COURSES from "@/mocks/courses";
import MOCK_REVIEWS from "@/mocks/reviews";
import { Curriculum, InstructorBlock } from "@/components/course/CourseDetail";
import RelatedCourses from "@/components/course/RelatedCourses";
import Reviews from "@/components/course/Reviews";

export default function CourseDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params.id || "";

  const course = ALL_COURSES.find((c) => c.id === id);

  // simple mock: generate sections if none
  const sections = useMemo(() => {
    if (!course) return [];
    return [
      {
        id: "s1",
        title: "Getting started",
        lessons: [
          { id: "l1", title: "Intro", duration: 5 },
          { id: "l2", title: "Setup", duration: 10 },
        ],
      },
      {
        id: "s2",
        title: "Core concepts",
        lessons: [
          { id: "l3", title: "Topic A", duration: 20 },
          { id: "l4", title: "Topic B", duration: 25 },
        ],
      },
    ];
  }, [course]);

  const reviews = MOCK_REVIEWS.filter((r) => r.courseId === id);
  const instructorOtherCourses = ALL_COURSES.filter(
    (c) => c.instructor.id === course?.instructor.id && c.id !== course?.id
  ).slice(0, 3);
  const related = ALL_COURSES.filter(
    (c) => c.category.id === course?.category.id && c.id !== course?.id
  ).slice(0, 4);

  if (!course) {
    return (
      <div className="py-12">
        <Card className="max-w-4xl mx-auto p-6">{t("course.notFound")}</Card>
      </div>
    );
  }

  return (
    <div className="">
      <div className="gap-8 bg-zinc-800">
        <div className="max-w-7xl mx-auto w-full px-8 py-12">
          <div className="grid grid-cols-12 gap-6 text-white">
            <div className="col-span-8 h-[250px]">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <div className="text-sm mt-1">
                {course.rating} ⭐ • {course.totalRatings} ratings •{" "}
                {course.students} students
              </div>
              <div className="mt-4">{course.description}</div>
            </div>
            <div className="col-span-4 bg-white rounded-lg">
              <div className="sticky top-4 p-4">
                <div className="">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="rounded-lg"
                  />
                  <div className="text-black mt-4">
                    <div className="text-lg font-semibold">{course.title}</div>
                    <div className="mt-2 text-sm">
                      <div>
                        {course.rating} ⭐ • {course.totalRatings} ratings
                      </div>
                      <div>{course.students.toLocaleString()} students</div>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl font-bold">
                        {(course.price * 23000).toLocaleString("vi-VN")} ₫
                      </div>
                      <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                        {t("cta.enroll")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 max-w-7xl mx-auto w-full px-8 py-12 gap-6">
        <div className="col-span-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">
              {t("course.curriculum")}
            </h2>
            <Curriculum sections={sections} />
          </div>
          <Reviews reviews={reviews} />
        </div>
        <aside className="col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* <InstructorBlock instructor={course.instructor} /> */}
            {instructorOtherCourses.length > 0 && (
              <RelatedCourses
                courses={instructorOtherCourses}
                title={t("course.moreFromInstructor")}
              />
            )}
            {related.length > 0 && (
              <RelatedCourses
                courses={related}
                title={t("course.relatedCourses")}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
