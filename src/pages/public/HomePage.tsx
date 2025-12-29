import { Button } from "@/components/ui";
import {
  CourseCard,
  CategoryCard,
  InstructorCard,
  SearchBar,
} from "@/components/course";
import courseService from "@/services/courseService";
import categoryService from "@/services/categoryService";
import userService from "@/services/userService";
import { type Course, type Category, type Instructor } from "@/types";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export function HomePage() {
  const [_searchQuery, setSearchQuery] = useState("");
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [coursesData, categoriesData, instructorsData] = await Promise.all([
        courseService
          .getFeaturedCourses()
          .catch(() => courseService.getCourses()),
        categoryService.getCategories(),
        userService
          .getUsersByRole("INSTRUCTOR", 0, 5)
          .catch(() => ({ content: [] })),
      ]);
      setFeaturedCourses(coursesData.slice(0, 4));
      setCategories(categoriesData.slice(0, 8));
      // Map backend User objects to Instructor shape expected by UI
      const mappedInstructors = (instructorsData.content || []).map((u) => ({
        id: String(u.id),
        name: u.name,
        avatar:
          u.avatar ||
          `https://placehold.co/128x128?text=${encodeURIComponent(
            (u.name || "Instructor").split(" ")[0]
          )}`,
        bio: u.bio || "",
        rating: 0,
        totalRatings: 0,
        students: 0,
        isVerified: !!u.isActive,
      }));
      setInstructors(mappedInstructors);
    } catch (error) {
      console.error("Failed to fetch home page data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEnroll = (courseId: string) => {
    console.log("Enrolling in course:", courseId);
    // TODO: Implement enrollment logic
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    setSearchQuery(query);
    // TODO: Implement search logic
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Learn how AI is a busy teacher's best friend
              </h1>
              <p className="text-lg text-primary-100 mb-6">
                Master new skills with expert-led courses. Learn at your own
                pace and transform your career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-neutral-100"
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-primary-700"
                >
                  Explore Courses
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center w-full aspect-video">
              <img
                src="https://images.pexels.com/photos/5427671/pexels-photo-5427671.jpeg"
                className="aspect-video rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="What do you want to learn today?"
            className="w-full"
          />
        </div>
      </section>

      {/* Key Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              iconUrl: "https://placehold.co/64x64?text=Launch",
              title: "Launch Your Career",
              desc: "30 million+ enrollments worldwide",
            },
            {
              iconUrl: "https://placehold.co/64x64?text=Business",
              title: "Business Skills",
              desc: "Gain in-demand job skills",
            },
            {
              iconUrl: "https://placehold.co/64x64?text=Instructors",
              title: "Expert Instructors",
              desc: "Learn from industry leaders",
            },
            {
              iconUrl: "https://placehold.co/64x64?text=Cert",
              title: "Get Certified",
              desc: "Earn recognized credentials",
            },
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <img
                src={feature.iconUrl}
                alt={feature.title}
                className="w-12 h-12 mb-4 mx-auto"
              />
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-neutral-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Courses</h2>
          <a
            href="/courses"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            View All
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
                variant="compact"
              />
            ))
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Explore Categories</h2>
          <p className="text-neutral-600">
            Browse our most popular course categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Top Instructors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Top Instructors</h2>
          <a
            href="/instructors"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            View All
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-700 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start learning?
          </h2>
          <p className="text-lg mb-8 text-secondary-100">
            Join millions of learners and transform your future today.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="bg-white text-secondary-600 hover:bg-neutral-100"
          >
            Explore All Courses
          </Button>
        </div>
      </section>
    </div>
  );
}
