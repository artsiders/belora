import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: LucideIcon;
  isLoading?: boolean;
}

/** Carte de chiffre clé : seul le chiffre affiche un squelette pendant le chargement. */
export function StatCard({ label, value, hint, icon: Icon, isLoading = false }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-500">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-primary-600" aria-hidden />}
      </div>
      {isLoading ? (
        <span className="block h-8 w-28 rounded-lg bg-neutral-200 animate-pulse my-1" />
      ) : (
        <span className="block text-2xl font-extrabold text-neutral-900 mt-1">{value}</span>
      )}
      {hint && <span className="block text-sm text-neutral-500 mt-1">{hint}</span>}
    </div>
  );
}
