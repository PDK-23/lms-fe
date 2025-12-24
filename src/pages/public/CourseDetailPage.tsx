import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui";
import courseService from "@/services/courseService";
import reviewService from "@/services/reviewService";
import type { Review, Course, Section } from "@/types";
import { Curriculum } from "@/components/course/CourseDetail";
import cartService from "@/services/cartService";
import RelatedCourses from "@/components/course/RelatedCourses";
import Reviews from "@/components/course/Reviews";

export default function CourseDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params.id || "";
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [courseData, reviewsData, allCourses] = await Promise.all([
        courseService.getCourseById(id),
        reviewService.getByCourseId(id),
        courseService.getCourses(),
      ]);

      setCourse(courseData);
      setReviews(reviewsData);

      if (courseData) {
        // Get sections from course data; fallback to fetching sections separately when backend doesn't return them
        if (!courseData.sections || courseData.sections.length === 0) {
          try {
            const fetchedSections = await courseService.getSections(id);
            setSections(fetchedSections || []);
          } catch (err) {
            console.error("Failed to fetch sections:", err);
            setSections([]);
          }
        } else {
          setSections(courseData.sections);
        }

        // Get related courses
        const related = allCourses
          .filter(
            (c) =>
              c.category.id === courseData.category.id && c.id !== courseData.id
          )
          .slice(0, 4);
        setRelatedCourses(related);

        // Get instructor's other courses
        const instructorOther = allCourses
          .filter(
            (c) =>
              c.instructor.id === courseData.instructor.id &&
              c.id !== courseData.id
          )
          .slice(0, 3);
        setInstructorCourses(instructorOther);
      }
    } catch (error) {
      console.error("Failed to fetch course details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddReview = async (payload: {
    studentName: string;
    rating: number;
    comment: string;
  }) => {
    try {
      const newReview = await reviewService.addReview({
        courseId: id,
        ...payload,
      });
      setReviews((prev) => [newReview, ...prev]);
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              <div className="mt-4 sm:block md:hidden">
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
                  Learning
                </button>
              </div>
            </div>
            <div className="md:col-span-4 col-span-1 hidden md:block">
              <div className="sticky md:top-20 top-4">
                <div className="absolute p-4 md:border-2 bg-white rounded-lg z-20">
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
        {/* <aside className="md:col-span-4 col-span-1">
          <div className="sticky md:top-24 top-4 space-y-6">
            {instructorCourses.length > 0 && (
              <RelatedCourses
                courses={instructorCourses}
                title={t("course.moreFromInstructor")}
              />
            )}
            {relatedCourses.length > 0 && (
              <RelatedCourses
                courses={relatedCourses}
                title={t("course.relatedCourses")}
              />
            )}
          </div>
        </aside> */}
      </div>
    </div>
  );
}
