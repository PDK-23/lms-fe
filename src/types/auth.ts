// Auth-specific user type returned from API
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  role: UserRole;
  isActive?: boolean;
  location?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
