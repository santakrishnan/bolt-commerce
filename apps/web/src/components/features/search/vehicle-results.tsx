"use client";

import { Badge, Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { XIcon } from "@/components/assets/icons";
import { cn } from "@/lib/utils";
import { useFavorites } from "~/components/providers/favorites-provider";
import { getUsedCarsSrpNoResultsMessage } from "~/lib/messages/used-cars";
import { getVehicleEstimation, type Vehicle } from "~/lib/search/mock-vehicles";
import CarCard from "../card/car-card";
import CarCardSkeleton from "../card/car-card-skeleton";

function vehicleToCarCardProps(vehicle: Vehicle) {
  const parts = vehicle.miles.split(" - ");
  const dealerName = parts[0] ?? vehicle.miles;
  const distance = parts[1] ?? "";

  let badge: { type: "excellent" | "priceDrop"; text: string } | undefined;
  if (vehicle.labels.includes("Excellent Price")) {
    badge = { type: "excellent", text: "Excellent Price" };
  } else if (vehicle.labels.includes("Price Drop")) {
    badge = { type: "priceDrop", text: "Price Drop" };
  }

  const estimation = getVehicleEstimation(vehicle);

  return {
    carImage: vehicle.image,
    carName: vehicle.title,
    make: vehicle.make,
    model: vehicle.model,
    variant: vehicle.variant,
    year: vehicle.year,
    vin: vehicle.vin,
    price: `$${vehicle.price.toLocaleString()}`,
    wasPrice: vehicle.oldPrice ? `$${vehicle.oldPrice.toLocaleString()}` : undefined,
    mileage: vehicle.odometer,
    estimatedPayment: `Est. ${estimation.estimatedMonthlyPayment}/mo`,
    exteriorColor: vehicle.extColorName,
    exteriorColorHex: vehicle.extColorCode,
    interiorColor: vehicle.intColorName,
    interiorColorHex: vehicle.intColorCode,
    matchPercentage: vehicle.match > 0 ? String(vehicle.match) : undefined,
    dealerName,
    distance,
    badge,
    owners: vehicle.owners,
    estimation,
  };
}

export interface ActiveFilter {
  label: string;
  type: string;
  value: string;
  isRefineSearch?: boolean;
}

export interface VehicleResultsProps {
  vehicles: Vehicle[];
  searchQuery: string;
  activeFilters: ActiveFilter[];
  onToggleFilter: () => void;
  onRemoveFilter: (type: string, value: string) => void;
  onReset: () => void;
  onApplyRefineFilters?: (filters: { id: string; label: string }[]) => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isProgressVisible: boolean;
}

export function VehicleResults({
  vehicles,
  searchQuery,
  activeFilters,
  onToggleFilter,
  onRemoveFilter,
  onReset,
  onApplyRefineFilters,
  currentPage,
  itemsPerPage,
  onPageChange,
  isProgressVisible,
}: VehicleResultsProps) {
  const { isVehicleSaved, toggleVehicle } = useFavorites();
  const activeFilterCount = activeFilters.length;
  const filteredVehicles = vehicles.filter((vehicle) => {
    if (!searchQuery.trim()) {
      return true;
    }
    const query = searchQuery.toLowerCase();
    return (
      vehicle.title.toLowerCase().includes(query) ||
      vehicle.miles.toLowerCase().includes(query) ||
      vehicle.labels.some((label) => label.toLowerCase().includes(query))
    );
  });

  const vehicleCount = filteredVehicles.length;
  const totalPages = Math.ceil(vehicleCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);
  const noResultsMessage = getUsedCarsSrpNoResultsMessage({
    query: searchQuery,
    hasActiveFilters: activeFilterCount > 0,
  });

  return (
    <section className="bg-[var(--color-core-surfaces-background)]">
      <div className="mx-auto px-[var(--spacing-md)] sm:px-[var(--spacing-lg)] lg:px-[var(--spacing-4xl)] 2xl:max-w-(--container-2xl)">
        {activeFilterCount === 0 && (
          <div className="flex items-center gap-[var(--spacing-sm)] bg-[var(--color-core-surfaces-background)] py-[var(--spacing-lg)]">
            <Button
              className={cn(
                "var(--font-size-sm)] inline-flex h-10 cursor-pointer items-center gap-[var(--spacing-xs)] rounded-full bg-[var(--color-structure-interaction-border-hover)] px-[var(--spacing-md)] text-center font-semibold text-[length: text-white leading-normal",
                "hover:bg-[var(--color-structure-interaction-border-hover)] hover:opacity-100"
              )}
              onClick={onToggleFilter}
              type="button"
              variant="search"
            >
              <Image
                alt="Filter"
                className="h-4 w-4"
                height={16}
                src="/images/filter_one.svg"
                width={16}
              />
              <span>Filter and Sort</span>
            </Button>
            <Button
              className={cn(
                "var(--font-size-sm)] inline-flex h-10 cursor-pointer items-center justify-center gap-[var(--spacing-xs)] rounded-full bg-black px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-center font-semibold text-[length: text-white leading-normal",
                "hover:bg-black hover:opacity-100"
              )}
              onClick={onReset}
              type="button"
              variant="search"
            >
              Reset
            </Button>
          </div>
        )}
        {activeFilterCount > 0 && (
          <div className="flex flex-col gap-[var(--spacing-lg)] bg-[var(--color-core-surfaces-background)] py-[var(--spacing-lg)] md:top-[375.5px] md:flex-row md:items-start">
            <div className="flex shrink-0 items-center gap-[var(--spacing-sm)]">
              <Button
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[var(--color-brand-red)] transition-colors hover:bg-red-600"
                onClick={onToggleFilter}
                type="button"
                variant="search"
              >
                <Image
                  alt="Filter"
                  className="h-4 w-4 max-w-none"
                  height={16}
                  src="/images/filter_one.svg"
                  width={16}
                />
              </Button>
              <div className="mx-auto flex flex-row items-center gap-[var(--spacing-sm)] md:mx-0 md:flex-col md:items-start md:gap-0">
                <div className="font-[var(--font-family,'Toyota_Type')] font-semibold text-[length:var(--font-size-xs)] text-[var(--color-core-surfaces-foreground)] leading-normal md:text-[length:var(--font-size-md)]">
                  {vehicleCount} vehicles found
                </div>
                <span className="mb-[var(--spacing-2xs)] text-[#ccc] md:hidden">|</span>
                <div className="font-[var(--font-family,'Toyota_Type')] font-semibold text-[length:var(--font-size-xs)] text-[var(--color-core-surfaces-foreground)] leading-normal md:text-[length:var(--font-size-md)]">
                  Sort by:{" "}
                  <button
                    className="inline-flex items-center gap-[var(--spacing-sm)] font-medium text-black hover:underline"
                    type="button"
                  >
                    Recommended{" "}
                    <Image
                      alt="Dropdown"
                      className="mt-[1.5%] h-1.75 w-[var(--spacing-sm)]"
                      height={7}
                      src="/images/dropdown-arrow.svg"
                      width={12}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-xs)] md:justify-end">
                {activeFilters.map((filter) => (
                  <Badge
                    className={cn(
                      "h-[var(--spacing-xl)] gap-[var(--spacing-xs)] rounded-full border p-[var(--spacing-sm)] text-xs",
                      filter.isRefineSearch
                        ? "border-[var(--color-destructive)] bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)]"
                        : "border-[var(--color-states-muted)] bg-transparent text-[var(--color-brand-text)]"
                    )}
                    key={`${filter.type}-${filter.value}`}
                    text={filter.label}
                    variant="outline"
                  >
                    <Button
                      className={cn(
                        "h-[var(--spacing-xs)] w-[var(--spacing-xs)] p-[0px] transition-colors hover:text-[var(--color-destructive)]",
                        filter.isRefineSearch
                          ? "text-[var(--color-destructive-foreground)]"
                          : "text-[var(--color-brand-text)]"
                      )}
                      onClick={() => onRemoveFilter(filter.type, filter.value)}
                      type="button"
                      variant="search"
                    >
                      <XIcon className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                <Button
                  className="flex h-[var(--spacing-xl)] items-center justify-center gap-[var(--spacing-xs)] rounded-full bg-[var(--color-brand-text)] px-[var(--spacing-lg)] text-center font-normal text-[length:var(--font-size-xs)] text-[var(--color-brand-text-foreground)] leading-normal"
                  onClick={onReset}
                  type="button"
                  variant="search"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-[var(--spacing-3xl)] grid w-full grid-cols-1 gap-[var(--spacing-md)] sm:grid-cols-2 lg:grid-cols-3">
          {isProgressVisible &&
            Array.from({ length: 12 }).map((_, _i) => <CarCardSkeleton key={Math.random()} />)}

          {!isProgressVisible &&
            paginatedVehicles.map((vehicle) => (
              <CarCard
                key={vehicle.id}
                {...vehicleToCarCardProps(vehicle)}
                onApplyRefineFilters={onApplyRefineFilters}
                onFavoriteToggle={() => toggleVehicle(vehicle.vin)}
                wasLiked={isVehicleSaved(vehicle.vin)}
              />
            ))}
        </div>

        {totalPages > 1 && (
          <div className="my-[var(--spacing-3xl)] flex items-center justify-center gap-[var(--spacing-xl)]">
            <Button
              className={cn(
                "flex items-center gap-[var(--spacing-xs)] rounded-full bg-transparent px-0 py-[var(--spacing-xs)] font-semibold text-[var(--Core-surfaces-foreground)] text-xs leading-[125%] tracking-[-0.12px] transition-colors [font-family:var(--font-family)] [leading-trim:both] [text-edge:cap]",
                "hover:bg-gray-100 hover:text-[var(--Core-surfaces-foreground)] disabled:cursor-not-allowed disabled:opacity-50"
              )}
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              type="button"
              variant="ghost"
            >
              <Image
                alt="Previous page"
                className="mt-[var(--spacing-2xs)] h-[var(--spacing-sd)] w-[var(--spacing-sd)]"
                height={14}
                src="/images/pagination_arrow.svg"
                width={14}
              />
              Previous
            </Button>

            <div className="flex items-center gap-[var(--spacing-xl)]">
              {(() => {
                const pages: (number | "...")[] = [];
                if (totalPages <= 4) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else if (currentPage <= 3) {
                  pages.push(1, 2, 3, "...", totalPages);
                } else if (currentPage >= totalPages - 2) {
                  pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
                } else {
                  pages.push(1, "...", currentPage, "...", totalPages);
                }
                return pages.map((page, idx) => {
                  if (page === "...") {
                    const prev = pages[idx - 1];
                    const next = pages[idx + 1];
                    const ellipsisKey = `ellipsis-${String(prev ?? "start")}-${String(next ?? "end")}`;
                    return (
                      <span
                        className="var(--font-size-xs)] font-semibold text-[length: text-[var(--Core-surfaces-foreground)] leading-[125%] tracking-[-0.12px] [font-family:var(--font-family)] [leading-trim:both] [text-edge:cap]"
                        key={ellipsisKey}
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <Button
                      className={cn(
                        "bg-transparent font-semibold text-[length:var(--font-size-sm)] leading-[125%] tracking-[-0.12px] transition-colors [font-family:var(--font-family)] [leading-trim:both] [text-edge:cap]",
                        currentPage === page
                          ? "flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-actions-accent)] p-0 text-white hover:bg-[var(--color-actions-accent)] hover:text-white"
                          : "h-auto w-auto p-0 text-[var(--Core-surfaces-foreground)] hover:bg-transparent hover:text-[var(--Core-surfaces-foreground)] hover:opacity-70"
                      )}
                      key={`page-${page}`}
                      onClick={() => onPageChange(page)}
                      type="button"
                      variant="ghost"
                    >
                      {page}
                    </Button>
                  );
                });
              })()}
            </div>

            <Button
              className={cn(
                "var(--font-size-xs)] flex items-center gap-[var(--spacing-xs)] rounded-full bg-transparent px-0 py-[var(--spacing-xs)] font-semibold text-[length: text-[var(--Core-surfaces-foreground)] leading-[125%] tracking-[-0.12px] transition-colors [font-family:var(--font-family)] [leading-trim:both] [text-edge:cap]",
                "hover:bg-gray-100 hover:text-[var(--Core-surfaces-foreground)] disabled:cursor-not-allowed disabled:opacity-50"
              )}
              onClick={() => onPageChange(currentPage + 1)}
              type="button"
              variant="ghost"
            >
              Next
              <Image
                alt="Next page"
                className="mt-[var(--spacing-2xs)] h-[var(--spacing-sd)] w-[var(--spacing-sd)] rotate-180"
                height={14}
                src="/images/pagination_arrow.svg"
                width={14}
              />
            </Button>
          </div>
        )}

        {filteredVehicles.length === 0 && (
          <div className="py-[var(--spacing-2xl)] text-center">
            <p className="text-[length:var(--font-size-lg)] text-[var(--color-brand-text-secondary)]">
              {noResultsMessage.title}
            </p>
            <p className="mt-[var(--spacing-xs)] text-[length:var(--font-size-sm)] text-[var(--color-brand-text-tertiary)]">
              {noResultsMessage.hint}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
