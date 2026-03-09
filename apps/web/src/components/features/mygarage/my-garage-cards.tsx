// Scrollable cards for My Garage

import { ScrollArea } from "@tfs-ucmp/ui";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { GarageInfoCard } from "~/components/features/card/garage-info-card";

export type { GarageInfoCardProps } from "~/components/features/card/garage-info-card";

export interface SavedVehicleCardProps {
  id: number | string;
  imageUrl: string;
  title: string;
  price: string;
  miles: string;
  onRemove?: () => void;
}

export const SavedVehicleCard: React.FC<SavedVehicleCardProps> = ({
  imageUrl,
  title,
  price,
  miles,
  onRemove,
}) => (
  <div className="relative flex items-center gap-3 rounded py-2">
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
    <button
      aria-label="Remove saved vehicle"
      className="ml-2 flex h-10 w-10 items-center justify-center rounded-full text-black transition-colors hover:text-icon-primary focus:outline-none"
      onClick={onRemove}
      type="button"
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
    </button>
  </div>
);

export interface RecentSearchCardProps {
  id: string;
  search: string;
  url: string;
  highlighted?: boolean;
  disabled?: boolean;
  onRemove?: () => void;
}

export const RecentSearchCard: React.FC<RecentSearchCardProps> = ({
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
        {(() => {
          const words = truncated.split(" ");
          if (words.length <= 8) {
            return truncated;
          }
          return (
            <>
              <span className="block">{words.slice(0, 8).join(" ")}</span>
              <span className="block">{words.slice(8).join(" ")}</span>
            </>
          );
        })()}
      </Link>
      {!disabled && (
        <button
          aria-label="Remove recent search"
          className="ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-gray-700 focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove?.();
          }}
          type="button"
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
        </button>
      )}
    </div>
  );
};

export interface FinancingCardProps {
  prequalified: boolean;
  daysRemaining?: number; // Days remaining for prequalification offer (out of 30)
  onBuyOnline?: () => void;
  onGetPrequalified?: () => void;
}

