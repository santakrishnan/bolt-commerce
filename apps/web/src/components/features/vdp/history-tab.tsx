import {
  Button,
  cn,
  DamageReportIcon,
  NoDamageIcon,
  OdometerIcon,
  PreviousOwnersIcon,
  ServiceHistoryIcon,
  TypeOwnersIcon,
} from "@tfs-ucmp/ui";
import type { HistoryData } from "~/lib/data/vehicle";
import { HistoryStatCard } from "./history-stat-card";

const carName = "2023 Toyota HIghLander XLE 4";

interface HistoryTabProps {
  historyData: HistoryData;
}

export function HistoryTab({ historyData }: HistoryTabProps) {
  return (
    <div className="rounded-lg pt-0">
      <div className="mb-[var(--spacing-xl)] flex flex-col justify-between gap-[var(--spacing-lg)] md:flex-row md:px-[var(--spacing-xl)] lg:mb-[var(--spacing-2xl)] lg:items-stretch lg:gap-0 lg:border-b-0 lg:px-[var(--spacing-xl)] lg:pb-0">
        <div className="flex shrink-0 flex-col justify-centermd:pr-[var(--spacing-lg)]">
          <h3 className="mb-[var(--spacing-2xs)] font-semibold text-[length:var(--font-size-lg)] text-[var(--color-core-surface-foreground)] text-body leading-heading lg:font-semibold lg:text-[length:var(--font-size-lg)] lg:leading-heading">
            Vehicle History
          </h3>
          <p className="font-semibold text-[length:var(--font-size-sm)] text-[var(--color-states-muted-foreground)] capitalize leading-normal">
            VIN:{" "}
            <span className="font-normal text-[length:var(--font-size-sm)] text-[var(--color-core-surface-foreground)] leading-normal">
              {historyData.vin}
            </span>
          </p>
        </div>
        <div className="mx-[var(--spacing-sm)] hidden w-px self-stretch bg-divider lg:block" />
        <div className="flex items-center font-semibold text-[length:var(--font-size-sm)] text-body leading-normal">
          <span className="gap-[var(--spacing-xs)] font-semibold text-[length:var(--font-size-sm)] text-body leading-normal">
            {carName}
            <span className="font-normal text-[length:var(--font-size-sm)] text-body leading-normal">
              {historyData.vehicleDescription}
            </span>
          </span>
        </div>
        <div className="mx-[var(--spacing-sm)] hidden w-px self-stretch bg-divider lg:block" />
        <div className="flex shrink-0 items-center">
          <Button
            className={cn(
              "flex items-center justify-center gap-2.5 rounded-full border border-[var(--color-actions-tertiary-border)] bg-[var(--color-core-surfaces-background)] px-[var(--spacing-xl)] py-0 text-center font-semibold text-[length:var(--font-size-sm)] text-[var(--color-core-surface-foreground)] hover:bg-transparent hover:text-inherit focus:bg-transparent active:bg-transparent"
            )}
            variant="outline"
          >
            View Full Report
          </Button>
        </div>
      </div>
      <div className="md:px-[var(--spacing-md)] lg:px-0">
        <div className="mb-[var(--spacing-10)] rounded-xl bg-surface p-[var(--spacing-xl)] lg:mb-[var(--spacing-4xl)]">
          <div className="grid grid-cols-1 gap-x-[var(--spacing-4xl)] gap-y-[var(--spacing-xl)] md:grid-cols-2 lg:grid-cols-3">
            <HistoryStatCard
              icon={
                <span aria-label="No Damage" role="img">
                  <NoDamageIcon className="text-brand" size={24} />
                  <title>No Damage</title>
                </span>
              }
              label="No Damage"
              value={`${historyData.damageReported} Damage Reported`}
            />
            <HistoryStatCard
              icon={
                <span aria-label="Previous Owners" role="img">
                  <PreviousOwnersIcon className="text-brand" size={24} />
                  <title>Previous Owners</title>
                </span>
              }
              label="Previous Owners"
              value={`${historyData.previousOwners} Owners`}
            />
            <HistoryStatCard
              icon={
                <span aria-label="Service History" role="img">
                  <ServiceHistoryIcon className="text-brand" size={24} />
                  <title>Service History</title>
                </span>
              }
              label="Service History"
              value={`${historyData.servicesOnRecord} Services on Record`}
            />
            <HistoryStatCard
              icon={
                <span aria-label="Damage Reports" role="img">
                  <DamageReportIcon className="text-brand" size={24} />
                  <title>Damage Reports</title>
                </span>
              }
              label="Damage Reports"
              value={`${historyData.repairsReported} Repairs Reported`}
            />
            <HistoryStatCard
              icon={
                <span aria-label="Type of Owner" role="img">
                  <TypeOwnersIcon className="text-brand" size={24} />
                  <title>Type of Owner</title>
                </span>
              }
              label="Type of Owner"
              value={historyData.ownerTypes.join(", ")}
            />
            <HistoryStatCard
              icon={
                <span aria-label="Last Odometer Reading" role="img">
                  <OdometerIcon className="text-brand" size={24} />
                  <title>Last Odometer Reading</title>
                </span>
              }
              label="Last Odometer Reading"
              value={`${historyData.lastOdometerReading.toLocaleString()} Miles`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
