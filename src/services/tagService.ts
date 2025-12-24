import { get, post, put, del, type PageResponse } from "@/lib/api";
import type { Tag } from "@/types";

// Backend Tag DTO
interface TagDTO {
  id: number;
  name: string;
  slug: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Transform backend DTO to frontend type
function toTag(dto: TagDTO): Tag {
  return {
    id: String(dto.id),
    name: dto.name,
    color: dto.color,
  };
}

// Transform frontend type to backend DTO
function toTagDTO(tag: Partial<Tag>): Partial<TagDTO> {
  return {
    name: tag.name,
    color: tag.color,
  };
}

export async function getTags(): Promise<Tag[]> {
  const data = await get<TagDTO[]>("/tags/all");
  return data.map(toTag);
}

export async function getTagsPaginated(
  page = 0,
  size = 10
): Promise<PageResponse<Tag>> {
  const response = await get<PageResponse<TagDTO>>("/tags", { page, size });
  return {
    ...response,
    content: response.content.map(toTag),
  };
}

export async function getTagById(id: string): Promise<Tag | null> {
  try {
    const data = await get<TagDTO>(`/tags/${id}`);
    return toTag(data);
  } catch {
    return null;
  }
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    const data = await get<TagDTO>(`/tags/slug/${slug}`);
    return toTag(data);
  } catch {
    return null;
  }
}

export async function searchTags(
  keyword: string,
  page = 0,
  size = 10
): Promise<PageResponse<Tag>> {
  const response = await get<PageResponse<TagDTO>>("/tags/search", {
    keyword,
    page,
    size,
  });
  return {
    ...response,
    content: response.content.map(toTag),
  };
}

export async function addTag(tag: Omit<Tag, "id">): Promise<Tag> {
  const dto = toTagDTO(tag);
  const data = await post<TagDTO>("/tags", dto);
  return toTag(data);
}

export async function updateTag(id: string, tag: Partial<Tag>): Promise<Tag> {
  const dto = toTagDTO(tag);
  const data = await put<TagDTO>(`/tags/${id}`, dto);
  return toTag(data);
}

export async function deleteTag(id: string): Promise<void> {
  await del(`/tags/${id}`);
}

export default {
  getTags,
  getTagsPaginated,
  getTagById,
  getTagBySlug,
  searchTags,
  addTag,
  updateTag,
  deleteTag,
};
