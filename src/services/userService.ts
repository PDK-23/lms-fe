import { get, post, put, del, type PageResponse } from "@/lib/api";
import type { User } from "@/types";

// Backend User DTO
interface UserDTO {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  location?: string;
  provider?: string;
  createdAt: string;
  updatedAt?: string;
}

// Transform backend DTO to frontend type
function toUser(dto: UserDTO): User {
  return {
    id: String(dto.id),
    email: dto.email,
    name: dto.name,
    avatar: dto.avatar,
    bio: dto.bio,
    phone: dto.phone,
    role: dto.role?.toLowerCase() as "student" | "instructor" | "admin",
    isActive: dto.isActive,
    lastLogin: dto.lastLoginAt,
    location: dto.location,
    provider: dto.provider,
    enrolledCourses: [],
    completedCourses: [],
    certificates: [],
    createdAt: new Date(dto.createdAt),
  };
}

// Transform frontend type to backend DTO
function toUserDTO(user: Partial<User>): Partial<UserDTO> {
  return {
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    phone: user.phone,
    role: user.role?.toUpperCase(),
    location: user.location,
  };
}

export async function getUsers(): Promise<User[]> {
  const data = await get<UserDTO[]>("/users/all");
  return data.map(toUser);
}

export async function getUsersPaginated(
  page = 0,
  size = 10
): Promise<PageResponse<User>> {
  const response = await get<PageResponse<UserDTO>>("/users", { page, size });
  return {
    ...response,
    content: response.content.map(toUser),
  };
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const data = await get<UserDTO>(`/users/${id}`);
    return toUser(data);
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const data = await get<UserDTO>(
      `/users/email/${encodeURIComponent(email)}`
    );
    return toUser(data);
  } catch {
    return null;
  }
}

export async function getUsersByRole(
  role: string,
  page = 0,
  size = 10
): Promise<PageResponse<User>> {
  const response = await get<PageResponse<UserDTO>>(`/users/role/${role}`, {
    page,
    size,
  });
  return {
    ...response,
    content: response.content.map(toUser),
  };
}

export async function searchUsers(
  keyword: string,
  page = 0,
  size = 10
): Promise<PageResponse<User>> {
  const response = await get<PageResponse<UserDTO>>("/users/search", {
    keyword,
    page,
    size,
  });
  return {
    ...response,
    content: response.content.map(toUser),
  };
}

export async function addUser(
  user: Omit<
    User,
    "id" | "createdAt" | "enrolledCourses" | "completedCourses" | "certificates"
  >
): Promise<User> {
  const dto = toUserDTO(user);
  const data = await post<UserDTO>("/users", dto);
  return toUser(data);
}

export async function updateUser(
  id: string,
  user: Partial<User>
): Promise<User> {
  const dto = toUserDTO(user);
  const data = await put<UserDTO>(`/users/${id}`, dto);
  return toUser(data);
}

export async function deleteUser(id: string): Promise<void> {
  await del(`/users/${id}`);
}

export async function activateUser(id: string): Promise<User> {
  const data = await post<UserDTO>(`/users/${id}/activate`);
  return toUser(data);
}

export async function deactivateUser(id: string): Promise<User> {
  const data = await post<UserDTO>(`/users/${id}/deactivate`);
  return toUser(data);
}

export default {
  getUsers,
  getUsersPaginated,
  getUserById,
  getUserByEmail,
  getUsersByRole,
  searchUsers,
  addUser,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
};
