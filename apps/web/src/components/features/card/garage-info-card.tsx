import type React from "react";

export interface GarageInfoCardProps {
  /** Card heading shown on the left - can be string or ReactNode for custom content */
  heading: React.ReactNode;
  /** Optional badge rendered on the right of the header */
  badge?: React.ReactNode;
  /** Content area (icon/image + text) rendered between header and CTA */
  children: React.ReactNode;
  /** Label for the CTA button */
  ctaLabel: string;
  /** CTA click handler */
  onCtaClick?: () => void;
  /** Button variant - defaults to "primary" */
  ctaVariant?: "primary" | "secondary";
}

export const GarageInfoCard: React.FC<GarageInfoCardProps> = ({
  heading,
  badge,
  children,
  ctaLabel,
  onCtaClick,
  ctaVariant = "primary",
}) => (
  <div className="flex flex-col gap-2 rounded-lg bg-surface p-4 shadow">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 font-semibold text-sm">{heading}</div>
      {badge}
    </div>
    {children}
    <button
      className={`mt-2 rounded-full py-2 font-semibold ${
        ctaVariant === "secondary"
          ? "bg-black text-white hover:bg-gray-800"
          : "bg-brand text-primary-foreground hover:bg-primary-hover"
      }`}
      onClick={onCtaClick}
      type="button"
    >
      {ctaLabel}
    </button>
  </div>
);
