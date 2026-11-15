import React from "react";
import { LucideIcon, Inbox } from "lucide-react";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  const ActionIcon = action?.icon;

  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-2xl bg-white border border-neutral-200/80 space-y-4 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200/80 text-neutral-500 flex items-center justify-center mx-auto shadow-2xs">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>

      <div className="max-w-md mx-auto space-y-1.5">
        <h4 className="text-base font-semibold text-neutral-900">{title}</h4>
        {description && (
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="pt-2">
          <button
            type="button"
            onClick={action.onClick}
            className="btn btn-outline text-xs px-4 py-2 inline-flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
            <span>{action.label}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
