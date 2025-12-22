import { type Course } from "@/types";
import { Card, CardContent, Badge, Button } from "@/components/ui";
import { Star, Users, Clock, TrendingUp } from "lucide-react";
import {
  formatPrice,
  formatRating,
  calculateDiscountPercentage,
} from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  variant?: "default" | "compact";
}

export function CourseCard({
  course,
  onEnroll,
  variant = "default",
}: CourseCardProps) {
  const showDiscount =
    course.originalPrice && course.originalPrice > course.price;
  const discountPercentage = showDiscount
    ? calculateDiscountPercentage(course.price, course.originalPrice!)
    : 0;
  const navigate = useNavigate();

  if (variant === "compact") {
    return (
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-elevation transition-all duration-200"
        onClick={() => {
          console.log("Navigate to course detail page");
          // navigate(`/courses/${course.id}`);
        }}
      >
        <div className="relative">
          <div className="w-full aspect-video bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <img
              src={course.category.icon}
              alt={course.category.name}
              className="w-full aspect-video object-cover rounded"
            />
          </div>
          {course.isBestseller && (
            <Badge variant="warning" className="absolute top-2 right-2">
              Bestseller
            </Badge>
          )}
          {showDiscount && (
            <div className="absolute top-2 left-2 bg-danger-500 text-white px-2 py-1 rounded text-xs font-bold">
              -{discountPercentage}%
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-warning-500 text-warning-500" />
            <span className="text-sm font-semibold">
              {formatRating(course.rating)}
            </span>
            <span className="text-xs text-neutral-600">
              ({course.totalRatings.toLocaleString()})
            </span>
          </div>

          <h3 className="font-bold text-sm line-clamp-2 mb-2">
            {course.title}
          </h3>

          <p className="text-xs text-neutral-600 mb-3">
            {course.instructor.name}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-primary-600">
                {formatPrice(course.price)}
              </span>
              {showDiscount && (
                <span className="text-xs text-neutral-500 line-through">
                  {formatPrice(course.originalPrice!)}
                </span>
              )}
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => onEnroll?.(course.id)}
            >
              Enroll
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-elevation transition-all duration-200"
      onClick={() => {
        navigate(`/courses/${course.id}`);
      }}
    >
      <div className="relative">
        <div className="w-full aspect-video bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <img
            src={course.category.icon}
            alt={course.category.name}
            className="w-full aspect-video object-cover rounded"
          />
        </div>

        {course.isBestseller && (
          <Badge variant="warning" className="absolute top-3 right-3">
            Bestseller
          </Badge>
        )}

        {course.isTrending && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-secondary-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            <TrendingUp className="w-4 h-4" />
            Trending
          </div>
        )}

        {showDiscount && (
          <div className="absolute bottom-3 left-3 bg-danger-500 text-white px-3 py-1 rounded font-bold text-sm">
            -{discountPercentage}%
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="primary">{course.category.name}</Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning-500 text-warning-500" />
            <span className="text-sm font-semibold">
              {formatRating(course.rating)}
            </span>
            <span className="text-xs text-neutral-600">
              ({course.totalRatings.toLocaleString()})
            </span>
          </div>
        </div>

        <h3 className="font-bold text-lg line-clamp-2 mb-2">{course.title}</h3>

        <p className="text-sm text-neutral-600 mb-4">
          {course.instructor.name}
        </p>

        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Users className="w-4 h-4" />
            <span>{course.students.toLocaleString()} students</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Clock className="w-4 h-4" />
            <span>{course.duration} hours</span>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-lg text-primary-600">
              {formatPrice(course.price)}
            </span>
            {showDiscount && (
              <span className="text-sm text-neutral-500 line-through">
                {formatPrice(course.originalPrice!)}
              </span>
            )}
          </div>
          <Button variant="primary" onClick={() => onEnroll?.(course.id)}>
            Enroll Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
