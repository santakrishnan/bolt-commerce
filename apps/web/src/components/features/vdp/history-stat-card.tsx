import type { ReactNode } from "react";

interface HistoryStatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

/**
 * HistoryStatCard - Reusable card for displaying a single vehicle history stat.
 * Used in the History tab grid (e.g. "No Damage", "Previous Owners", etc.).
 */
export function HistoryStatCard({ icon, label, value }: HistoryStatCardProps) {
  return (
    <div className="flex items-center gap-[var(--spacing-md)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-body/50 px-0 py-[var(--spacing-xs)]">
        {icon}
      </div>
      <div>
        <h4 className="pb-[var(--spacing-2xs)] font-normal text-[length:var(--font-size-sm)] text-body-muted leading-5">
          {label}
        </h4>
        <p className="font-semibold text-[length:var(--font-size-md)] text-body leading-5">
          {value}
        </p>
      </div>
    </div>
  );
}
