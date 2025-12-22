import { useState, useCallback } from "react";
import type { LoginCredentials, SignUpCredentials, User } from "@/types";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in (from localStorage)
  if (!user && typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }
  }

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call API or use mock data
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });
      // const data = await response.json();

      // Mock implementation
      const mockUser: User = {
        id: "1",
        name: credentials.email.split("@")[0],
        email: credentials.email,
        enrolledCourses: [],
        completedCourses: [],
        certificates: [],
        createdAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", `token_${Date.now()}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (credentials: SignUpCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call API or use mock data
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });
      // const data = await response.json();

      // Mock implementation
      const mockUser: User = {
        id: Math.random().toString(),
        name: credentials.name,
        email: credentials.email,
        enrolledCourses: [],
        completedCourses: [],
        certificates: [],
        createdAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", `token_${Date.now()}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      const updated = { ...prev, ...data } as User;
      try {
        localStorage.setItem("user", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to persist updated user:", err);
      }
      return updated;
    });
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };
}
