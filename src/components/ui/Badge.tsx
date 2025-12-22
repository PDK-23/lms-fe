import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  children: ReactNode;
}

export function Badge({
  variant = "primary",
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-success-100 text-success-800",
    warning: "bg-warning-100 text-warning-800",
    danger: "bg-danger-100 text-danger-800",
  };

  return (
    <span
      className={cn(
        "inline-block px-3 py-1 text-xs font-semibold rounded-full",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
