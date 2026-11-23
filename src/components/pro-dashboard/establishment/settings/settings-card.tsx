import type { LucideIcon } from "lucide-react";

interface SettingsCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}

/** Section de formulaire des paramètres, ancrée pour la navigation latérale. */
export function SettingsCard({ id, icon: Icon, title, description, children, aside }: SettingsCardProps) {
  return (
    <section id={id} className="scroll-mt-24 p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-neutral-100">
        <div className="flex items-start gap-2.5">
          <Icon className="w-5 h-5 text-primary-700 mt-0.5 shrink-0" aria-hidden />
          <div>
            <h2 className="text-base font-bold text-neutral-950">{title}</h2>
            {description && <p className="text-sm text-neutral-500 mt-0.5">{description}</p>}
          </div>
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
      {children}
    </section>
  );
}
