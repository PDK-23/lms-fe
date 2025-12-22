import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-semibold rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

  const variantStyles = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300 focus-visible:ring-primary-500",
    secondary:
      "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 disabled:bg-neutral-100 focus-visible:ring-neutral-500",
    outline:
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 disabled:border-primary-300 disabled:text-primary-300 focus-visible:ring-primary-500",
    ghost:
      "text-primary-600 hover:bg-primary-50 disabled:text-primary-300 focus-visible:ring-primary-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
