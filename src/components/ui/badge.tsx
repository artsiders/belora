import React from "react";
import { LucideIcon } from "lucide-react";

export type BadgeVariant =
  | "default"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "gold";

export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  className?: string;
}

const BADGE_VARIANTS: Record<
  BadgeVariant,
  {
    containerClass: string;
    iconClass: string;
  }
> = {
  default: {
    containerClass: "bg-neutral-100 text-neutral-800",
    iconClass: "text-neutral-500",
  },
  neutral: {
    containerClass: "bg-neutral-100 text-neutral-700",
    iconClass: "text-neutral-400",
  },
  success: {
    containerClass: "bg-emerald-100 text-emerald-800",
    iconClass: "text-emerald-600",
  },
  warning: {
    containerClass: "bg-amber-100 text-amber-800",
    iconClass: "text-amber-600",
  },
  danger: {
    containerClass: "bg-red-100 text-red-800",
    iconClass: "text-red-600",
  },
  info: {
    containerClass: "bg-primary-100/70 text-primary-900",
    iconClass: "text-primary-600",
  },
  gold: {
    containerClass: "bg-secondary-100 text-secondary-900",
    iconClass: "text-secondary-600",
  },
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
  icon: Icon,
  className = "",
}: BadgeProps) {
  const styles = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default;
  const sizeClass =
    size === "md"
      ? "text-xs px-2.5 py-1 gap-1.5"
      : "text-xs px-2 py-0.5 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md transition-colors ${sizeClass} ${styles.containerClass} ${className}`}
    >
      {Icon && <Icon className={`w-3.5 h-3.5 shrink-0 ${styles.iconClass}`} />}
      <span className="leading-none">{children}</span>
    </span>
  );
}

export default Badge;
