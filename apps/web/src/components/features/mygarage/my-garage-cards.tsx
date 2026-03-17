"use client";

// Scrollable cards for My Garage
/* eslint-disable */
/* biome:disable */

import { Button, ScrollArea } from "@tfs-ucmp/ui";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FC, Fragment, type ReactNode } from "react";
import { GarageInfoCard } from "~/components/features/card/garage-info-card";
import { CircularProgress } from "~/components/shared/circular-progress";
import { CustomBadge } from "~/components/shared/custom-badge";
import { ROUTES } from "~/lib/routes/constants";

export type { GarageInfoCardProps } from "~/components/features/card/garage-info-card";

// ─── Utility (module-level for performance) ─────────────────────────────────

/** Splits search text into two lines if longer than 8 words */
function renderSearchText(text: string): ReactNode {
  const words = text.split(" ");
  if (words.length <= 8) {
    return text;
  }
  return (
    <>
      <span className="block">{words.slice(0, 8).join(" ")}</span>
      <span className="block">{words.slice(8).join(" ")}</span>
    </>
  );
}

export interface SavedVehicleCardProps {
  id: number | string;
  imageUrl: string;
  miles: string;
  onClick?: () => void;
  onRemove?: () => void;
  price: string;
  title: string;
}

export const SavedVehicleCard: FC<SavedVehicleCardProps> = ({
  imageUrl,
  title,
  price,
  miles,
  onRemove,
  onClick,
}) => (
  <div
    className="relative flex w-full cursor-pointer items-center gap-3 rounded py-4 text-left"
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.();
      }
    }}
    role="button"
    tabIndex={0}
  >
    <Image
      alt={title}
      className="h-10 w-16 rounded object-cover"
      height={40}
      src={imageUrl}
      width={64}
    />
    <div className="flex flex-1 flex-col">
      <span className="font-semibold text-sm">{title}</span>
      <span className="text-icon-primary text-xs">{price}</span>
      <span className="text-gray-500 text-xs">{miles}</span>
    </div>
    <Button
      aria-label="Remove saved vehicle"
      className="ml-2 h-10 w-10 rounded-full text-black hover:bg-transparent hover:text-icon-primary focus:bg-transparent active:bg-transparent"
      onClick={(e) => {
        e.stopPropagation();
        onRemove?.();
      }}
      size="icon"
      variant="ghost"
    >
      <picture>
        <source srcSet="/images/garage/cross.svg" type="image/svg+xml" />
        <Image
          alt="Remove"
          className="!w-[10px] !h-[10px]"
          height={10}
          src="/images/garage/cross.svg"
          width={10}
        />
      </picture>
    </Button>
  </div>
);

export interface RecentSearchCardProps {
  disabled?: boolean;
  highlighted?: boolean;
  id: string;
  onRemove?: () => void;
  search: string;
  url: string;
}

export const RecentSearchCard: FC<RecentSearchCardProps> = ({
  search,
  url,
  highlighted,
  disabled,
  onRemove,
}) => {
  const truncated = search.length > 50 ? `${search.slice(0, 50)}...` : search;
  const isTruncated = search.length > 50;

  return (
    <div
      className={`group relative flex min-h-[44px] items-center justify-between rounded py-2 transition-colors hover:bg-gray-50 ${
        highlighted ? "text-icon-primary" : ""
      } ${disabled ? "pointer-events-none text-gray-400" : ""}`}
    >
      <Link
        className="flex-1 font-medium text-[#0A0A0A] text-sm hover:underline"
        href={url}
        title={isTruncated ? search : undefined}
      >
        {renderSearchText(truncated)}
      </Link>
      {!disabled && (
        <Button
          aria-label="Remove recent search"
          className="ml-2 h-10 w-10 shrink-0 rounded-full text-gray-400 hover:bg-transparent hover:text-gray-700 focus:bg-transparent active:bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove?.();
          }}
          size="icon"
          variant="ghost"
        >
          <picture>
            <source srcSet="/images/garage/cross.svg" type="image/svg+xml" />
            <Image
              alt="Remove"
              className="!w-[10px] !h-[10px]"
              height={10}
              src="/images/garage/cross.svg"
              width={10}
            />
          </picture>
        </Button>
      )}
    </div>
  );
};

export interface FinancingCardProps {
  daysRemaining?: number; // Days remaining for prequalification offer (out of 30)
  onBuyOnline?: () => void;
  onGetPrequalified?: () => void;
  prequalified: boolean;
}

