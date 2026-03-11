import Image from "next/image";
import type { CarCardProps } from "./car-card-types";

interface CardBadgeProps {
  badge: CarCardProps["badge"];
}

/** Renders the badge overlay in the card image area */
export function CardBadge({ badge }: CardBadgeProps) {
  if (!badge) {
    return <div className="h-6" />;
  }

  return (
    <>
      {badge.type === "excellent" && (
        <div className="mt-1.5·flex·max-h-[24px]·items-center·justify-center·gap-2·rounded·bg-success·px-2·py-1·pt-0.5">
          <Image
            alt="Excellent Price"
            className="pt-0.5"
            height={12}
            src="/images/search/excellent-price.svg"
            width={14}
          />
          <span className="font-semibold text-2xs text-white">{badge.text}</span>
        </div>
      )}
      {badge.type === "available" && (
        <div className="flex items-center justify-center gap-2 rounded bg-success px-2 py-1 pt-0.5">
          <span className="font-semibold text-2xs text-white">{badge.text}</span>
        </div>
      )}
      {badge.type === "priceDrop" && (
        <div className="mt-1.5 flex items-center justify-center gap-2 rounded bg-[var(--color-card-badge-price-drop)] px-2 py-1 pt-0.5">
          <Image alt="Price Drop" height={12} src="/images/search/price-drop.svg" width={14} />
          <span className="font-semibold text-2xs text-white">{badge.text}</span>
        </div>
      )}
    </>
  );
}

/** Resolve a badge object from a raw label string */
export function resolveCarCardBadge(label: string | undefined): CarCardProps["badge"] | undefined {
  if (!label) {
    return undefined;
  }
  let type: "excellent" | "priceDrop" | "available" = "available";
  if (label === "Excellent Price") {
    type = "excellent";
  } else if (label === "Price Drop") {
    type = "priceDrop";
  }
  return { type, text: label };
}
