import { get, post, put, del, type PageResponse } from "@/lib/api";
import type { Category } from "@/types";

// Backend Category entity mapping
interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: number;
  isActive: boolean;
  sortOrder: number;
  courseCount?: number;
  createdAt: string;
  updatedAt?: string;
}

// Transform backend DTO to frontend type
function toCategory(dto: CategoryDTO): Category {
  return {
    id: String(dto.id),
    name: dto.name,
    icon: dto.icon || "📚",
    color: dto.color || "#3B82F6",
    courseCount: dto.courseCount || 0,
    parentId: dto.parentId ? String(dto.parentId) : undefined,
  };
}

// Transform frontend type to backend DTO
function toCategoryDTO(category: Partial<Category>): Partial<CategoryDTO> {
  return {
    name: category.name,
    icon: category.icon,
    color: category.color,
    parentId: category.parentId ? Number(category.parentId) : undefined,
  };
}

export async function getCategories(): Promise<Category[]> {
  const data = await get<CategoryDTO[]>("/categories/root");
  return data?.map(toCategory) || [];
}

export async function getCategoriesPaginated(
  page = 0,
  size = 10
): Promise<PageResponse<Category>> {
  const response = await get<PageResponse<CategoryDTO>>("/categories", {
    page,
    size,
  });
  return {
    ...response,
    content: response.content.map(toCategory),
  };
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const data = await get<CategoryDTO>(`/categories/${id}`);
    return toCategory(data);
  } catch {
    return null;
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const data = await get<CategoryDTO>(`/categories/slug/${slug}`);
    return toCategory(data);
  } catch {
    return null;
  }
}

export async function addCategory(
  category: Omit<Category, "id" | "courseCount">
): Promise<Category> {
  const dto = toCategoryDTO(category);
  const data = await post<CategoryDTO>("/categories", dto);
  return toCategory(data);
}

export async function updateCategory(
  id: string,
  category: Partial<Category>
): Promise<Category> {
  const dto = toCategoryDTO(category);
  const data = await put<CategoryDTO>(`/categories/${id}`, dto);
  return toCategory(data);
}

export async function deleteCategory(id: string): Promise<void> {
  await del(`/categories/${id}`);
}

export default {
  getCategories,
  getCategoriesPaginated,
  getCategoryById,
  getCategoryBySlug,
  addCategory,
  updateCategory,
  deleteCategory,
};
