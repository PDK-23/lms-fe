import { get, post, put, del, type PageResponse } from "@/lib/api";
import type { Specialization } from "@/types";

// Backend Specialization DTO
interface SpecializationDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  courseIds?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
}

// Transform backend DTO to frontend type
function toSpecialization(dto: SpecializationDTO): Specialization {
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description,
    courseIds: dto.courseIds
      ? dto.courseIds.split(",").map((id) => id.trim())
      : undefined,
  };
}

// Transform frontend type to backend DTO
function toSpecializationDTO(
  spec: Partial<Specialization>
): Partial<SpecializationDTO> {
  return {
    name: spec.name,
    description: spec.description,
    courseIds: spec.courseIds?.join(","),
  };
}

export async function getSpecializations(): Promise<Specialization[]> {
  const data = await get<SpecializationDTO[]>("/specializations/all");
  return data.map(toSpecialization);
}

export async function getSpecializationsPaginated(
  page = 0,
  size = 10
): Promise<PageResponse<Specialization>> {
  const response = await get<PageResponse<SpecializationDTO>>(
    "/specializations",
    { page, size }
  );
  return {
    ...response,
    content: response.content.map(toSpecialization),
  };
}

export async function getActive(): Promise<Specialization[]> {
  const data = await get<SpecializationDTO[]>("/specializations/active");
  return data.map(toSpecialization);
}

export async function getSpecializationById(
  id: string
): Promise<Specialization | null> {
  try {
    const data = await get<SpecializationDTO>(`/specializations/${id}`);
    return toSpecialization(data);
  } catch {
    return null;
  }
}

export async function getSpecializationBySlug(
  slug: string
): Promise<Specialization | null> {
  try {
    const data = await get<SpecializationDTO>(`/specializations/slug/${slug}`);
    return toSpecialization(data);
  } catch {
    return null;
  }
}

export async function addSpecialization(
  spec: Omit<Specialization, "id">
): Promise<Specialization> {
  const dto = toSpecializationDTO(spec);
  const data = await post<SpecializationDTO>("/specializations", dto);
  return toSpecialization(data);
}

export async function updateSpecialization(
  id: string,
  spec: Partial<Specialization>
): Promise<Specialization> {
  const dto = toSpecializationDTO(spec);
  const data = await put<SpecializationDTO>(`/specializations/${id}`, dto);
  return toSpecialization(data);
}

export async function deleteSpecialization(id: string): Promise<void> {
  await del(`/specializations/${id}`);
}

export default {
  getSpecializations,
  getSpecializationsPaginated,
  getActive,
  getSpecializationById,
  getSpecializationBySlug,
  addSpecialization,
  updateSpecialization,
  deleteSpecialization,
};
