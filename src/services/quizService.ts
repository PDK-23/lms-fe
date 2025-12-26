import { get, post, put, del, type PageResponse } from "@/lib/api";
import type { Quiz, QuizQuestion } from "@/types";

// Backend Quiz DTO
interface QuizDTO {
  id: number;
  title: string;
  description?: string;
  courseId?: number;
  passingScore: number;
  duration: number;
  questions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Transform backend DTO to frontend type
function toQuiz(dto: QuizDTO): Quiz {
  let questions: QuizQuestion[] = [];
  try {
    if (dto.questions) {
      questions = JSON.parse(dto.questions);
    }
  } catch {
    // Ignore parse errors
  }

  return {
    id: String(dto.id),
    title: dto.title,
    courseId: dto.courseId ? String(dto.courseId) : "",
    passingScore: dto.passingScore,
    duration: dto.duration,
    questions,
  };
}

// Transform frontend type to backend DTO
function toQuizDTO(quiz: Partial<Quiz>): Partial<QuizDTO> {
  return {
    title: quiz.title,
    courseId: quiz.courseId ? Number(quiz.courseId) : undefined,
    passingScore: quiz.passingScore,
    duration: quiz.duration,
    questions: quiz.questions ? JSON.stringify(quiz.questions) : undefined,
  };
}

export async function getQuizzes(): Promise<Quiz[]> {
  const response = await get<PageResponse<QuizDTO>>("/quizzes", {
    page: 0,
    size: 1000,
  });
  return response.content.map(toQuiz);
}

export async function getQuizzesPaginated(
  page = 0,
  size = 10
): Promise<PageResponse<Quiz>> {
  const response = await get<PageResponse<QuizDTO>>("/quizzes", { page, size });
  return {
    ...response,
    content: response.content.map(toQuiz),
  };
}

export async function getQuizById(id: string): Promise<Quiz | null> {
  try {
    const data = await get<QuizDTO>(`/quizzes/${id}`);
    return toQuiz(data);
  } catch {
    return null;
  }
}

export async function getQuizzesByCourse(courseId: string): Promise<Quiz[]> {
  const data = await get<QuizDTO[]>(`/quizzes/course/${courseId}`);
  return data.map(toQuiz);
}

export async function searchQuizzes(
  keyword: string,
  page = 0,
  size = 10
): Promise<PageResponse<Quiz>> {
  const response = await get<PageResponse<QuizDTO>>("/quizzes/search", {
    keyword,
    page,
    size,
  });
  return {
    ...response,
    content: response.content.map(toQuiz),
  };
}

export async function addQuiz(quiz: Omit<Quiz, "id">): Promise<Quiz> {
  const dto = toQuizDTO(quiz);
  const data = await post<QuizDTO>("/quizzes", dto);
  return toQuiz(data);
}

export async function updateQuiz(
  id: string,
  quiz: Partial<Quiz>
): Promise<Quiz> {
  const dto = toQuizDTO(quiz);
  const data = await put<QuizDTO>(`/quizzes/${id}`, dto);
  return toQuiz(data);
}

export async function deleteQuiz(id: string): Promise<void> {
  await del(`/quizzes/${id}`);
}

export default {
  getQuizzes,
  getQuizzesPaginated,
  getQuizById,
  getQuizzesByCourse,
  searchQuizzes,
  addQuiz,
  updateQuiz,
  deleteQuiz,
};
