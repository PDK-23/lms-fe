import { get, post, put, del, type PageResponse } from "@/lib/api";
import type { Practice } from "@/types";

// Backend Practice DTO
interface PracticeDTO {
  id: number;
  title: string;
  slug: string;
  description?: string;
  difficulty: string;
  defaultLanguage?: string;
  tags?: string;
  externalUrl?: string;
  templates?: string;
  testCases?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Transform backend DTO to frontend type
function toPractice(dto: PracticeDTO): Practice {
  let templates: { [lang: string]: string } | undefined;
  let tests: { input: string; output: string }[] | undefined;

  try {
    // Backend may return templates as JSON string (legacy) or as an array of DTOs
    if (dto.templates) {
      if (typeof dto.templates === "string") {
        templates = JSON.parse(dto.templates);
      } else if (Array.isArray(dto.templates)) {
        templates = (dto.templates as any[]).reduce((acc, t) => {
          if (t && t.language) acc[t.language] = t.template || "";
          return acc;
        }, {} as { [lang: string]: string });
      }
    }

    // testCases can be a JSON string or an array of DTOs
    if (dto.testCases) {
      if (typeof dto.testCases === "string") {
        // parsed may be an array of objects
        const parsed = JSON.parse(dto.testCases);
        if (Array.isArray(parsed)) {
          tests = parsed
            .slice()
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .map((tc) => ({
              input: tc.input,
              output: tc.output,
              isHidden: !!tc.isHidden,
            }));
        }
      } else if (Array.isArray(dto.testCases)) {
        tests = (dto.testCases as any[])
          .slice()
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map((tc) => ({
            input: tc.input,
            output: tc.output,
            isHidden: !!tc.isHidden,
          }));
      }
    }
  } catch {
    // Ignore parse errors
  }

  return {
    id: String(dto.id),
    title: dto.title,
    slug: dto.slug,
    description: dto.description,
    difficulty: dto.difficulty?.toLowerCase() as "easy" | "medium" | "hard",
    defaultLanguage: dto.defaultLanguage,
    tags: dto?.tags
      ? Array.isArray(dto.tags)
        ? dto.tags.map((t) => String(t).trim())
        : String(dto.tags)
            .split(",")
            .map((t) => t.trim())
      : undefined,
    externalUrl: dto.externalUrl,
    templates,
    tests,
  };
}

// Transform frontend type to backend DTO
function toPracticeDTO(practice: Partial<Practice>): Partial<PracticeDTO> {
  return {
    title: practice.title,
    slug: practice.slug,
    description: practice.description,
    difficulty: practice.difficulty?.toUpperCase(),
    defaultLanguage: practice.defaultLanguage,
    tags: practice.tags?.join(", "),
    externalUrl: practice.externalUrl,
    templates: practice.templates
      ? JSON.stringify(practice.templates)
      : undefined,
    testCases: practice.tests ? JSON.stringify(practice.tests) : undefined,
  };
}

export async function getPractices(): Promise<Practice[]> {
  const response = await get<PageResponse<PracticeDTO>>("/practices", {
    page: 0,
    size: 1000,
  });
  console.log("Fetched practices:", response);
  return response.content.map(toPractice);
}

export async function getPracticesPaginated(
  page = 0,
  size = 10
): Promise<PageResponse<Practice>> {
  const response = await get<PageResponse<PracticeDTO>>("/practices", {
    page,
    size,
  });
  return {
    ...response,
    content: response.content.map(toPractice),
  };
}

export async function getPracticeById(id: string): Promise<Practice | null> {
  try {
    const data = await get<PracticeDTO>(`/practices/${id}`);
    return toPractice(data);
  } catch {
    return null;
  }
}

export async function getPracticeBySlug(
  slug: string
): Promise<Practice | null> {
  try {
    const data = await get<PracticeDTO>(`/practices/slug/${slug}`);
    return toPractice(data);
  } catch {
    return null;
  }
}

export async function getPracticesByDifficulty(
  difficulty: string,
  page = 0,
  size = 10
): Promise<PageResponse<Practice>> {
  const response = await get<PageResponse<PracticeDTO>>(
    `/practices/difficulty/${difficulty}`,
    { page, size }
  );
  return {
    ...response,
    content: response.content.map(toPractice),
  };
}

export async function searchPractices(
  keyword: string,
  page = 0,
  size = 10
): Promise<PageResponse<Practice>> {
  const response = await get<PageResponse<PracticeDTO>>("/practices/search", {
    keyword,
    page,
    size,
  });
  return {
    ...response,
    content: response.content.map(toPractice),
  };
}

export async function addPractice(
  practice: Omit<Practice, "id">
): Promise<Practice> {
  const dto = toPracticeDTO(practice);
  const data = await post<PracticeDTO>("/practices", dto);
  return toPractice(data);
}

export async function updatePractice(
  id: string,
  practice: Partial<Practice>
): Promise<Practice> {
  const dto = toPracticeDTO(practice);
  const data = await put<PracticeDTO>(`/practices/${id}`, dto);
  return toPractice(data);
}

export async function deletePractice(id: string): Promise<void> {
  await del(`/practices/${id}`);
}

export default {
  getPractices,
  getPracticesPaginated,
  getPracticeById,
  getPracticeBySlug,
  getPracticesByDifficulty,
  searchPractices,
  addPractice,
  updatePractice,
  deletePractice,
};
