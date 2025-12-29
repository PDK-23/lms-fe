import { useState, useCallback, useEffect } from "react";
import type { LoginCredentials, SignUpCredentials, User } from "@/types";
import type { AuthUser } from "@/types/auth";
import authService from "@/services/authService";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (
    credentials: LoginCredentials,
    onSuccess?: (user: User) => void
  ) => Promise<void>;
  signup: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

// Convert AuthUser from API to local User type
function authUserToUser(authUser: AuthUser): User {
  return {
    id: authUser.id,
    email: authUser.email,
    name: authUser.name,
    avatar: authUser.avatar,
    bio: authUser.bio,
    phone: authUser.phone,
    role: authUser.role?.toLowerCase() as "student" | "instructor" | "admin",
    isActive: authUser.isActive,
    location: authUser.location,
    lastLogin: authUser.lastLoginAt,
    enrolledCourses: [],
    completedCourses: [],
    certificates: [],
    createdAt: new Date(authUser.createdAt),
  };
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize user from localStorage on mount
  useEffect(() => {
    if (!initialized) {
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        setUser(authUserToUser(storedUser));
      }
      setInitialized(true);
    }
  }, [initialized]);

  const login = useCallback(
    async (credentials: LoginCredentials, onSuccess?: (user: User) => void) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.login(credentials);
        console.log("Attempting login for", response);
        const user = authUserToUser(response.user);
        setUser(user);
        // Emit login event for global listeners
        try {
          window.dispatchEvent(new CustomEvent("auth:login", { detail: user }));
        } catch (e) {
          // ignore if window not available
        }
        if (onSuccess) onSuccess(user);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Login failed. Please try again.";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signup = useCallback(async (credentials: SignUpCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      });
      const user = authUserToUser(response.user);
      setUser(user);
      try {
        window.dispatchEvent(new CustomEvent("auth:signup", { detail: user }));
      } catch (e) {}
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    try {
      window.dispatchEvent(new CustomEvent("auth:logout"));
    } catch (e) {}
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      // Convert back to AuthUser for storage
      const authUserToStore: AuthUser = {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        avatar: updated.avatar,
        bio: updated.bio,
        phone: updated.phone,
        role: (updated.role?.toUpperCase() || "STUDENT") as AuthUser["role"],
        isActive: updated.isActive,
        location: updated.location,
        lastLoginAt:
          updated.lastLogin instanceof Date
            ? updated.lastLogin.toISOString()
            : (updated.lastLogin as string),
        createdAt:
          updated.createdAt instanceof Date
            ? updated.createdAt.toISOString()
            : String(updated.createdAt),
      };
      authService.storage.setUser(authUserToStore);
      return updated;
    });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!authService.isAuthenticated()) return;

    setIsLoading(true);
    try {
      const response = await authService.getCurrentUser();
      if (response.user) {
        setUser(authUserToUser(response.user));
      }
    } catch {
      // If failed to get current user, logout
      authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user && authService.isAuthenticated(),
    refreshUser,
  };
}