export const FinancingCard: FC<FinancingCardProps> = ({
  prequalified,
  daysRemaining = 30,
  onBuyOnline,
  onGetPrequalified,
}) => {
  // If customer is already prequalified, show the "Your Financing" card
  if (prequalified) {
    const router = useRouter();
    return (
      <GarageInfoCard
        badge={<CustomBadge text="Pre-qualified" type="preQualifies" />}
        ctaLabel="Buy Online"
        ctaVariant="primary"
        heading={
          <div className="flex items-center gap-[var(--spacing-sm,8px)]">
            <Image alt="Dollar icon" height={16} src="/images/garage/Dollar-icon.svg" width={16} />
            <span className="font-semibold text-[length:var(--font-size-md,16px)] text-[var(--color-text-primary,#111)] leading-[130%] [font-family:var(--font-family)] [leading-trim:both] [text-edge:cap]">
              Your Financing
            </span>
          </div>
        }
        onCtaClick={() => {
          onBuyOnline?.();
          router.push(ROUTES.COMING_SOON);
        }}
      >
        <div className="flex items-center gap-[var(--spacing-md,16px)]">
          <CircularProgress total={30} value={daysRemaining} />
          <div className="flex flex-col">
            <span className="font-semibold text-[length:var(--font-size-md,16px)] text-[var(--color-text-primary,#111)] leading-[130%] [font-family:var(--font-family)] [leading-trim:both] [text-edge:cap]">
              You are pre-qualified
            </span>
            <span className="text-gray-600">See real monthly payments on every vehicle</span>
          </div>
        </div>
      </GarageInfoCard>
    );
  }

  // If customer is NOT prequalified, show the "Know Your Buying Power" card
  return (
    <GarageInfoCard
      ctaLabel="Get Started"
      ctaVariant="primary"
      heading={
        <>
          <Image alt="Dollar icon" height={16} src="/images/garage/Dollar-icon.svg" width={16} />
          <span className="text-[length:var(--text-body-lg,18px)]">Know Your Buying Power</span>
        </>
      }
      onCtaClick={onGetPrequalified}
    >
      <div className="flex items-center gap-[var(--spacing-md,16px)]">
        <Image alt="Verified" height={40} src="/images/garage/verified-icon.svg" width={40} />
        <span>
          <span className="block">Unlock your buying power with no credit impact</span>
        </span>
      </div>
    </GarageInfoCard>
  );
};

export interface TradeOfferCardProps {
  expiresIn?: string;
  hasSubmittedTradeIn: boolean;
  imageUrl?: string;
  miles?: string;
  onGetEstimate?: () => void;
  onShopWithTradeIn?: () => void;
  price?: string;
  title?: string;
}

export const TradeOfferCard: FC<TradeOfferCardProps> = ({
  imageUrl,
  title,
  price,
  miles,
  expiresIn,
  hasSubmittedTradeIn,
  onShopWithTradeIn,
  onGetEstimate,
}) => {
  const router = useRouter();

  // If customer HAS submitted trade-in, show the "Sell/Trade Offer" card with their vehicle
  if (hasSubmittedTradeIn && imageUrl && title && price && miles && expiresIn) {
    return (
      <GarageInfoCard
        badge={<CustomBadge expiresInDays={2} type="ExpiresAt" />}
        ctaLabel="Shop With Your Trade-In"
        ctaVariant="primary"
        heading={
          <div className="flex items-center gap-[var(--spacing-sm,8px)]">
            <Image alt="Car icon" height={16} src="/images/garage/car.svg" width={16} />
            <span className="text-[length:var(--text-body-lg,18px)]">Sell/Trade Offer</span>
          </div>
        }
        onCtaClick={() => {
          onShopWithTradeIn?.();
          router.push(ROUTES.COMING_SOON);
        }}
      >
        <div className="flex flex-col gap-[var(--spacing-md,16px)]">
          <div className="flex items-center justify-between gap-[var(--spacing-lg,24px)]">
            <Image
              alt={title}
              className="rounded object-cover"
              height={61}
              src={imageUrl}
              style={{ aspectRatio: "156/61" }}
              width={156}
            />
            <div className="flex flex-1 flex-col">
              <span className="font-semibold text-[length:var(--font-size-sm,14px)] text-[var(--color-text-primary,#111)] leading-[130%]">
                {title}
              </span>
              <span className="font-semibold text-[length:var(--font-size-sm,14px)] text-[var(--color-card-price)] leading-normal">
                {price}
              </span>
              <span className="font-semibold text-[length:var(--font-size-sm,14px)] text-[var(--color-text-primary,#111)] leading-[130%]">
                {miles}
              </span>
            </div>
            <Image alt="Arrow icon" height={12} src="/images/garage/Union.svg" width={12} />
          </div>
          <div className="h-px w-full bg-black opacity-10" />
        </div>
      </GarageInfoCard>
    );
  }

  // If customer has NOT submitted trade-in, show the "What's Your Car Worth" card
  return (
    <GarageInfoCard
      ctaLabel="See My Offer"
      ctaVariant="secondary"
      heading={
        <span className="text-[length:var(--text-body-lg,18px)]">What's Your Car Worth?</span>
      }
      onCtaClick={onGetEstimate}
    >
      <div className="flex items-center gap-[var(--spacing-md,16px)]">
        <Image alt="Growth" height={40} src="/images/garage/growth-icon.svg" width={40} />
        <span>
          <span className="block">
            Get a free estimate in minutes and apply it toward your next vehicle.
          </span>
        </span>
      </div>
    </GarageInfoCard>
  );
};

