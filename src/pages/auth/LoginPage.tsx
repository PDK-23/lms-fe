import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Card } from "@/components/ui";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const loginSchema = z.object({
    email: z.string().email(t("auth.login.errors.emailInvalid")),
    password: z.string().min(6, t("auth.login.errors.passwordMin")),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    try {
      await login(data);
      navigate("/");
      reset();
    } catch (err) {
      if (err instanceof Error) {
        // Extract error message from API response
        const errorMessage = err.message.includes("Invalid")
          ? t("auth.login.errors.invalidCredentials")
          : t("auth.login.errors.loginFailed");
        setError(errorMessage);
      } else {
        setError(t("auth.login.errors.loginFailed"));
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {t("auth.login.title")}
            </h1>
            <p className="text-neutral-600">{t("auth.login.subtitle")}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("auth.login.emailLabel")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.login.emailPlaceholder")}
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("auth.login.passwordLabel")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.login.passwordPlaceholder")}
                  className="pl-10 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                />
                <span className="ml-2 text-neutral-600">
                  {t("auth.login.remember")}
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {t("auth.login.forgot")}
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isLoading ? t("auth.login.submitting") : t("auth.login.submit")}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-neutral-200"></div>
            <span className="px-3 text-neutral-500 text-sm">
              {t("auth.login.or")}
            </span>
            <div className="flex-1 h-px bg-neutral-200"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium text-neutral-700">
              {t("auth.login.socialGoogle")}
            </button>
            <button className="w-full px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium text-neutral-700">
              {t("auth.login.socialFacebook")}
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-neutral-600">
            {t("auth.login.noAccount")}{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              {t("auth.login.signUp")}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
