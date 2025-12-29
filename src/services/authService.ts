import { post, get } from "../lib/api";
import type {
  AuthResponse,
  LoginCredentials,
  SignUpCredentials,
  RefreshTokenRequest,
  ChangePasswordRequest,
  AuthUser,
} from "../types/auth";

const AUTH_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "current_user";

// Storage helpers
const storage = {
  getAccessToken: (): string | null => localStorage.getItem(AUTH_TOKEN_KEY),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  getUser: (): AuthUser | null => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  setUser: (user: AuthUser): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear: (): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// API functions
export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await post<AuthResponse>("/auth/login", credentials);
  console.log("Login response:", response);
  // Store tokens and user
  storage.setTokens(response.accessToken, response.refreshToken);
  storage.setUser(response.user);

  return response;
}

export async function register(
  credentials: Omit<SignUpCredentials, "confirmPassword">
): Promise<AuthResponse> {
  const response = await post<AuthResponse>("/auth/register", {
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
  });

  // Store tokens and user
  storage.setTokens(response.accessToken, response.refreshToken);
  storage.setUser(response.user);

  return response;
}

export async function refreshToken(): Promise<AuthResponse> {
  const currentRefreshToken = storage.getRefreshToken();

  if (!currentRefreshToken) {
    throw new Error("No refresh token available");
  }

  const request: RefreshTokenRequest = { refreshToken: currentRefreshToken };
  const response = await post<AuthResponse>("/auth/refresh", request);

  // Update tokens and user
  storage.setTokens(response.accessToken, response.refreshToken);
  storage.setUser(response.user);

  return response;
}

export async function getCurrentUser(): Promise<AuthResponse> {
  const response = await get<AuthResponse>("/auth/me");

  // Update stored user
  if (response.user) {
    storage.setUser(response.user);
  }

  return response;
}

export async function changePassword(
  request: ChangePasswordRequest
): Promise<void> {
  await post<void>("/auth/change-password", request);
}

export function logout(): void {
  // Call backend logout (optional, since JWT is stateless)
  post("/auth/logout", {}).catch(() => {
    // Ignore errors on logout
  });

  // Clear local storage
  storage.clear();
}

// Utility functions
export function isAuthenticated(): boolean {
  return !!storage.getAccessToken();
}

export function getStoredUser(): AuthUser | null {
  return storage.getUser();
}

export function getAccessToken(): string | null {
  return storage.getAccessToken();
}

// Check if token needs refresh (optional: implement token expiry check)
export function shouldRefreshToken(): boolean {
  // For now, just check if refresh token exists
  // You could implement JWT decode and check expiry here
  return !!storage.getRefreshToken() && !!storage.getAccessToken();
}

// Auth service object for convenient import
const authService = {
  login,
  register,
  refreshToken,
  getCurrentUser,
  changePassword,
  logout,
  isAuthenticated,
  getStoredUser,
  getAccessToken,
  shouldRefreshToken,
  storage,
};

export default authService;
