import { get, post, put, del, type PageResponse } from "@/lib/api";
import type { Module } from "@/types";

// Backend Module DTO
interface ModuleDTO {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  url?: string;
  moduleGroupId: number;
  isActive: boolean;
  sortOrder: number;
  createdById?: number;
  createdAt: string;
  updatedById?: number;
  updatedAt?: string;
}

// Transform backend DTO to frontend type
function toModule(dto: ModuleDTO): Module {
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description,
    icon: dto.icon,
    url: dto.url || "",
    moduleGroupId: String(dto.moduleGroupId),
    createdById: dto.createdById ? String(dto.createdById) : "",
    createdAt: new Date(dto.createdAt),
    updatedById: dto.updatedById ? String(dto.updatedById) : undefined,
    updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
  };
}

// Transform frontend type to backend DTO
function toModuleDTO(module: Partial<Module>): Partial<ModuleDTO> {
  return {
    name: module.name,
    description: module.description,
    icon: module.icon,
    url: module.url,
    moduleGroupId: module.moduleGroupId
      ? Number(module.moduleGroupId)
      : undefined,
  };
}

export async function getAll(): Promise<Module[]> {
  const data = await get<ModuleDTO[]>("/modules/all");
  return data.map(toModule);
}

export async function getAllPaginated(
  page = 0,
  size = 10
): Promise<PageResponse<Module>> {
  const response = await get<PageResponse<ModuleDTO>>("/modules", {
    page,
    size,
  });
  return {
    ...response,
    content: response.content.map(toModule),
  };
}

export async function getActive(): Promise<Module[]> {
  const data = await get<ModuleDTO[]>("/modules/active");
  return data.map(toModule);
}

export async function getById(id: string): Promise<Module | null> {
  try {
    const data = await get<ModuleDTO>(`/modules/${id}`);
    return toModule(data);
  } catch {
    return null;
  }
}

export async function getByModuleGroupId(groupId: string): Promise<Module[]> {
  const data = await get<ModuleDTO[]>(`/modules/group/${groupId}`);
  return data.map(toModule);
}

export async function add(
  payload: Omit<Module, "id" | "createdAt">
): Promise<Module> {
  const dto = toModuleDTO(payload);
  const data = await post<ModuleDTO>("/modules", dto);
  return toModule(data);
}

export async function update(
  id: string,
  payload: Partial<Omit<Module, "id" | "createdAt">>
): Promise<Module> {
  const dto = toModuleDTO(payload);
  const data = await put<ModuleDTO>(`/modules/${id}`, dto);
  return toModule(data);
}

export async function remove(id: string): Promise<void> {
  await del(`/modules/${id}`);
}

export default {
  getAll,
  getAllPaginated,
  getActive,
  getById,
  getByModuleGroupId,
  add,
  update,
  remove,
};