export const FinancingCard: React.FC<FinancingCardProps> = ({
  prequalified,
  daysRemaining = 27,
  onBuyOnline,
  onGetPrequalified,
}) => {
  // If customer is already prequalified, show the "Your Financing" card
  if (prequalified) {
    // Calculate color based on days remaining (out of 30)
    const percentage = (daysRemaining / 30) * 100;
    let circleColor = "bg-green-600"; // > 50% (15+ days)
    if (percentage <= 33) {
      circleColor = "bg-red-600"; // <= 33% (10 or fewer days)
    } else if (percentage <= 50) {
      circleColor = "bg-yellow-500"; // <= 50% (11-15 days)
    }

    return (
      <GarageInfoCard
        badge={
          <span className="rounded bg-green-100 px-2 py-1 text-green-700 text-xs">
            Pre-qualified
          </span>
        }
        ctaLabel="Buy Online"
        heading="Your Financing"
        onCtaClick={onBuyOnline}
      >
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${circleColor}`}
            >
              <span className="font-bold text-white text-xl leading-none">{daysRemaining}</span>
            </div>
            <span className="mt-1 text-2xs text-gray-500 uppercase">DAYS</span>
          </div>
          <span className="text-xs">
            <span className="block font-semibold">You are pre-qualified</span>
            <span className="block text-gray-600">See real monthly payments on every vehicle</span>
          </span>
        </div>
      </GarageInfoCard>
    );
  }

  // If customer is NOT prequalified, show the "Know Your Buying Power" card
  return (
    <GarageInfoCard
      ctaLabel="Get Started"
      heading={
        <>
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600">
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
            </svg>
          </div>
          <span>Know Your Buying Power</span>
        </>
      }
      onCtaClick={onGetPrequalified}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-xs">
          <span className="block">Unlock your buying power with no credit impact</span>
        </span>
      </div>
    </GarageInfoCard>
  );
};

export interface TradeOfferCardProps {
  imageUrl?: string;
  title?: string;
  price?: string;
  miles?: string;
  expiresIn?: string;
  hasSubmittedTradeIn: boolean;
  onShopWithTradeIn?: () => void;
  onGetEstimate?: () => void;
}

export const TradeOfferCard: React.FC<TradeOfferCardProps> = ({
  imageUrl,
  title,
  price,
  miles,
  expiresIn,
  hasSubmittedTradeIn,
  onShopWithTradeIn,
  onGetEstimate,
}) => {
  // If customer HAS submitted trade-in, show the "Sell/Trade Offer" card with their vehicle
  if (hasSubmittedTradeIn && imageUrl && title && price && miles && expiresIn) {
    return (
      <GarageInfoCard
        badge={
          <span className="rounded bg-gray-200 px-2 py-1 text-gray-700 text-xs">
            Expires in {expiresIn}
          </span>
        }
        ctaLabel="Shop With Your Trade-In"
        heading="Sell/Trade Offer"
        onCtaClick={onShopWithTradeIn}
      >
        <div className="flex items-center gap-2">
          <Image
            alt={title}
            className="h-10 w-16 rounded object-cover"
            height={40}
            src={imageUrl}
            width={64}
          />
          <div className="flex flex-col">
            <span className="font-semibold text-xs">{title}</span>
            <span className="text-icon-primary text-xs">{price}</span>
            <span className="text-gray-500 text-xs">{miles}</span>
          </div>
        </div>
      </GarageInfoCard>
    );
  }

  // If customer has NOT submitted trade-in, show the "What's Your Car Worth" card
  return (
    <GarageInfoCard
      ctaLabel="See My Offer"
      ctaVariant="secondary"
      heading="What's Your Car Worth?"
      onCtaClick={onGetEstimate}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-xs">
          <span className="block">
            Get a free estimate in minutes and apply it toward your next vehicle.
          </span>
        </span>
      </div>
    </GarageInfoCard>
  );
};

export interface MyGarageCardsProps {
  savedVehicles: SavedVehicleCardProps[];
  recentSearches: RecentSearchCardProps[];
  financing: FinancingCardProps;
  tradeOffer: TradeOfferCardProps;
}

export const MyGarageCards: React.FC<
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
  onRemoveSavedVehicle,
  onRemoveSearch,
  onClearAllSearches,
}) => (
  <div className="flex w-full flex-col gap-4 lg:flex-row">
    <div className="flex min-w-65 flex-1 flex-col rounded-md bg-white py-4 shadow">
      <div className="flex items-center justify-between px-4 pb-0">
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
        <button
          className="font-normal text-[length:var(--Font-Size-Scale---font-size-sm,14px)] text-[var(--Core-surfaces-foreground,#0A0A0A)] not-italic leading-[125%] tracking-[-0.14px] underline decoration-solid [font-family:var(--font-family)] [leading-trim:both] [text-decoration-skip-ink:auto] [text-decoration-thickness:auto] [text-edge:cap] [text-underline-offset:auto] [text-underline-position:from-font]"
          type="button"
        >
          View All
        </button>
      </div>
      <div className="mx-4 mt-[23px] h-px bg-black opacity-10" />
      <div className="py-2">
        <div className="relative">
          <ScrollArea className="h-55 px-4 pr-3">
            {savedVehicles.length === 0 ? (
              <div className="flex h-full items-center justify-center py-10 text-center text-gray-400 text-sm">
                No saved vehicles yet. Click the heart icon on a vehicle to save it.
              </div>
            ) : (
              savedVehicles.map((props, idx) => (
                <React.Fragment key={props.id}>
                  <SavedVehicleCard
                    {...props}
                    onRemove={
                      onRemoveSavedVehicle ? () => onRemoveSavedVehicle(props.id) : undefined
                    }
                  />
                  {idx !== savedVehicles.length - 1 && (
                    <div className="h-px w-full bg-black opacity-10" />
                  )}
                </React.Fragment>
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
      <div className="flex items-center justify-between px-4 pb-0">
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
          <button
            className="font-normal text-[length:var(--Font-Size-Scale---font-size-sm,14px)] text-[var(--Core-surfaces-foreground,#0A0A0A)] not-italic leading-[125%] tracking-[-0.14px] underline decoration-solid [font-family:var(--font-family)] [leading-trim:both] [text-decoration-skip-ink:auto] [text-decoration-thickness:auto] [text-edge:cap] [text-underline-offset:auto] [text-underline-position:from-font]"
            onClick={onClearAllSearches}
            type="button"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="mx-4 mt-[23px] h-px bg-black opacity-10" />
      <div className="py-2">
        <div className="relative">
          <ScrollArea className="h-55 px-4 pr-3">
            {recentSearches.length === 0 ? (
              <div className="flex h-full items-center justify-center py-10 text-center text-gray-400 text-sm">
                No recent searches yet. Try searching for a vehicle above.
              </div>
            ) : (
              recentSearches.map((props, idx) => (
                <React.Fragment key={props.id}>
                  <RecentSearchCard
                    {...props}
                    onRemove={onRemoveSearch ? () => onRemoveSearch(props.id) : undefined}
                  />
                  {idx !== recentSearches.length - 1 && (
                    <div className="h-px w-full bg-black opacity-10" />
                  )}
                </React.Fragment>
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
    </div>
  </div>
);
