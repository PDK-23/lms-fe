import { get, post, put, del, type PageResponse } from "@/lib/api";
import type { ModuleGroup } from "@/types";

// Backend ModuleGroup DTO
interface ModuleGroupDTO {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  url?: string;
  isActive: boolean;
  sortOrder: number;
  createdById?: number;
  createdAt: string;
  updatedById?: number;
  updatedAt?: string;
}

// Transform backend DTO to frontend type
function toModuleGroup(dto: ModuleGroupDTO): ModuleGroup {
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description,
    icon: dto.icon || "📁",
    url: dto.url || "",
    createdById: dto.createdById ? String(dto.createdById) : "",
    createdAt: new Date(dto.createdAt),
    updatedById: dto.updatedById ? String(dto.updatedById) : undefined,
    updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
  };
}

// Transform frontend type to backend DTO
function toModuleGroupDTO(
  moduleGroup: Partial<ModuleGroup>
): Partial<ModuleGroupDTO> {
  return {
    name: moduleGroup.name,
    description: moduleGroup.description,
    icon: moduleGroup.icon,
    url: moduleGroup.url,
  };
}

export async function getAll(): Promise<ModuleGroup[]> {
  const data = await get<ModuleGroupDTO[]>("/module-groups/all");
  return data.map(toModuleGroup);
}

export async function getAllPaginated(
  page = 0,
  size = 10
): Promise<PageResponse<ModuleGroup>> {
  const response = await get<PageResponse<ModuleGroupDTO>>("/module-groups", {
    page,
    size,
  });
  return {
    ...response,
    content: response.content.map(toModuleGroup),
  };
}

export async function getActive(): Promise<ModuleGroup[]> {
  const data = await get<ModuleGroupDTO[]>("/module-groups/active");
  return data.map(toModuleGroup);
}

export async function getById(id: string): Promise<ModuleGroup | null> {
  try {
    const data = await get<ModuleGroupDTO>(`/module-groups/${id}`);
    return toModuleGroup(data);
  } catch {
    return null;
  }
}

export async function add(
  payload: Omit<ModuleGroup, "id" | "createdAt">
): Promise<ModuleGroup> {
  const dto = toModuleGroupDTO(payload);
  const data = await post<ModuleGroupDTO>("/module-groups", dto);
  return toModuleGroup(data);
}

export async function update(
  id: string,
  payload: Partial<Omit<ModuleGroup, "id" | "createdAt">>
): Promise<ModuleGroup> {
  const dto = toModuleGroupDTO(payload);
  const data = await put<ModuleGroupDTO>(`/module-groups/${id}`, dto);
  return toModuleGroup(data);
}

export async function remove(id: string): Promise<void> {
  await del(`/module-groups/${id}`);
}

export default {
  getAll,
  getAllPaginated,
  getActive,
  getById,
  add,
  update,
  remove,
};
