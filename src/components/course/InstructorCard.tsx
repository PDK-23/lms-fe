import { type Instructor } from "@/types";
import { Card, CardContent, Badge } from "@/components/ui";
import { Star, CheckCircle } from "lucide-react";
import { formatRating } from "@/lib/utils";

interface InstructorCardProps {
  instructor: Instructor;
  onClick?: (instructorId: string) => void;
}

export function InstructorCard({ instructor, onClick }: InstructorCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 text-center"
      onClick={() => onClick?.(instructor.id)}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex justify-center">
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>

        <div className="flex items-center justify-center gap-2 mb-1">
          <h3 className="font-bold text-lg">{instructor.name}</h3>
          {instructor.isVerified && (
            <CheckCircle className="w-5 h-5 text-success-500 fill-success-100" />
          )}
        </div>

        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {instructor.bio}
        </p>

        <div className="flex justify-center gap-4 py-3 border-y border-neutral-200 mb-3">
          <div>
            <p className="font-bold text-primary-600">
              {formatRating(instructor.rating)}
            </p>
            <p className="text-xs text-neutral-600">Rating</p>
          </div>
          <div>
            <p className="font-bold text-primary-600">
              {(instructor.students / 1000).toFixed(1)}K
            </p>
            <p className="text-xs text-neutral-600">Students</p>
          </div>
        </div>

        <Badge variant="primary" className="w-full text-center justify-center">
          View Profile
        </Badge>
      </CardContent>
    </Card>
  );
}
