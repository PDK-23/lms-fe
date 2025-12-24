import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Card } from "@/components/ui";
import { User, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup, isLoading } = useAuth();

  const signupSchema = z
    .object({
      name: z.string().min(2, t("auth.signup.errors.nameMin")),
      email: z.string().email(t("auth.signup.errors.emailInvalid")),
      password: z
        .string()
        .min(6, t("auth.signup.errors.passwordRequirement"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("auth.signup.errors.passwordRequirement")
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.signup.errors.passwordMismatch"),
      path: ["confirmPassword"],
    });

  type SignUpFormData = z.infer<typeof signupSchema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password");

  const passwordRequirements = [
    {
      label: t("auth.signup.passwordRequirements.min6"),
      met: password?.length >= 6,
    },
    {
      label: t("auth.signup.passwordRequirements.upper"),
      met: /[A-Z]/.test(password || ""),
    },
    {
      label: t("auth.signup.passwordRequirements.lower"),
      met: /[a-z]/.test(password || ""),
    },
    {
      label: t("auth.signup.passwordRequirements.number"),
      met: /\d/.test(password || ""),
    },
  ];

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);

    try {
      await signup(data);
      navigate("/");
      reset();
    } catch (err) {
      if (err instanceof Error) {
        const errorMessage = err.message.includes("already registered")
          ? t("auth.signup.errors.emailExists")
          : t("auth.signup.errors.signupFailed");
        setError(errorMessage);
      } else {
        setError(t("auth.signup.errors.signupFailed"));
      }
      console.error("Sign up error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {t("auth.signup.title")}
            </h1>
            <p className="text-neutral-600">{t("auth.signup.subtitle")}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("auth.signup.nameLabel")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder={t("auth.signup.namePlaceholder")}
                  className="pl-10"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("auth.signup.emailLabel")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.signup.emailPlaceholder")}
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
                {t("auth.signup.passwordLabel")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.signup.passwordPlaceholder")}
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

              {/* Password Requirements */}
              {password && (
                <div className="mt-3 p-3 bg-neutral-50 rounded-lg space-y-2">
                  {passwordRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <Check
                        className={`w-4 h-4 mr-2 flex-shrink-0 ${
                          req.met ? "text-green-600" : "text-neutral-300"
                        }`}
                      />
                      <span
                        className={
                          req.met ? "text-neutral-700" : "text-neutral-500"
                        }
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                {t("auth.signup.confirmPasswordLabel")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("auth.signup.passwordPlaceholder")}
                  className="pl-10 pr-10"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 mt-1"
                required
              />
              <span className="ml-2 text-sm text-neutral-600">
                {t("auth.signup.termsPrefix")}{" "}
                <Link
                  to="/terms"
                  className="text-indigo-600 hover:text-indigo-700 underline"
                >
                  {t("auth.signup.termsLink")}
                </Link>{" "}
                {t("auth.signup.and")}{" "}
                <Link
                  to="/privacy"
                  className="text-indigo-600 hover:text-indigo-700 underline"
                >
                  {t("auth.signup.privacyLink")}
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isLoading
                ? t("auth.signup.submitting")
                : t("auth.signup.submit")}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-neutral-200"></div>
            <span className="px-3 text-neutral-500 text-sm">
              {t("auth.signup.or")}
            </span>
            <div className="flex-1 h-px bg-neutral-200"></div>
          </div>

          {/* Social Sign Up */}
          <div className="space-y-3">
            <button className="w-full px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium text-neutral-700">
              {t("auth.signup.socialGoogle")}
            </button>
            <button className="w-full px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium text-neutral-700">
              {t("auth.signup.socialFacebook")}
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-center text-neutral-600">
            {t("auth.signup.haveAccount")}{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              {t("auth.signup.login")}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
