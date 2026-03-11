import {
  BatteryIcon,
  Button,
  ColorsIcon,
  cn,
  EngineIcon,
  MarkerPinIcon,
  MileageIcon,
  MPGIcon,
  TransmissionIcon,
} from "@tfs-ucmp/ui";
import type { ReactNode } from "react";
import type { VehicleSpecData } from "~/lib/data/vehicle";

interface OverviewTabProps {
  specs: VehicleSpecData[];
}

const specIconMap: Record<string, ReactNode> = {
  engine: <EngineIcon className="text-muted" size={24} />,
  "interior-color": <ColorsIcon className="text-muted" size={24} />,
  "exterior-color": <ColorsIcon className="text-muted" size={24} />,
  mpg: <MPGIcon className="text-muted" size={24} />,
  mileage: <MileageIcon className="text-muted" size={24} />,
  location: <MarkerPinIcon className="text-muted" size={24} />,
  "fuel-type": <BatteryIcon className="text-muted" size={24} />,
  drivetrain: <BatteryIcon className="text-muted" size={24} />,
  transmission: <TransmissionIcon className="text-muted" size={24} />,
};

const specIconMapDesktop: Record<string, ReactNode> = {
  engine: <EngineIcon className="text-[var(--color-states-muted-foreground)]" size={32} />,
  "interior-color": (
    <ColorsIcon className="text-[var(--color-states-muted-foreground)]" size={32} />
  ),
  "exterior-color": (
    <ColorsIcon className="text-[var(--color-states-muted-foreground)]" size={32} />
  ),
  mpg: <MPGIcon className="text-[var(--color-states-muted-foreground)]" size={32} />,
  mileage: <MileageIcon className="text-[var(--color-states-muted-foreground)]" size={32} />,
  location: <MarkerPinIcon className="text-[var(--color-states-muted-foreground)]" size={32} />,
  "fuel-type": <BatteryIcon className="text-[var(--color-states-muted-foreground)]" size={32} />,
  drivetrain: <BatteryIcon className="text-[var(--color-states-muted-foreground)]" size={32} />,
  transmission: (
    <TransmissionIcon className="text-[var(--color-states-muted-foreground)]" size={32} />
  ),
};

export function OverviewTab({ specs }: OverviewTabProps) {
  return (
    <div className="rounded-lg">
      {/* Header with title and button */}
      <div className="mb-[var(--spacing-lg)] flex items-center justify-between md:pr-[var(--spacing-xl)] lg:mb-[var(--spacing-2xl)]">
        <h3 className="font-semibold text-[length:var(--text-xl)] text-[var(--color-core-surface-foreground)] text-body leading-heading md:px-[var(--spacing-xl)] lg:font-semibold lg:text-[length:var(--font-size-lg)] lg:text-heading">
          Overview
        </h3>
        <Button
          className={cn(
            "flex items-center justify-center rounded-full border border-[var(--color-actions-tertiary-border)] bg-[var(--color-core-surfaces-background)] px-[var(--spacing-xl)] py-0 text-center font-semibold text-[length:var(--font-size-sm)] text-body hover:bg-transparent hover:text-inherit focus:bg-transparent active:bg-transparent lg:h-10 lg:max-w-50 lg:shrink-0 lg:border lg:border-heading lg:px-[var(--spacing-xl)] lg:py-0 lg:font-semibold lg:text-[length:var(--font-size-sm)] lg:text-heading lg:leading-normal"
          )}
          variant="outline"
        >
          View All Specs
        </Button>
      </div>

      {/* Specs Card */}
      <div className="rounded-lg bg-surface shadow-sm">
        {/* Mobile layout */}
        <div className="block divide-y divide-border md:hidden">
          {specs.map((spec, _index) => (
            <div
              className="flex items-center justify-between self-stretch border-[var(--color-states-muted)] px-[var(--spacing-md)] py-[var(--spacing-lg)]"
              key={spec.key}
            >
              <div className="flex flex-1 items-center gap-[var(--spacing-sm)]">
                <span className="mt-0.5">{specIconMap[spec.key]}</span>
                <span className="text-center font-normal text-[length:var(--font-size-sm)] text-body-muted leading-6">
                  {spec.label}
                </span>
              </div>
              <span className="text-center font-semibold text-[length:var(--font-size-sm)] text-body leading-6">
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop layout */}
        <div className="hidden grid-cols-1 gap-[var(--spacing-lg)] md:grid md:grid-cols-2 md:p-[var(--spacing-xl)] lg:grid-cols-3">
          {specs.map((spec, index) => {
            const mdCols = 2;
            const lgCols = 3;
            const mdLastRowStart = Math.floor((specs.length - 1) / mdCols) * mdCols;
            const lgLastRowStart = Math.floor((specs.length - 1) / lgCols) * lgCols;
            const isLastRowMd = index >= mdLastRowStart;
            const isLastRowLg = index >= lgLastRowStart;

            return (
              <div
                className={cn(
                  "flex items-center gap-[var(--spacing-sm)] border-[var(--color-states-muted)] border-b",
                  // Only add bottom padding if not last row
                  !(isLastRowMd || isLastRowLg) && "pb-[var(--spacing-lg)]",
                  isLastRowMd && "md:border-b-0",
                  isLastRowLg && "lg:border-b-0"
                )}
                key={spec.key}
              >
                <div className="mt-0.5">{specIconMapDesktop[spec.key]}</div>
                <div className="flex flex-col">
                  <span className="text-[length:var(--font-size-sm)] text-muted-foreground lg:font-normal lg:text-[length:var(--font-size-sm)] lg:text-body-muted lg:leading-6">
                    {spec.label}
                  </span>
                  <span className="font-medium text-[length:var(--font-size-md)] text-foreground lg:font-semibold lg:text-[length:var(--font-size-sm)] lg:text-heading lg:leading-6">
                    {spec.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
