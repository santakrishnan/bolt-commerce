import { cn } from "@tfs-ucmp/ui";
import type { ComponentType } from "react";
import type {
  HistoryData,
  VehicleDetail,
  VehicleSpecData,
  VehicleStatusData,
} from "~/lib/data/vehicle";

type PillTone = "neutral" | "success" | "warning" | "inactive";

export interface VehicleMetaChipProps {
  ariaLabel?: string;
  chipClassName?: string;
  className?: string;
  tone?: PillTone;
  value: string;
}

export interface VehicleMetaColorChipProps {
  colorName: string;
  label: string;
  swatchHex: string;
}

export interface VehicleMetaCheckedChipProps {
  active: boolean;
  label: string;
}

export interface VehicleMetaBarChipComponents {
  CheckedChipComponent?: ComponentType<VehicleMetaCheckedChipProps>;
  ColorChipComponent?: ComponentType<VehicleMetaColorChipProps>;
  MetaChipComponent?: ComponentType<VehicleMetaChipProps>;
}

interface VehicleMetaBarProps {
  chipComponents?: VehicleMetaBarChipComponents;
  className?: string;
  historyData: HistoryData;
  specs: VehicleSpecData[];
  vehicle: VehicleDetail;
  vehicleStatus: VehicleStatusData;
}

const exteriorColorSwatches: Record<string, string> = {
  "Wind Chill Pearl": "#F4F4F2",
  "Midnight Black Metallic": "#171717",
  "Celestial Silver": "#BFC4C8",
  "Ruby Flare Pearl": "#7A0F1A",
  Blueprint: "#1D3C6A",
  "Magnetic Gray Metallic": "#5F646B",
  "Ice Cap": "#F7F8F8",
  "Classic Silver Metallic": "#A7ADB3",
  "Supersonic Red": "#A61C30",
  Underground: "#3E3E43",
  "Cavalry Blue": "#4A6F9E",
  "Lunar Rock": "#7D877A",
  "Army Green": "#59624D",
  "Solar Octane": "#E65B0B",
  Terra: "#8A5A44",
  "Smoked Mesquite": "#5C4A40",
  "Heavy Metal": "#676D77",
  "Bronze Oxide": "#8E634D",
  "Storm Cloud": "#4F5560",
  "White Pearl": "#F1F1EE",
};

const interiorColorSwatches: Record<string, string> = {
  Black: "#1B1B1D",
  "Black SofTex": "#1C1C1E",
  Ash: "#C5C4C0",
  "Ash Fabric": "#C9C6BF",
  Boulder: "#8D8A83",
  Macadamia: "#B59878",
  "Cockpit Red": "#7B1E24",
  "Harvest Beige": "#B8A788",
  Moonstone: "#8F9398",
  "Light Gray": "#C8C9CB",
  "Dark Gray": "#54585F",
  "Saddle Tan": "#8A5A3B",
  "Rich Cream": "#D7C7AE",
  "Noble Brown": "#5C4237",
  "Red Rock": "#7E332C",
  "Gray/Black": "#676B71",
  "Black/Blue": "#28344D",
  "Black/Brown": "#3E322B",
  "Mineral Gray": "#7C8085",
};

function getToneClass(tone: PillTone): string {
  if (tone === "success") {
    return "text-[#1F5F28]";
  }
  if (tone === "warning") {
    return "text-[#8A4B00]";
  }
  if (tone === "inactive") {
    return "text-[#888]";
  }
  return "text-[var(--color-core-surface-foreground)]";
}

function toNumber(value: string): number | null {
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) {
    return null;
  }
  return Number.parseInt(digits, 10);
}

function formatMileage(miles: string): string {
  const numericMiles = toNumber(miles);
  if (numericMiles === null) {
    return miles;
  }
  return `${new Intl.NumberFormat("en-US").format(numericMiles)} mi`;
}

function getSpecValue(specs: VehicleSpecData[], key: string): string | null {
  const found = specs.find((spec) => spec.key === key)?.value;
  return found ?? null;
}

function swatchColor(colorName: string, palette: Record<string, string>): string {
  return palette[colorName] ?? "#AAAAAA";
}

function DefaultMetaChip({
  value,
  tone = "neutral",
  className,
  chipClassName,
}: VehicleMetaChipProps) {
  return (
    <div
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-[13px] leading-[1.2]",
        "border-[#D5D5D5] bg-[#F7F7F7]",
        getToneClass(tone),
        chipClassName,
        className
      )}
    >
      <span className="font-normal">{value}</span>
    </div>
  );
}

