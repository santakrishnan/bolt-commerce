import { Button, Card, CardContent, CardHeader } from "@tfs-ucmp/ui";
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
  ctaVariant?: "primary" | "secondary" | "tertiary";
}

export const GarageInfoCard: React.FC<GarageInfoCardProps> = ({
  heading,
  badge,
  children,
  ctaLabel,
  onCtaClick,
  ctaVariant = "primary",
}) => {
  const getButtonClassName = () => {
    if (ctaVariant === "secondary") {
      return "bg-black text-white hover:bg-gray-800";
    }
    if (ctaVariant === "tertiary") {
      return "border border-gray-300 bg-white text-black hover:bg-gray-50";
    }
    return "bg-brand text-primary-foreground hover:bg-primary-hover";
  };

  return (
    <Card className="border-0 shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-[var(--spacing-lg,24px)] pt-[var(--spacing-md,16px)] pb-[var(--spacing-md,16px)]">
        <div className="flex items-center gap-[var(--spacing-sm,8px)] font-semibold text-[color:var(--color-text-primary,#111)] text-[length:var(--text-body-lg,18px)] leading-[130%] [leading-trim:both] [text-edge:cap]">
          {heading}
        </div>
        {badge}
      </CardHeader>
      {/* Horizontal separator line */}
      <div
        className="mx-[var(--spacing-lg,24px)] h-[1px] bg-black opacity-10"
        style={{ background: "#000" }}
      />
      <CardContent className="flex flex-col gap-[var(--spacing-md,16px)] px-[var(--spacing-lg,24px)] pt-[var(--spacing-md,16px)] pb-[var(--spacing-md,16px)] font-normal text-[color:var(--color-text-secondary,#58595B)] text-[length:var(--font-size-sm,14px)] leading-normal [font-family:var(--font-family,'Toyota_Type')] [leading-trim:both] [text-edge:cap]">
        {children}
        <Button
          className={`rounded-full ${getButtonClassName()}`}
          onClick={onCtaClick}
          type="button"
        >
          {ctaLabel}
        </Button>
      </CardContent>
    </Card>
  );
};
