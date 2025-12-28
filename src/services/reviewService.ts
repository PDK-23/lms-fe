import { get, post, put, del, type PageResponse } from "@/lib/api";
import type { Review } from "@/types";

// Backend Review DTO
interface ReviewDTO {
  id: number;
  courseId: number;
  userId: number;
  studentName?: string;
  rating: number;
  comment?: string;
  helpful: number;
  createdAt: string;
  updatedAt?: string;
}

// Transform backend DTO to frontend type
function toReview(dto: ReviewDTO): Review {
  return {
    id: String(dto.id),
    courseId: String(dto.courseId),
    studentName: dto.studentName || "Anonymous",
    rating: dto.rating,
    comment: dto.comment || "",
    date: new Date(dto.createdAt),
    helpful: dto.helpful,
  };
}

export async function getReviews(): Promise<Review[]> {
  const response = await get<PageResponse<ReviewDTO>>("/reviews", {
    page: 0,
    size: 1000,
  });
  return response.content.map(toReview);
}

export async function getReviewsPaginated(
  page = 0,
  size = 10
): Promise<PageResponse<Review>> {
  const response = await get<PageResponse<ReviewDTO>>("/reviews", {
    page,
    size,
  });
  return {
    ...response,
    content: response.content.map(toReview),
  };
}

export async function getReviewById(id: string): Promise<Review | null> {
  try {
    const data = await get<ReviewDTO>(`/reviews/${id}`);
    return toReview(data);
  } catch {
    return null;
  }
}

export async function getByCourseId(courseId: string): Promise<Review[]> {
  const data = await get<ReviewDTO[]>(`/reviews/course/${courseId}`);
  return data.map(toReview);
}

export async function getByCourseIdPaginated(
  courseId: string,
  page = 0,
  size = 10
): Promise<PageResponse<Review>> {
  const response = await get<PageResponse<ReviewDTO>>(
    `/reviews/course/${courseId}/paginated`,
    { page, size }
  );
  return {
    ...response,
    content: response.content.map(toReview),
  };
}

export async function addReview(payload: {
  courseId: string;
  studentName: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const dto = {
    courseId: Number(payload.courseId),
    userId: 1, // TODO: Get from auth context
    studentName: payload.studentName,
    rating: payload.rating,
    comment: payload.comment,
  };
  const data = await post<ReviewDTO>("/reviews", dto);
  return toReview(data);
}

export async function updateReview(
  id: string,
  payload: Partial<{ rating: number; comment: string }>
): Promise<Review> {
  const data = await put<ReviewDTO>(`/reviews/${id}`, payload);
  return toReview(data);
}

export async function deleteReview(id: string): Promise<void> {
  await del(`/reviews/${id}`);
}

export async function markHelpful(id: string): Promise<Review> {
  const data = await post<ReviewDTO>(`/reviews/${id}/helpful`);
  return toReview(data);
}

// Compatibility functions for existing code
function _loadAll(): Review[] {
  // This is now a no-op since we use the API
  return [];
}

function _saveAll(_items: Review[]): void {
  // This is now a no-op since we use the API
}

export default {
  getByCourseId,
  getByCourseIdPaginated,
  addReview,
  updateReview,
  deleteReview,
  markHelpful,
  getReviews,
  getReviewsPaginated,
  getReviewById,
  _loadAll,
  _saveAll,
};
