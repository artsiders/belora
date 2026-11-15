"use client";

import React from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCw,
  X,
  LucideIcon,
} from "lucide-react";

export type AlertVariant = "error" | "warning" | "success" | "info" | "neutral";

export interface AlertAction {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
}

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  action?: AlertAction;
  onClose?: () => void;
  className?: string;
  icon?: LucideIcon;
}

const VARIANT_CONFIG: Record<
  AlertVariant,
  {
    containerClass: string;
    iconClass: string;
    titleClass: string;
    descClass: string;
    buttonClass: string;
    defaultIcon: LucideIcon;
  }
> = {
  error: {
    containerClass: "bg-red-100/90 text-red-900",
    iconClass: "text-red-600",
    titleClass: "text-red-950 font-semibold",
    descClass: "text-red-800",
    buttonClass:
      "bg-red-600 hover:bg-red-700 text-white shadow-2xs focus:ring-red-400",
    defaultIcon: AlertCircle,
  },
  warning: {
    containerClass: "bg-amber-100/90 text-amber-900",
    iconClass: "text-amber-600",
    titleClass: "text-amber-950 font-semibold",
    descClass: "text-amber-800",
    buttonClass:
      "bg-amber-600 hover:bg-amber-700 text-white shadow-2xs focus:ring-amber-400",
    defaultIcon: AlertTriangle,
  },
  success: {
    containerClass: "bg-emerald-100/90 text-emerald-900",
    iconClass: "text-emerald-600",
    titleClass: "text-emerald-950 font-semibold",
    descClass: "text-emerald-800",
    buttonClass:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs focus:ring-emerald-400",
    defaultIcon: CheckCircle2,
  },
  info: {
    containerClass: "bg-primary-100/60 text-primary-900",
    iconClass: "text-primary-600",
    titleClass: "text-primary-950 font-semibold",
    descClass: "text-primary-800",
    buttonClass:
      "bg-primary-600 hover:bg-primary-700 text-white shadow-2xs focus:ring-primary-400",
    defaultIcon: Info,
  },
  neutral: {
    containerClass: "bg-neutral-100 text-neutral-800",
    iconClass: "text-neutral-500",
    titleClass: "text-neutral-900 font-semibold",
    descClass: "text-neutral-600",
    buttonClass:
      "bg-neutral-900 hover:bg-neutral-800 text-white shadow-2xs focus:ring-neutral-400",
    defaultIcon: Info,
  },
};

export function Alert({
  variant = "info",
  title,
  description,
  children,
  action,
  onClose,
  className = "",
  icon: CustomIcon,
}: AlertProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = CustomIcon || config.defaultIcon;
  const content = description || children;

  return (
    <div
      role="alert"
      className={`relative p-4 sm:p-4.5 rounded-xl flex items-start gap-3 transition-colors ${config.containerClass} ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconClass}`} />

      <div className="flex-1 min-w-0 space-y-1">
        {title && <h4 className={`text-sm ${config.titleClass}`}>{title}</h4>}
        {content && (
          <div className={`text-xs sm:text-sm leading-relaxed ${config.descClass}`}>
            {content}
          </div>
        )}

        {action && (
          <div className="pt-2">
            <button
              type="button"
              onClick={action.onClick}
              disabled={action.isLoading}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${config.buttonClass}`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${action.isLoading ? "animate-spin" : ""}`}
              />
              <span>{action.label}</span>
            </button>
          </div>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer l'alerte"
          className="shrink-0 p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