export interface TestDriveCardProps {
  dealershipName?: string;
  onBookAppointment?: () => void;
  onScheduleTestDrive?: () => void;
  scheduled: boolean;
}

export const TestDriveCard: React.FC<TestDriveCardProps> = ({
  scheduled,
  dealershipName = "Toyota of Fort Worth",
  onBookAppointment,
  onScheduleTestDrive,
}) => {
  // If test drive is already scheduled, show "Ready to Drive it?" card
  if (scheduled) {
    return (
      <GarageInfoCard
        ctaLabel="Schedule a Test Drive"
        ctaVariant="secondary"
        heading={
          <>
            <Image alt="Car" height={16} src="/images/garage/car.svg" width={18} />
            <span className="text-[length:var(--font-size-lg,18px)]">Ready to Drive it?</span>
          </>
        }
        onCtaClick={onScheduleTestDrive}
      >
        <div className="flex items-center gap-[var(--spacing-md,16px)]">
          <Image alt="Toyota" height={40} src="/images/garage/toyota.svg" width={40} />
          <span>
            <span className="block">Experience this vehicle firsthand at {dealershipName}</span>
          </span>
        </div>
      </GarageInfoCard>
    );
  }

  // If test drive is NOT scheduled, show "Schedule a Test drive today" card
  return (
    <GarageInfoCard
      ctaLabel="Book an Appointment"
      ctaVariant="secondary"
      heading={
        <>
          <Image alt="Car" height={16} src="/images/garage/car.svg" width={18} />
          <span className="text-[length:var(--text-body-lg,18px)]">
            Schedule a Test drive today.
          </span>
        </>
      }
      onCtaClick={onBookAppointment}
    >
      <div className="flex items-center gap-[var(--spacing-md,16px)]">
        <Image alt="Toyota" height={40} src="/images/garage/toyota.svg" width={40} />
        <span>
          <span className="block">Test drive today. Schedule a test drive at {dealershipName}</span>
        </span>
      </div>
    </GarageInfoCard>
  );
};

export interface MyGarageCardsProps {
  financing: FinancingCardProps;
  onSavedVehicleClick?: (id: number | string) => void;
  recentSearches: RecentSearchCardProps[];
  savedVehicles: SavedVehicleCardProps[];
  testDrive?: TestDriveCardProps;
  tradeOffer: TradeOfferCardProps;
}

export const MyGarageCards: FC<
  MyGarageCardsProps & {
    onRemoveSavedVehicle?: (id: number | string) => void;
    onRemoveSearch?: (id: string) => void;
    onClearAllSearches?: () => void;
  }
