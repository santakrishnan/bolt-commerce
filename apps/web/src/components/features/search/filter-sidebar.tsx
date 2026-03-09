"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { filterSections } from "~/lib/search/filter-sections";

// Collapsible Filter Section Component (Accordion - only one open at a time)
const FilterSection = ({
  title,
  children,
  isOpen,
  onToggle,
  sectionRef,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  sectionRef?: React.Ref<HTMLDivElement>;
}) => {
  return (
    <div className="border-gray-200 border-b pt-2 pb-1 pl-1" ref={sectionRef}>
      <Button
        className="flex h-auto w-full items-center justify-between px-4 py-4 transition-colors hover:bg-gray-50"
        onClick={onToggle}
        type="button"
        variant="ghost"
      >
        <span className="font-semibold text-[#000] text-[16px] leading-normal">{title}</span>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <title>Filter icon</title>
          {isOpen ? (
            <path
              d="M1 6H11"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          ) : (
            <path
              d="M6 1V11M1 6H11"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          )}
        </svg>
      </Button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

// Chip/Toggle Button Component
const FilterChip = ({
  label,
  selected = false,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) => (
  <button
    className={`flex cursor-pointer items-center gap-[9px] rounded-[100px] px-[16px] py-[8px] font-normal text-[14px] leading-normal transition-colors ${
      selected
        ? "border border-red-500 bg-[#F8F8F8] text-[#000]"
        : "bg-[#F8F8F8] text-[#000] hover:border hover:border-gray-400"
    }`}
    onClick={onClick}
    type="button"
  >
    <span className="font-normal text-[14px] leading-normal">{label}</span>
    {selected && (
      <svg aria-hidden="true" className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 12 12">
        <path
          d="M10 3L4.5 8.5L2 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    )}
  </button>
);

// Color Swatch Component
const ColorSwatch = ({
  color: _color,
  label,
  selected = false,
  onClick,
}: {
  color: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) => {
  const colorMap: Record<string, string> = {
    White: "bg-white border border-gray-300",
    Black: "bg-black",
    "Midnight Gray": "bg-gray-600",
    "Metallic Green": "bg-green-600",
    "Deep Red": "bg-red-700",
    Graphite: "bg-gray-800",
    "Luminous Yellow": "bg-yellow-400",
    "Ocean Blue": "bg-blue-600",
    "Electric Blue": "bg-blue-400",
  };

  return (
    <button
      className={`flex h-[36px] cursor-pointer items-center gap-2 rounded-full bg-[#F8F8F8] px-2 py-1 transition-colors ${
        selected ? "border border-red-500" : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className={`h-5 w-5 rounded-full ${colorMap[label] || "bg-gray-400"}`} />
      <span className="font-normal text-[#000] text-[14px] leading-normal">{label}</span>
      {selected && (
        <svg aria-hidden="true" className="h-3 w-3 text-red-500" fill="none" viewBox="0 0 12 12">
          <path
            d="M10 3L4.5 8.5L2 6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      )}
    </button>
  );
};

// Filter state types
export interface FilterState {
  selectedPriceQuick: string;
  selectedYearQuick: string;
  selectedMileage: string;
  selectedBodyStyles: string[];
  selectedExteriorColors: string[];
  selectedInteriorColors: string[];
  selectedFuelTypes: string[];
  selectedModels: string[];
  selectedSafetyFeatures: string[];
  selectedComfortFeatures: string[];
  selectedTechFeatures: string[];
  selectedExteriorFeatures: string[];
  selectedPerformanceFeatures: string[];
  selectedSeatingCapacity: string[];
  selectedDrivetrains: string[];
  selectedTransmissions: string[];
  inspection160: boolean;
}

export const defaultFilterState: FilterState = {
  selectedPriceQuick: "",
  selectedYearQuick: "",
  selectedMileage: "",
  selectedBodyStyles: [],
  selectedExteriorColors: [],
  selectedInteriorColors: [],
  selectedFuelTypes: [],
  selectedModels: [],
  selectedSafetyFeatures: [],
  selectedComfortFeatures: [],
  selectedTechFeatures: [],
  selectedExteriorFeatures: [],
  selectedPerformanceFeatures: [],
  selectedSeatingCapacity: [],
  selectedDrivetrains: [],
  selectedTransmissions: [],
  inspection160: false,
};

export interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleCount: number;
  filterState: FilterState;
  onApply: (newState: FilterState) => void;
  onReset: () => void;
}

export function FilterSidebar({
  isOpen,
  onClose,
  filterState,
  onApply,
  onReset,
}: FilterSidebarProps) {
  // Draft state: tracks user selections inside the sidebar without propagating to parent
  const [draftState, setDraftState] = useState<FilterState>(filterState);

  // Sync draft state from parent when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setDraftState(filterState);
    }
  }, [isOpen, filterState]);

  const handleDraftChange = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    setDraftState((prev) => ({ ...prev, [key]: value }));
  };

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

  // Track which section is open (null = all closed, string = section title)
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Section refs for scroll-into-view
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Custom scrollbar tracking
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollInfo, setScrollInfo] = useState({ thumbTop: 0, thumbHeight: 20 });

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const trackHeight = clientHeight;
    const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 30);
    const scrollableHeight = scrollHeight - clientHeight;
    const thumbTop =
      scrollableHeight > 0 ? (scrollTop / scrollableHeight) * (trackHeight - thumbHeight) : 0;

    setScrollInfo({ thumbTop, thumbHeight });
  }, []);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  // Scroll the opened section into view after it expands
  useEffect(() => {
    if (openSection) {
      // Small delay to let the content render before measuring
      const timer = setTimeout(() => {
        const sectionEl = sectionRefs.current[openSection];
        if (sectionEl && scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const sectionRect = sectionEl.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const offsetTop = sectionRect.top - containerRect.top + container.scrollTop;

          // Scroll so the section starts near the top of the container
          container.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [openSection]);

  const toggleArrayFilter = (key: keyof FilterState, arr: string[], value: string) => {
    if (arr.includes(value)) {
      handleDraftChange(
        key,
        arr.filter((v) => v !== value)
      );
    } else {
      handleDraftChange(key, [...arr, value]);
    }
  };

  const handleApply = () => {
    onApply(draftState);
    onClose();
  };

  const handleReset = () => {
    setDraftState(defaultFilterState);
    onReset();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <button
          className="fixed inset-0 top-0 z-[100] bg-black/40 transition-opacity"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          type="button"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-[100] flex h-full w-full max-w-full transform flex-col bg-white transition-transform duration-300 ease-in-out md:max-w-[70%] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-gray-200 border-b bg-white py-4 pr-4 pl-[15px] md:pl-[35px]">
          <div className="flex items-center gap-[1rem] md:gap-[7rem]">
            <div className="flex items-center gap-[8px]">
              <Image
                alt="Filter"
                className="mt-[5px] h-[10px] w-[14px]"
                height={10}
                src="/images/filter-lines.svg"
                width={14}
              />
              <span className="font-semibold text-[#000] text-[24px] leading-normal">Filter</span>
            </div>
            <div className="flex flex-row items-center gap-3">
              <Button
                className="flex h-[32px] items-center justify-center gap-[10px] rounded-[100px] bg-[#EB0A1E] px-[32px] py-[10px] pt-[8px] text-center font-semibold text-[14px] text-white leading-normal"
                onClick={handleApply}
              >
                Apply
              </Button>
              <button
                className="flex h-[32px] cursor-pointer items-center justify-center gap-[10px] rounded-[100px] bg-[#000] px-[32px] py-[10px] pt-[8px] text-center font-semibold text-[14px] text-white leading-normal"
                onClick={handleReset}
                type="button"
              >
                Reset
              </button>
            </div>
          </div>
          <button
            className="rounded-full p-1 transition-colors hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            <Image
              alt="Close"
              className="h-[10px] w-[10px]"
              height={10}
              src="/images/cross.svg"
              width={10}
            />
          </button>
        </div>

        {/* Main Content with Left Nav + Right Filters */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Navigation Column */}
          <nav
            className="hidden w-[215px] flex-shrink-0 overflow-y-auto border-gray-200 border-r bg-white md:block"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[
              "Price",
              "Year",
              "Mileage",
              "Body Style",
              "Exterior Color",
              "Interior Color",
              "Make & Model",
              "Fuel Type",
              "Features & Technology",
              "Inspection",
              "Drivetrain",
              "Transmission",
            ].map((item) => (
              <Button
                className={`mb-[var(--spacing-xs)] ml-[8.5%] w-full max-w-[182px] justify-start py-3 pr-4 pl-4 text-left font-normal text-[14px] leading-normal transition-colors ${
                  openSection === item
                    ? "rounded-[var(--radius-md,8px)] bg-[var(--Core-surfaces-subtle-card,#F5F5F5)] text-[#000] hover:bg-[var(--Core-surfaces-subtle-card,#F5F5F5)] hover:text-[#000]"
                    : "text-[#58595B] hover:bg-gray-50 hover:text-[#58595B]"
                }`}
                key={item}
                onClick={() => toggleSection(item)}
                type="button"
                variant="ghost"
              >
                {item}
              </Button>
            ))}
          </nav>

          {/* Right Filter Content */}
          <div className="relative flex flex-1">
            {/* Scrollable Content */}
            <div
              className="scrollbar-hide flex-1 overflow-y-auto"
              onScroll={handleScroll}
              ref={scrollContainerRef}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div className="pb-20">
                {/* Price */}
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
                        <span className="mb-1 block font-normal text-[#58595B] text-[14px] leading-normal">
                          Min
                        </span>
                        <select className="h-[48px] max-w-[220px] appearance-none rounded-lg border border-[#F8F8F8] bg-[#F8F8F8] bg-[length:11.504px_6.504px] bg-[right_12px_center] bg-[url('/images/dropdown-arrow.svg')] bg-no-repeat px-3 py-2 pr-10 font-normal text-[#000] text-[16px] leading-normal">
                          <option>$5,000</option>
                          <option>$10,000</option>
                          <option>$15,000</option>
                          <option>$20,000</option>
                        </select>
                      </div>
                      <div className="flex items-end pb-3 text-gray-400">—</div>
                      <div className="flex-1">
                        <span className="mb-1 block font-normal text-[#58595B] text-[14px] leading-normal">
                          Max
                        </span>
                        <select className="h-[48px] max-w-[220px] appearance-none rounded-lg border border-[#F8F8F8] bg-[#F8F8F8] bg-[length:11.504px_6.504px] bg-[right_12px_center] bg-[url('/images/dropdown-arrow.svg')] bg-no-repeat px-3 py-2 pr-10 font-normal text-[#000] text-[16px] leading-normal">
                          <option>$7,000</option>
                          <option>$10,000</option>
                          <option>$20,000</option>
                          <option>$30,000</option>
                          <option>$40,000</option>
                          <option>$50,000</option>
                          <option>$70,000</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-normal text-[#58595B] text-[14px] leading-normal">
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

                {/* Year */}
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
                        <select className="h-[48px] max-w-[220px] appearance-none rounded-lg border border-[#F8F8F8] bg-[#F8F8F8] bg-[length:11.504px_6.504px] bg-[right_12px_center] bg-[url('/images/dropdown-arrow.svg')] bg-no-repeat px-3 py-2 pr-10 font-normal text-[#000] text-[16px] leading-normal">
                          {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map(
                            (y) => (
                              <option key={y}>{y}</option>
                            )
                          )}
                        </select>
                      </div>
                      <div className="flex items-center pb-1 text-gray-400">to</div>
                      <div className="flex-1">
                        <select className="h-[48px] max-w-[220px] appearance-none rounded-lg border border-[#F8F8F8] bg-[#F8F8F8] bg-[length:11.504px_6.504px] bg-[right_12px_center] bg-[url('/images/dropdown-arrow.svg')] bg-no-repeat px-3 py-2 pr-10 font-normal text-[#000] text-[16px] leading-normal">
                          {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map(
                            (y) => (
                              <option key={y}>{y}</option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-normal text-[#58595B] text-[14px] leading-normal">
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

                {/* Mileage */}
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
                        <span className="mb-1 block font-normal text-[#58595B] text-[14px] leading-normal">
                          Min
                        </span>
                        <select className="h-[48px] max-w-[220px] appearance-none rounded-lg border border-[#F8F8F8] bg-[#F8F8F8] bg-[length:11.504px_6.504px] bg-[right_12px_center] bg-[url('/images/dropdown-arrow.svg')] bg-no-repeat px-3 py-2 pr-10 font-normal text-[#000] text-[16px] leading-normal">
                          <option>0</option>
                          <option>10,000</option>
                          <option>25,000</option>
                        </select>
                      </div>
                      <div className="flex items-end pb-3 text-gray-400">—</div>
                      <div className="flex-1">
                        <span className="mb-1 block font-normal text-[#58595B] text-[14px] leading-normal">
                          Max
                        </span>
                        <select className="h-[48px] max-w-[220px] appearance-none rounded-lg border border-[#F8F8F8] bg-[#F8F8F8] bg-[length:11.504px_6.504px] bg-[right_12px_center] bg-[url('/images/dropdown-arrow.svg')] bg-no-repeat px-3 py-2 pr-10 font-normal text-[#000] text-[16px] leading-normal">
                          <option>100,000</option>
                          <option>75,000</option>
                          <option>50,000</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-normal text-[#58595B] text-[14px] leading-normal">
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

                {/* Body Style */}
                <FilterSection
                  isOpen={openSection === "Body Style"}
                  onToggle={() => toggleSection("Body Style")}
                  sectionRef={(el) => {
                    sectionRefs.current["Body Style"] = el;
                  }}
                  title="Body Style"
                >
                  <div>
                    <div className="mb-2 font-normal text-[#58595B] text-[14px] leading-normal">
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

                {/* Exterior Color */}
                <FilterSection
                  isOpen={openSection === "Exterior Color"}
                  onToggle={() => toggleSection("Exterior Color")}
                  sectionRef={(el) => {
                    sectionRefs.current["Exterior Color"] = el;
                  }}
                  title="Exterior Color"
                >
                  <div>
                    <div className="mb-2 font-normal text-[#58595B] text-[14px] leading-normal">
                      Choose your preferred exterior colors
                    </div>
                    <div className="flex flex-wrap gap-2 gap-y-4">
                      {filterSections.exteriorColors.map((color) => (
                        <ColorSwatch
                          color={color}
                          key={color}
                          label={color}
                          onClick={() =>
                            toggleArrayFilter(
                              "selectedExteriorColors",
                              selectedExteriorColors,
                              color
                            )
                          }
                          selected={selectedExteriorColors.includes(color)}
                        />
                      ))}
                    </div>
                  </div>
                </FilterSection>

                {/* Interior Color */}
                <FilterSection
                  isOpen={openSection === "Interior Color"}
                  onToggle={() => toggleSection("Interior Color")}
                  sectionRef={(el) => {
                    sectionRefs.current["Interior Color"] = el;
                  }}
                  title="Interior Color"
                >
                  <div>
                    <div className="mb-2 font-normal text-[#58595B] text-[14px] leading-normal">
                      Choose your preferred interior colors
                    </div>
                    <div className="flex flex-wrap gap-2 gap-y-4">
                      {filterSections.interiorColors.map((color) => (
                        <ColorSwatch
                          color={color}
                          key={color}
                          label={color}
                          onClick={() =>
                            toggleArrayFilter(
                              "selectedInteriorColors",
                              selectedInteriorColors,
                              color
                            )
                          }
                          selected={selectedInteriorColors.includes(color)}
                        />
                      ))}
                    </div>
                  </div>
                </FilterSection>

                {/* Make & Model */}
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
                      placeholder="Search Toyota models (e.g., Camry, RAV4)"
                      type="text"
                    />
                    <div>
                      <div className="mb-2 font-normal text-[#58595B] text-[14px] leading-normal">
                        Popular Toyota Models
                      </div>
                      <div className="flex flex-wrap gap-2 gap-y-4">
                        {filterSections.popularModels.slice(0, 18).map((model) => (
                          <FilterChip
                            key={model}
                            label={model}
                            onClick={() =>
                              toggleArrayFilter("selectedModels", selectedModels, model)
                            }
                            selected={selectedModels.includes(model)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </FilterSection>

                {/* Fuel Type */}
                <FilterSection
                  isOpen={openSection === "Fuel Type"}
                  onToggle={() => toggleSection("Fuel Type")}
                  sectionRef={(el) => {
                    sectionRefs.current["Fuel Type"] = el;
                  }}
                  title="Fuel Type"
                >
                  <div>
                    <div className="mb-2 font-normal text-[#58595B] text-[14px] leading-normal">
                      Select acceptable fuel types
                    </div>
                    <div className="flex flex-wrap gap-2 gap-y-4">
                      {filterSections.fuelTypes.map((type) => (
                        <FilterChip
                          key={type}
                          label={type}
                          onClick={() =>
                            toggleArrayFilter("selectedFuelTypes", selectedFuelTypes, type)
                          }
                          selected={selectedFuelTypes.includes(type)}
                        />
                      ))}
                    </div>
                  </div>
                </FilterSection>

                {/* Features & Technology */}
                <FilterSection
                  isOpen={openSection === "Features & Technology"}
                  onToggle={() => toggleSection("Features & Technology")}
                  sectionRef={(el) => {
                    sectionRefs.current["Features & Technology"] = el;
                  }}
                  title="Features & Technology"
                >
                  <div className="space-y-4">
                    <div className="mb-2 font-normal text-[#58595B] text-[14px] leading-normal">
                      Select desired vehicle features and options
                    </div>
                    <div>
                      <div className="mb-2 font-semibold text-[#000] text-[14px] leading-normal">
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
                      <div className="mb-2 font-semibold text-[#000] text-[14px] leading-normal">
                        Comfort & Convenience
                      </div>
                      <div className="flex flex-wrap gap-2 gap-y-4">
                        {filterSections.comfortFeatures.map((f) => (
                          <FilterChip
                            key={f}
                            label={f}
                            onClick={() =>
                              toggleArrayFilter(
                                "selectedComfortFeatures",
                                selectedComfortFeatures,
                                f
                              )
                            }
                            selected={selectedComfortFeatures.includes(f)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-semibold text-[#000] text-[14px] leading-normal">
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
                      <div className="mb-2 font-semibold text-[#000] text-[14px] leading-normal">
                        Exterior & Lighting
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {filterSections.exteriorFeatures.map((f) => (
                          <FilterChip
                            key={f}
                            label={f}
                            onClick={() =>
                              toggleArrayFilter(
                                "selectedExteriorFeatures",
                                selectedExteriorFeatures,
                                f
                              )
                            }
                            selected={selectedExteriorFeatures.includes(f)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-semibold text-[#000] text-[14px] leading-normal">
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
                      <div className="mb-2 font-semibold text-[#000] text-[14px] leading-normal">
                        Seating & Capacity
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {filterSections.seatingCapacity.map((f) => (
                          <FilterChip
                            key={f}
                            label={f}
                            onClick={() =>
                              toggleArrayFilter(
                                "selectedSeatingCapacity",
                                selectedSeatingCapacity,
                                f
                              )
                            }
                            selected={selectedSeatingCapacity.includes(f)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </FilterSection>

                {/* Inspection */}
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
                        <div className="font-bold text-[#111] text-[16px] leading-[24px]">
                          160-Point Inspection
                        </div>
                        <div className="font-normal text-[#111] text-[12px] leading-[20px]">
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

                {/* Drivetrain */}
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
                        onClick={() =>
                          toggleArrayFilter("selectedDrivetrains", selectedDrivetrains, dt)
                        }
                        selected={selectedDrivetrains.includes(dt)}
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Transmission */}
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
        </div>
      </aside>
    </>
  );
}
