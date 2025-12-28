import axios, { AxiosError, type AxiosResponse } from "axios";

// API base URL - uses environment variable or defaults to localhost:8080
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      // Handle 401 Unauthorized - try to refresh token or redirect to login
      if (status === 401) {
        const refreshToken = localStorage.getItem("refresh_token");
        const originalRequest = error.config;

        // If we have a refresh token and this isn't already a retry
        if (
          refreshToken &&
          originalRequest &&
          !originalRequest.headers["X-Retry"]
        ) {
          try {
            const response = await axios.post(
              `${API_BASE_URL}/v1/auth/refresh`,
              { refreshToken }
            );
            const { accessToken, refreshToken: newRefreshToken } =
              response.data;

            localStorage.setItem("auth_token", accessToken);
            localStorage.setItem("refresh_token", newRefreshToken);

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            originalRequest.headers["X-Retry"] = "true";
            return api(originalRequest);
          } catch {
            // Refresh failed, clear tokens and redirect
            localStorage.removeItem("auth_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("current_user");
            window.location.href = "/login";
          }
        } else {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("current_user");
          window.location.href = "/login";
        }
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error("Access forbidden");
      }

      // Handle 500 Internal Server Error
      if (status >= 500) {
        console.error("Server error:", error.response.data);
      }

      // Extract error message from response
      const responseData = error.response.data as { message?: string };
      if (responseData?.message) {
        error.message = responseData.message;
      }
    } else if (error.request) {
      // Network error
      console.error("Network error - no response received");
    }

    return Promise.reject(error);
  }
);

// Backend API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Generic API response type for paginated data
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Helper functions for common operations
export async function get<T>(
  url: string,
  params?: Record<string, unknown>
): Promise<T> {
  const response = await api.get<ApiResponse<T>>(url, { params });
  return response.data.data;
}

export async function post<T>(url: string, data?: unknown): Promise<T> {
  const response = await api.post<ApiResponse<T>>(url, data);
  return response.data.data;
}

export async function put<T>(url: string, data?: unknown): Promise<T> {
  const response = await api.put<ApiResponse<T>>(url, data);
  return response.data.data;
}

export async function patch<T>(url: string, data?: unknown): Promise<T> {
  const response = await api.patch<ApiResponse<T>>(url, data);
  return response.data.data;
}

export async function del<T = void>(url: string): Promise<T> {
  const response = await api.delete<ApiResponse<T>>(url);
  return response.data.data;
}

export default api;