function DefaultColorChip({ label, colorName, swatchHex }: VehicleMetaColorChipProps) {
  return (
    <div className="inline-flex min-h-7 items-center gap-2 text-(--color-core-surface-foreground) text-[13px] leading-[1.2]">
      <span
        aria-hidden="true"
        className="h-4 w-4 rounded-full border border-[#CFCFCF]"
        style={{ backgroundColor: swatchHex }}
      />
      <span className="font-medium">{label}:</span>
      <span className="font-normal">{colorName}</span>
    </div>
  );
}

function DefaultCheckedChip({ label, active }: VehicleMetaCheckedChipProps) {
  return (
    <div
      className={cn(
        "inline-flex min-h-7 items-center gap-2 text-[13px] leading-[1.2]",
        active ? "text-[#1F5F28]" : "text-[#888]"
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#4CAF50]"
      >
        <span className="text-2xs text-white leading-none">✓</span>
      </span>
      <span className="font-medium">{label}</span>
    </div>
  );
}

export function VehicleMetaBar({
  vehicle,
  specs,
  historyData,
  vehicleStatus,
  className,
  chipComponents,
}: VehicleMetaBarProps) {
  const MetaChip = chipComponents?.MetaChipComponent ?? DefaultMetaChip;
  const ColorChip = chipComponents?.ColorChipComponent ?? DefaultColorChip;
  const CheckedChip = chipComponents?.CheckedChipComponent ?? DefaultCheckedChip;

  const fuelType = vehicle.fuelType ?? getSpecValue(specs, "fuel-type") ?? "Unknown";
  const transmission = vehicle.transmission ?? getSpecValue(specs, "transmission") ?? "Unknown";
  const mileage = formatMileage(vehicle.miles);

  const damageCount = Math.max(0, historyData.damageReported);
  const accidentHistory =
    damageCount > 0 ? `${damageCount} Accident${damageCount > 1 ? "s" : ""}` : "No Accidents";
  const accidentTone: PillTone = damageCount > 0 ? "warning" : "success";

  const ownerCount = Math.max(0, historyData.previousOwners);
  const ownerText = `${ownerCount} Owner${ownerCount === 1 ? "" : "s"}`;
  const titleStatus = historyData.titleStatus ?? "Title Status Unavailable";

  const certified = vehicle.certified ?? vehicle.warranty;
  const inspectionPassed = vehicle.inspectionPassed ?? vehicle.inspected;
  const inspectionActive = inspectionPassed && !vehicleStatus.inspectionInProgress;

  return (
    <div className={cn("mb-4 rounded-[10px] bg-white px-4 py-3 shadow-sm md:px-6", className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-5">
        <MetaChip
          chipClassName="border-[#A8C7FF] bg-[#EAF2FF] text-[#1D4EA3]"
          value={vehicle.drivetrain}
        />
        <MetaChip chipClassName="border-[#9BD8B0] bg-[#EAF9EF] text-[#1F5F28]" value={fuelType} />
        <MetaChip
          chipClassName="border-[#F3C08A] bg-[#FFF3E6] text-[#8A4B00]"
          value={transmission}
        />
        <MetaChip value={mileage} />

        <ColorChip
          colorName={vehicle.exteriorColor}
          label="Ext"
          swatchHex={swatchColor(vehicle.exteriorColor, exteriorColorSwatches)}
        />
        <ColorChip
          colorName={vehicle.interiorColor}
          label="Int"
          swatchHex={swatchColor(vehicle.interiorColor, interiorColorSwatches)}
        />

        <MetaChip
          chipClassName="border-[#F1A8A8] bg-[#FDECEC] text-[#B42323]"
          tone={accidentTone}
          value={accidentHistory}
        />
        <MetaChip chipClassName="border-[#F1A8A8] bg-[#FDECEC] text-[#B42323]" value={ownerText} />
        <MetaChip
          chipClassName="border-[#F1A8A8] bg-[#FDECEC] text-[#B42323]"
          value={titleStatus}
        />

        <CheckedChip active={certified} label="Certified" />
        <CheckedChip active={inspectionActive} label="160-Point Inspection" />
      </div>
    </div>
  );
}