> = ({
  savedVehicles,
  recentSearches,
  financing,
  tradeOffer,
  testDrive,
  onRemoveSavedVehicle,
  onRemoveSearch,
  onClearAllSearches,
  onSavedVehicleClick,
}) => (
  <div className="flex w-full flex-col gap-4 lg:flex-row">
    <div className="flex min-w-65 flex-1 flex-col rounded-md bg-white py-4 shadow">
      <div className="mb-6 flex items-center justify-between px-4 pb-0">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Image
            alt="Saved Vehicles"
            className="shrink-0"
            height={20}
            src="/images/garage/heart-filled.svg"
            width={20}
          />
          <span className="font-semibold text-[length:var(--font-size-xl)] text-[var(--Core-surfaces-foreground,#0A0A0A)] leading-[115%] [font-family:var(--font-family)] [leading-trim:both] [text-edge:cap]">
            Saved Vehicles ({savedVehicles.length})
          </span>
        </div>
        <Button
          className="h-auto p-0 font-normal text-[length:var(--font-size-sm,14px)] text-[var(--Core-surfaces-foreground,#0A0A0A)] leading-[125%] tracking-[-0.14px] underline [font-family:var(--font-family)]"
          variant="link"
        >
          View All
        </Button>
      </div>
      <div className="mx-4 mt-[23px] h-px bg-black opacity-10" />
      <div className="py-2">
        <div className="relative">
          <ScrollArea className="h-78 px-4 pr-3">
            {savedVehicles.length === 0 ? (
              <div className="flex h-full items-center justify-center py-10 text-center text-gray-400 text-sm">
                No saved vehicles yet. Click the heart icon on a vehicle to save it.
              </div>
            ) : (
              savedVehicles.map((props, idx) => (
                <Fragment key={props.id}>
                  <SavedVehicleCard
                    {...props}
                    onClick={onSavedVehicleClick ? () => onSavedVehicleClick(props.id) : undefined}
                    onRemove={
                      onRemoveSavedVehicle ? () => onRemoveSavedVehicle(props.id) : undefined
                    }
                  />
                  {idx !== savedVehicles.length - 1 && (
                    <div className="h-px w-full bg-black opacity-10" />
                  )}
                </Fragment>
              ))
            )}
          </ScrollArea>
          {/* Gradient overlay at bottom of card list */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 z-10 h-8 w-full"
            style={{ background: "linear-gradient(to bottom, #ffffff00 0%, #ffffff 100%)" }}
          />
        </div>
      </div>
    </div>
    <div className="flex min-w-65 flex-1 flex-col rounded-lg bg-white py-4 shadow">
      <div className="mb-6 flex items-center justify-between px-4 pb-0">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Image
            alt="Recent Searches"
            className="shrink-0"
            height={20}
            src="/images/garage/stars-icon.svg"
            width={20}
          />
          <span className="font-semibold text-[length:var(--font-size-xl)] text-[var(--Core-surfaces-foreground,#0A0A0A)] leading-[115%] [font-family:var(--font-family)] [leading-trim:both] [text-edge:cap]">
            Recent Searches ({recentSearches.length})
          </span>
        </div>
        {recentSearches.length > 0 && onClearAllSearches && (
          <Button
            className="h-auto p-0 font-normal text-[length:var(--Font-Size-Scale---font-size-sm,14px)] text-[var(--Core-surfaces-foreground,#0A0A0A)] leading-[125%] tracking-[-0.14px] underline [font-family:var(--font-family)]"
            onClick={onClearAllSearches}
            variant="link"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="mx-4 h-px bg-black opacity-10" />
      <div className="py-2">
        <div className="relative">
          <ScrollArea className="h-55 px-4 pr-3">
            {recentSearches.length === 0 ? (
              <div className="flex h-full items-center justify-center py-10 text-center text-gray-400 text-sm">
                No recent searches yet. Try searching for a vehicle above.
              </div>
            ) : (
              recentSearches.map((props, idx) => (
                <Fragment key={props.id}>
                  <RecentSearchCard
                    {...props}
                    onRemove={onRemoveSearch ? () => onRemoveSearch(props.id) : undefined}
                  />
                  {idx !== recentSearches.length - 1 && (
                    <div className="h-px w-full bg-black opacity-10" />
                  )}
                </Fragment>
              ))
            )}
          </ScrollArea>
          {/* Gradient overlay at bottom of card list */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 z-10 h-8 w-full"
            style={{ background: "linear-gradient(to bottom, #ffffff00 0%, #ffffff 100%)" }}
          />
        </div>
      </div>
    </div>
    <div className="flex min-w-65 flex-1 flex-col gap-4">
      <FinancingCard {...financing} />
      <TradeOfferCard {...tradeOffer} />
      {testDrive && <TestDriveCard {...testDrive} />}
    </div>
  </div>
);
