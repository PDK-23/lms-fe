import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui";
import ALL_COURSES from "@/mocks/courses";
import reviewService from "@/services/reviewService";
import type { Review } from "@/types";
import { Curriculum } from "@/components/course/CourseDetail";
import cartService from "@/services/cartService";
import RelatedCourses from "@/components/course/RelatedCourses";
import Reviews from "@/components/course/Reviews";

export default function CourseDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params.id || "";
  const navigate = useNavigate();
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

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!id) return;
    setReviews(reviewService.getByCourseId(id));
  }, [id]);

  const handleAddReview = (payload: {
    studentName: string;
    rating: number;
    comment: string;
  }) => {
    const newReview = reviewService.addReview({ courseId: id, ...payload });
    setReviews((prev) => [newReview, ...prev]);
  };

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
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-white">
            <div className="md:col-span-8 col-span-1 md:min-h-[200px]">
              <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
              <div className="text-sm md:text-base mt-1">
                {course.rating} ⭐ • {course.totalRatings} ratings •{" "}
                {course.students} students
              </div>
              <div className="mt-4">{course.description}</div>
              <div className="mt-4">
                <div className="text-2xl font-bold">
                  {(course.price * 23000).toLocaleString("vi-VN")} ₫
                </div>
                <button
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                  onClick={() => {
                    cartService.addToCart(course);
                    navigate("/cart");
                  }}
                >
                  {t("cta.enroll")}
                </button>
                <button
                  onClick={() => {
                    navigate("learn");
                  }}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    navigate("learn");
                  }}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Learning
                </button>
              </div>
            </div>
            <div className="md:col-span-4 col-span-1 hidden md:block">
              <div className="sticky md:top-20 top-4">
                <div className="absolute p-4 md:border-2 bg-white rounded-lg">
                  <div>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full rounded-lg aspect-video object-cover"
                    />
                    <div className="text-black mt-4">
                      <div className="text-lg font-semibold">
                        {course.title}
                      </div>
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
                        <button
                          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                          onClick={() => {
                            cartService.addToCart(course);
                            navigate("/cart");
                          }}
                        >
                          {t("cta.enroll")}
                        </button>
                        <button
                          onClick={() => {
                            navigate("learn");
                          }}
                          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => {
                            navigate("learn");
                          }}
                          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                        >
                          Learning
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12 gap-6">
        <div className="md:col-span-8 col-span-1 space-y-8">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              {t("course.curriculum")}
            </h2>
            <Curriculum sections={sections} />
          </div>
          <Reviews reviews={reviews} onAdd={handleAddReview} />
        </div>
        <aside className="md:col-span-4 col-span-1">
          <div className="sticky md:top-24 top-4 space-y-6">
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
