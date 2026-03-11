"use client";

import { ColorSwatch } from "~/components/shared/color-swatch";
import { filterSections } from "~/lib/search/filter-sections";
import { FilterChip } from "./filter-chip";
import { FilterSection } from "./filter-section";
import type { FilterState } from "./types";

interface SidebarFiltersProps {
  draftState: FilterState;
  openSection: string | null;
  toggleSection: (section: string) => void;
  handleDraftChange: (key: keyof FilterState, value: FilterState[keyof FilterState]) => void;
  toggleArrayFilter: (key: keyof FilterState, arr: string[], value: string) => void;
  sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  scrollInfo: { thumbTop: number; thumbHeight: number };
  handleScroll: () => void;
}

/**
 * Scrollable right-hand panel containing all filter sections.
 * Includes the custom red scrollbar track.
 */
export function SidebarFilters({
  draftState,
  openSection,
  toggleSection,
  handleDraftChange,
  toggleArrayFilter,
  sectionRefs,
  scrollContainerRef,
  scrollInfo,
  handleScroll,
}: SidebarFiltersProps) {
  const {
    selectedPriceQuick,
    selectedYearQuick,
    selectedMileage,
    selectedBodyStyles,
    selectedExteriorColors,
    selectedInteriorColors,
    selectedFuelTypes,
    selectedModels,
    selectedSafetyFeatures,
    selectedComfortFeatures,
    selectedTechFeatures,
    selectedExteriorFeatures,
    selectedPerformanceFeatures,
    selectedSeatingCapacity,
    selectedDrivetrains,
    selectedTransmissions,
    inspection160,
  } = draftState;

  return (
    <div className="relative flex flex-1">
      {/* Scrollable Content */}
      <div
        className="scrollbar-hide flex-1 overflow-y-auto"
        onScroll={handleScroll}
        ref={scrollContainerRef}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="pb-20">
          {/* ── Price ─────────────────────────────────────── */}
          <FilterSection
            isOpen={openSection === "Price"}
            onToggle={() => toggleSection("Price")}
            sectionRef={(el) => {
              sectionRefs.current.Price = el;
            }}
            title="Price"
          >
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-0">
                  <span className="mb-1 block font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                    Min
                  </span>
                  <select className="h-[48px] max-w-[220px] appearance-none rounded-lg bg-[length:11.504px_6.504px] bg-[right_12px_center] bg-[url('/images/dropdown-arrow.svg')] bg-[var(--color-brand-surface)] bg-no-repeat px-3 py-2 pr-10 font-normal text-[length:var(--font-size-sm)] text-[var(--color-brand-text-primary)] leading-normal">
                    {filterSections.price.minDropdown.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-3 text-gray-400">—</div>
                <div className="flex-1">
                  <span className="mb-1 block font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                    Max
                  </span>
                  <select className="h-[48px] max-w-[220px] appearance-none rounded-lg bg-[length:11.504px_6.504px] bg-[right_12px_center] bg-[url('/images/dropdown-arrow.svg')] bg-[var(--color-brand-surface)] bg-no-repeat px-3 py-2 pr-10 font-normal text-[length:var(--font-size-sm)] text-[var(--color-brand-text-primary)] leading-normal">
                    {filterSections.price.maxDropdown.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="mb-2 font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                  Quick Price Ranges
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterSections.price.quickRanges.map((range) => (
                    <FilterChip
                      key={range}
                      label={range}
                      onClick={() =>
                        handleDraftChange(
                          "selectedPriceQuick",
                          range === selectedPriceQuick ? "" : range
                        )
                      }
                      selected={selectedPriceQuick === range}
                    />
                  ))}
                </div>
              </div>
            </div>
          </FilterSection>

          {/* ── Year ──────────────────────────────────────── */}
          <FilterSection
            isOpen={openSection === "Year"}
            onToggle={() => toggleSection("Year")}
            sectionRef={(el) => {
              sectionRefs.current.Year = el;
            }}
            title="Year"
          >
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-0">
                  <select className="h-[48px] max-w-[220px] appearance-none rounded-lg bg-[length:11.504px_6.504px] bg-[right_12px_center] bg-[url('/images/dropdown-arrow.svg')] bg-[var(--color-brand-surface)] bg-no-repeat px-3 py-2 pr-10 font-normal text-[length:var(--font-size-sm)] text-[var(--color-brand-text-primary)] leading-normal">
                    {filterSections.year.fromOptions.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center pb-1 text-gray-400">to</div>
                <div className="flex-1">
                  <select className="h-[48px] max-w-[220px] appearance-none rounded-lg bg-[length:11.504px_6.504px] bg-[right_12px_center] bg-[url('/images/dropdown-arrow.svg')] bg-[var(--color-brand-surface)] bg-no-repeat px-3 py-2 pr-10 font-normal text-[length:var(--font-size-sm)] text-[var(--color-brand-text-primary)] leading-normal">
                    {filterSections.year.toOptions.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="mb-2 font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                  Popular Year Ranges
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterSections.year.popularRanges.map((range) => (
                    <FilterChip
                      key={range}
                      label={range}
                      onClick={() =>
                        handleDraftChange(
                          "selectedYearQuick",
                          range === selectedYearQuick ? "" : range
                        )
                      }
                      selected={selectedYearQuick === range}
                    />
                  ))}
                </div>
              </div>
            </div>
          </FilterSection>

          {/* ── Mileage ───────────────────────────────────── */}
          <FilterSection
            isOpen={openSection === "Mileage"}
            onToggle={() => toggleSection("Mileage")}
            sectionRef={(el) => {
              sectionRefs.current.Mileage = el;
            }}
            title="Mileage"
          >
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-0">
                  <span className="mb-1 block font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                    Min
                  </span>
                  <select className="h-[48px] max-w-[220px] appearance-none rounded-lg bg-[length:11.504px_6.504px] bg-[right_12px_center] bg-[url('/images/dropdown-arrow.svg')] bg-[var(--color-brand-surface)] bg-no-repeat px-3 py-2 pr-10 font-normal text-[length:var(--font-size-sm)] text-[var(--color-brand-text-primary)] leading-normal">
                    {filterSections.mileage.minDropdown.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-3 text-gray-400">—</div>
                <div className="flex-1">
                  <span className="mb-1 block font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                    Max
                  </span>
                  <select className="h-[48px] max-w-[220px] appearance-none rounded-lg bg-[length:11.504px_6.504px] bg-[right_12px_center] bg-[url('/images/dropdown-arrow.svg')] bg-[var(--color-brand-surface)] bg-no-repeat px-3 py-2 pr-10 font-normal text-[length:var(--font-size-sm)] text-[var(--color-brand-text-primary)] leading-normal">
                    {filterSections.mileage.maxDropdown.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="mb-2 font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                  Quick Mileage Filters
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterSections.mileage.quickFilters.map((filter) => (
                    <FilterChip
                      key={filter}
                      label={filter}
                      onClick={() =>
                        handleDraftChange(
                          "selectedMileage",
                          filter === selectedMileage ? "" : filter
                        )
                      }
                      selected={selectedMileage === filter}
                    />
                  ))}
                </div>
              </div>
            </div>
          </FilterSection>

          {/* ── Body Style ────────────────────────────────── */}
          <FilterSection
            isOpen={openSection === "Body Style"}
            onToggle={() => toggleSection("Body Style")}
            sectionRef={(el) => {
              sectionRefs.current["Body Style"] = el;
            }}
            title="Body Style"
          >
            <div>
              <div className="mb-2 font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                Select all body styles that match your needs
              </div>
              <div className="flex flex-wrap gap-2">
                {filterSections.bodyStyle.map((style) => (
                  <FilterChip
                    key={style}
                    label={style}
                    onClick={() =>
                      toggleArrayFilter("selectedBodyStyles", selectedBodyStyles, style)
                    }
                    selected={selectedBodyStyles.includes(style)}
                  />
                ))}
              </div>
            </div>
          </FilterSection>

          {/* ── Exterior Color ────────────────────────────── */}
          <FilterSection
            isOpen={openSection === "Exterior Color"}
            onToggle={() => toggleSection("Exterior Color")}
            sectionRef={(el) => {
              sectionRefs.current["Exterior Color"] = el;
            }}
            title="Exterior Color"
          >
            <div>
              <div className="mb-2 font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                Choose your preferred exterior colors
              </div>
              <div className="flex flex-wrap gap-2 gap-y-4">
                {filterSections.exteriorColors.map((color) => (
                  <ColorSwatch
                    color={color}
                    key={color}
                    label={color}
                    onClick={() =>
                      toggleArrayFilter("selectedExteriorColors", selectedExteriorColors, color)
                    }
                    selected={selectedExteriorColors.includes(color)}
                  />
                ))}
              </div>
            </div>
          </FilterSection>

          {/* ── Interior Color ────────────────────────────── */}
          <FilterSection
            isOpen={openSection === "Interior Color"}
            onToggle={() => toggleSection("Interior Color")}
            sectionRef={(el) => {
              sectionRefs.current["Interior Color"] = el;
            }}
            title="Interior Color"
          >
            <div>
              <div className="mb-2 font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                Choose your preferred interior colors
              </div>
              <div className="flex flex-wrap gap-2 gap-y-4">
                {filterSections.interiorColors.map((color) => (
                  <ColorSwatch
                    color={color}
                    key={color}
                    label={color}
                    onClick={() =>
                      toggleArrayFilter("selectedInteriorColors", selectedInteriorColors, color)
                    }
                    selected={selectedInteriorColors.includes(color)}
                  />
                ))}
              </div>
            </div>
          </FilterSection>

          {/* ── Make & Model ──────────────────────────────── */}
          <FilterSection
            isOpen={openSection === "Make & Model"}
            onToggle={() => toggleSection("Make & Model")}
            sectionRef={(el) => {
              sectionRefs.current["Make & Model"] = el;
            }}
            title="Make & Model"
          >
            <div className="space-y-3">
              <input
                className="h-[48px] w-[675px] rounded-[8px] border border-[#F8F8F8] bg-[#F8F8F8] px-3 py-2 font-normal text-[#000] text-[16px] leading-normal"
                placeholder={filterSections.makeModelSearchPlaceholder}
                type="text"
              />
              <div>
                <div className="mb-2 font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                  Popular Toyota Models
                </div>
                <div className="flex flex-wrap gap-2 gap-y-4">
                  {filterSections.popularModels.slice(0, 18).map((model) => (
                    <FilterChip
                      key={model}
                      label={model}
                      onClick={() => toggleArrayFilter("selectedModels", selectedModels, model)}
                      selected={selectedModels.includes(model)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </FilterSection>

          {/* ── Fuel Type ─────────────────────────────────── */}
          <FilterSection
            isOpen={openSection === "Fuel Type"}
            onToggle={() => toggleSection("Fuel Type")}
            sectionRef={(el) => {
              sectionRefs.current["Fuel Type"] = el;
            }}
            title="Fuel Type"
          >
            <div>
              <div className="mb-2 font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                Select acceptable fuel types
              </div>
              <div className="flex flex-wrap gap-2 gap-y-4">
                {filterSections.fuelTypes.map((type) => (
                  <FilterChip
                    key={type}
                    label={type}
                    onClick={() => toggleArrayFilter("selectedFuelTypes", selectedFuelTypes, type)}
                    selected={selectedFuelTypes.includes(type)}
                  />
                ))}
              </div>
            </div>
          </FilterSection>

          {/* ── Features & Technology ─────────────────────── */}
          <FilterSection
            isOpen={openSection === "Features & Technology"}
            onToggle={() => toggleSection("Features & Technology")}
            sectionRef={(el) => {
              sectionRefs.current["Features & Technology"] = el;
            }}
            title="Features & Technology"
          >
            <div className="space-y-4">
              <div className="mb-2 font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-secondary)] leading-normal">
                Select desired vehicle features and options
              </div>
              <div>
                <div className="mb-2 font-semibold text-[length:var(--font-size-sm)] text-[var(--color-brand-text-primary)] leading-normal">
                  Safety & Drive Assist
                </div>
                <div className="flex flex-wrap gap-2 gap-y-4">
                  {filterSections.safetyFeatures.map((f) => (
                    <FilterChip
                      key={f}
                      label={f}
                      onClick={() =>
                        toggleArrayFilter("selectedSafetyFeatures", selectedSafetyFeatures, f)
                      }
                      selected={selectedSafetyFeatures.includes(f)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 font-semibold text-[length:var(--font-size-sm)] text-[var(--color-brand-text-primary)] leading-normal">
                  Comfort & Convenience
                </div>
                <div className="flex flex-wrap gap-2 gap-y-4">
                  {filterSections.comfortFeatures.map((f) => (
                    <FilterChip
                      key={f}
                      label={f}
                      onClick={() =>
                        toggleArrayFilter("selectedComfortFeatures", selectedComfortFeatures, f)
                      }
                      selected={selectedComfortFeatures.includes(f)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 font-semibold text-[length:var(--font-size-sm)] text-[var(--color-brand-text-primary)] leading-normal">
                  Technology & Entertainment
                </div>
                <div className="flex flex-wrap gap-2 gap-y-4">
                  {filterSections.techFeatures.map((f) => (
                    <FilterChip
                      key={f}
                      label={f}
                      onClick={() =>
                        toggleArrayFilter("selectedTechFeatures", selectedTechFeatures, f)
                      }
                      selected={selectedTechFeatures.includes(f)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 font-semibold text-[length:var(--font-size-sm)] text-[var(--color-brand-text-primary)] leading-normal">
                  Exterior & Lighting
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterSections.exteriorFeatures.map((f) => (
                    <FilterChip
                      key={f}
                      label={f}
                      onClick={() =>
                        toggleArrayFilter("selectedExteriorFeatures", selectedExteriorFeatures, f)
                      }
                      selected={selectedExteriorFeatures.includes(f)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 font-semibold text-[length:var(--font-size-sm)] text-[var(--color-brand-text-primary)] leading-normal">
                  Performance & Capability
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterSections.performanceFeatures.map((f) => (
                    <FilterChip
                      key={f}
                      label={f}
                      onClick={() =>
                        toggleArrayFilter(
                          "selectedPerformanceFeatures",
                          selectedPerformanceFeatures,
                          f
                        )
                      }
                      selected={selectedPerformanceFeatures.includes(f)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 font-semibold text-[length:var(--font-size-sm)] text-[var(--color-brand-text-primary)] leading-normal">
                  Seating & Capacity
                </div>
                <div className="flex flex-wrap gap-2">
                  {filterSections.seatingCapacity.map((f) => (
                    <FilterChip
                      key={f}
                      label={f}
                      onClick={() =>
                        toggleArrayFilter("selectedSeatingCapacity", selectedSeatingCapacity, f)
                      }
                      selected={selectedSeatingCapacity.includes(f)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </FilterSection>

          {/* ── Inspection ────────────────────────────────── */}
          <FilterSection
            isOpen={openSection === "Inspection"}
            onToggle={() => toggleSection("Inspection")}
            sectionRef={(el) => {
              sectionRefs.current.Inspection = el;
            }}
            title="Inspection"
          >
            <div className="flex h-auto max-w-[329px] flex-shrink-0 flex-col items-start gap-[10px] rounded-[10px] border border-[rgba(17,17,17,0.30)] bg-white p-[6px]">
              <div className="flex w-full items-center justify-between px-[10px]">
                <div>
                  <div className="font-semibold text-[length:var(--font-size-md)] text-[var(--color-brand-text-primary)] leading-[var(--spacing-lg)]">
                    160-Point Inspection
                  </div>
                  <div className="font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-primary)] leading-[var(--spacing-md)]">
                    Factory-trained technician verified
                  </div>
                </div>
                <button
                  className={`h-6 w-12 rounded-full transition-colors ${inspection160 ? "bg-red-500" : "bg-gray-300"}`}
                  onClick={() => handleDraftChange("inspection160", !inspection160)}
                  type="button"
                >
                  <div
                    className={`h-5 w-5 transform rounded-full bg-white shadow transition-transform ${inspection160 ? "translate-x-6" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
            </div>
          </FilterSection>

          {/* ── Drivetrain ────────────────────────────────── */}
          <FilterSection
            isOpen={openSection === "Drivetrain"}
            onToggle={() => toggleSection("Drivetrain")}
            sectionRef={(el) => {
              sectionRefs.current.Drivetrain = el;
            }}
            title="Drivetrain"
          >
            <div className="flex flex-wrap gap-2">
              {filterSections.drivetrains.map((dt) => (
                <FilterChip
                  key={dt}
                  label={dt}
                  onClick={() => toggleArrayFilter("selectedDrivetrains", selectedDrivetrains, dt)}
                  selected={selectedDrivetrains.includes(dt)}
                />
              ))}
            </div>
          </FilterSection>

          {/* ── Transmission ──────────────────────────────── */}
          <FilterSection
            isOpen={openSection === "Transmission"}
            onToggle={() => toggleSection("Transmission")}
            sectionRef={(el) => {
              sectionRefs.current.Transmission = el;
            }}
            title="Transmission"
          >
            <div className="flex flex-wrap gap-2">
              {filterSections.transmissions.map((t) => (
                <FilterChip
                  key={t}
                  label={t}
                  onClick={() =>
                    toggleArrayFilter("selectedTransmissions", selectedTransmissions, t)
                  }
                  selected={selectedTransmissions.includes(t)}
                />
              ))}
            </div>
          </FilterSection>
        </div>
      </div>

      {/* Custom Red Scrollbar */}
      <div className="relative w-1.5 flex-shrink-0 bg-gray-200">
        <div
          className="absolute w-full rounded-full bg-red-500 transition-all duration-150"
          style={{
            top: scrollInfo.thumbTop,
            height: scrollInfo.thumbHeight,
          }}
        />
      </div>
    </div>
  );
}
