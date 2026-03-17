"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger, Heading } from "@tfs-ucmp/ui";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export interface VehicleKeyFeaturesProps {
  features: string[];
  className?: string;
  collapsible?: boolean;
  headingClassName?: string;
  gridClassName?: string;
  itemClassName?: string;
  iconSrc?: string;
  iconClassName?: string;
  textClassName?: string;
}

export const VehicleKeyFeatures = React.forwardRef<HTMLDivElement, VehicleKeyFeaturesProps>(
  (
    {
      features,
      className,
      collapsible = true,
      headingClassName = "mb-(--spacing-sm) text-lg md:text-lg lg:mb-(--spacing-6)",
      gridClassName = "grid grid-cols-1 gap-x-(--spacing-xs) gap-y-(--spacing-sm) lg:grid-cols-2 lg:gap-(--spacing-7) lg:gap-y-(--spacing-4)",
      itemClassName = "flex items-center gap-(--spacing-xs) lg:gap-[var(--spacing-4)] lg:py-[var(--spacing-1)]",
      iconSrc = "/images/vdp/Vector_5.svg",
      iconClassName = "size-(--size-icon-sm) shrink-0 lg:size-(--size-icon-md)",
      textClassName = "text-xs lg:text-sm",
    },
    ref
  ) => {
    const [featuresExpanded, setFeaturesExpanded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (featuresExpanded && contentRef.current) {
        setTimeout(() => {
          contentRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 50);
      }
    }, [featuresExpanded]);

    if (!collapsible) {
      return (
        <div className={className} ref={ref}>
          <Heading className={headingClassName} level={2} weight="semibold">
            Key Highlights
          </Heading>
          <div className={gridClassName}>
            {features.map((feature) => (
              <div className={itemClassName} key={feature}>
                <Image
                  alt="Checkmark"
                  aria-hidden="true"
                  className={iconClassName}
                  height={20}
                  src={iconSrc}
                  width={20}
                />
                <span className={textClassName}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Collapsible (default) variant
    const visibleFeatures = features.slice(0, 6);
    const hiddenFeatures = features.slice(6);

    return (
      <Collapsible
        className={className ?? ""}
        onOpenChange={setFeaturesExpanded}
        open={featuresExpanded}
      >
        <div className="mb-sm flex items-center justify-between lg:mb-[17.5px]">
          <Heading
            className="text-body text-sm leading-5.5 md:text-sm lg:text-md"
            level={3}
            weight="semibold"
          >
            <span className="lg:hidden">Key Highlights</span>
            <span className="hidden lg:inline">Key Features</span>
          </Heading>
          <CollapsibleTrigger asChild>
            <button
              className="flex items-center gap-2xs font-semibold text-heading text-xs leading-sd hover:text-body"
              type="button"
            >
              {featuresExpanded ? "Collapse" : "Expand All"}
              <Image
                alt="Toggle features"
                className={`h-3 w-3 transition-transform duration-200 ${featuresExpanded ? "rotate-180" : ""}`}
                height={14}
                src="/images/vdp/chevron-down.svg"
                width={14}
              />
            </button>
          </CollapsibleTrigger>
        </div>

        {/* Always-visible features (first 6) */}
        {/* Mobile: Single column list with tick icons */}
        <div className="flex flex-col gap-sm lg:hidden">
          {visibleFeatures.map((feature) => (
            <div className="flex items-center gap-sm" key={feature}>
              <Image
                alt="Included"
                className="h-(--size-icon-md) w-(--size-icon-md) shrink-0"
                height={20}
                src="/images/vdp/Tick.svg"
                width={20}
              />
              <span className="text-body text-sm-alt">{feature}</span>
            </div>
          ))}
        </div>
        {/* Desktop: Two column grid */}
        <div className="hidden grid-cols-2 gap-x-md gap-y-xs lg:grid">
          {visibleFeatures.map((feature) => (
            <div className="flex items-center gap-xs" key={feature}>
              <Image
                alt="Included"
                className="h-3.5 w-3.5 shrink-0"
                height={14}
                src="/images/vdp/Keyfeature.svg"
                width={14}
              />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Collapsible extra features with animation */}
        {hiddenFeatures.length > 0 && (
          <div
            ref={contentRef}
            style={{
              display: "grid",
              gridTemplateRows: featuresExpanded ? "1fr" : "0fr",
              transition: "grid-template-rows 300ms ease-in-out",
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <CollapsibleContent forceMount>
                {/* Mobile */}
                <div className="mt-sm flex flex-col gap-sm pb-2xs lg:hidden">
                  {hiddenFeatures.map((feature) => (
                    <div className="flex items-center gap-sm" key={feature}>
                      <Image
                        alt="Included"
                        className="h-(--size-icon-md) w-(--size-icon-md) shrink-0"
                        height={20}
                        src="/images/vdp/Tick.svg"
                        width={20}
                      />
                      <span className="text-body text-sm-alt">{feature}</span>
                    </div>
                  ))}
                </div>
                {/* Desktop */}
                <div className="mt-xs hidden grid-cols-2 gap-x-md gap-y-xs lg:grid">
                  {hiddenFeatures.map((feature) => (
                    <div className="flex items-center gap-xs" key={feature}>
                      <Image
                        alt="Included"
                        className="h-3.5 w-3.5 shrink-0"
                        height={14}
                        src="/images/vdp/Keyfeature.svg"
                        width={14}
                      />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </div>
        )}
      </Collapsible>
    );
  }
);

VehicleKeyFeatures.displayName = "VehicleKeyFeatures";
