"use client";

import { Card, CardContent, CardHeader, Heading } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";
import { useFavorites } from "~/components/providers/favorites-provider";
import { AppButton } from "~/components/shared/button";
import { ROUTES } from "~/lib/routes/constants";

// Re-export so existing consumers importing from this file continue to work
export type { HomeHeroKnownUserContentProps, SavedVehicle, TradeInOffer } from "./types";

import type { HomeHeroKnownUserContentProps } from "./types";

export function HomeHeroKnownUserContent({
  userName,
  isPreQualified = false,
  savedVehicle,
  preQualifiedVehicle,
  tradeInOffer,
  onBuyOnline,
  onScheduleTestDrive,
  onAcceptOffer,
  onContinueShopping,
  showCards = false,
  showSubtitle = true,
  showContinueShopping = false,
}: HomeHeroKnownUserContentProps) {
  const router = useRouter();
  const { savedCount: _savedCount } = useFavorites();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="flex w-full justify-center pt-[25vh] pb-0 md:pt-0 lg:pb-0">
      <div className="flex w-full max-w-[1440px] flex-col items-start">
        <div className="space-y-1 text-center md:space-y-2 md:text-left">
          <Heading
            className="w-full max-w-[715px] text-[length:var(--font-size-2xl)] text-white uppercase leading-[1.2] tracking-[-0.449px] md:leading-[44px] lg:text-[length:var(--font-size-2xl)] xl:text-[length:var(--font-size-4xl)]"
            level={1}
            weight="bold"
          >
            WELCOME BACK{userName ? `, ${userName.toUpperCase()}` : ""}!
          </Heading>
          {showSubtitle && (
            <p className="m w-full max-w-[400px] font-semibold text-[length:var(--font-size-sm)] text-white leading-[1.5] md:text-[length:var(--font-size-sm)] md:leading-[24px] lg:text-base">
              You're pre-qualified and off to a great start.
              <span className="inline sm:hidden"> </span>
              Your trade-in offer and saved vehicles are ready.
              <span className="inline sm:hidden"> </span>— Let's Schedule a test drive.
            </p>
          )}
        </div>

        {showCards &&
          (() => {
            const cards: React.ReactNode[] = [];

            if (savedVehicle) {
              cards.push(
                <div
                  className="w-full space-y-4 md:flex md:min-w-0 md:flex-1 md:flex-col md:space-y-2"
                  key="saved-vehicle"
                >
                  <Heading
                    className="text-[length:var(--text-xl)] text-white tracking-wide md:pl-[var(--spacing-md)] md:text-[length:var(--font-size-xs)] lg:text-base xl:text-[length:var(--font-size-xl)]"
                    level={2}
                    weight="semibold"
                  >
                    Great Start
                  </Heading>
                  <Card className="w-full overflow-hidden border-0 bg-white md:flex md:flex-1 md:flex-col">
                    <CardHeader
                      className="flex flex-row items-center justify-between space-y-0 rounded-t-[16px] bg-background-light py-[12px]"
                      style={{ paddingLeft: "16px", paddingRight: "9px" }}
                    >
                      {isPreQualified && (
                        <div className="flex items-center gap-[var(--spacing-sm,8px)]">
                          <Image
                            alt="Check"
                            height={16}
                            src="/images/hero-know-user-content/know-user-icons/Verified-tick.svg"
                            width={16}
                          />
                          <Heading
                            className="text-center font-semibold text-[color:var(--color-text-primary,#111)] text-[length:var(--font-size-sm)] leading-normal [leading-trim:both] [text-edge:cap] md:text-[length:var(--font-size-sm)]"
                            level={3}
                            weight="normal"
                          >
                            Pre-qualified
                          </Heading>
                        </div>
                      )}
                      <Heading
                        className="text-right text-[length:10px] text-[var(--color-text-primary)] uppercase leading-normal [leading-trim:both] [text-edge:cap] md:text-[length:10px]"
                        level={3}
                        weight="normal"
                      >
                        AUTO-FINANCING
                      </Heading>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-y-[var(--spacing-md,16px)] px-[var(--spacing-md,16px)] pb-[var(--spacing-md,16px)] md:flex-1 md:justify-between">
                      <div className="flex items-center justify-center gap-[var(--spacing-xs)]">
                        {savedVehicle.image && (
                          <div className="relative h-[58px] w-[150px] shrink-0 overflow-hidden rounded">
                            <Image
                              alt={`${savedVehicle.year} ${savedVehicle.make} ${savedVehicle.model}`}
                              className="object-contain"
                              fill
                              sizes="150px"
                              src="/images/hero-know-user-content/know-user-images/card-car.png"
                              style={{ aspectRatio: "75/29" }}
                            />
                          </div>
                        )}
                        <div className="flex min-w-0 flex-col justify-center">
                          <span className="font-semibold text-[length:10px] text-[var(--color-text-primary,#111)] capitalize leading-normal [leading-trim:both] [text-edge:cap]">
                            Approved Vehicle
                          </span>
                          <p className="truncate font-bold text-[length:16px] text-[var(--color-text-primary,#111)] leading-normal">
                            {savedVehicle.year} {savedVehicle.make} {savedVehicle.model}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 items-center gap-1 text-[10px] lg:grid-cols-5">
                        <div>
                          <span className="font-semibold text-[length:10px] text-[var(--color-text-primary,#111)] leading-normal opacity-50 [leading-trim:both] [text-edge:cap]">
                            VIN
                          </span>
                          <p className="truncate font-semibold text-[length:12px] text-[var(--color-text-primary,#111)] leading-normal">
                            {savedVehicle.stockNumber || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-[length:10px] text-[var(--color-text-primary,#111)] leading-normal opacity-50 [leading-trim:both] [text-edge:cap]">
                            Miles
                          </span>
                          <p className="font-semibold text-[length:12px] text-[var(--color-text-primary,#111)] leading-normal">
                            {savedVehicle.mileage?.toLocaleString() || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-[length:10px] text-[var(--color-text-primary,#111)] leading-normal opacity-50 [leading-trim:both] [text-edge:cap]">
                            Price
                          </span>
                          <p className="font-semibold text-[length:12px] text-[var(--color-text-primary,#111)] leading-normal">
                            {formatPrice(savedVehicle.price)}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-[length:10px] text-[var(--color-text-primary,#111)] leading-normal opacity-50 [leading-trim:both] [text-edge:cap]">
                            Monthly
                          </span>
                          <p className="font-semibold text-[length:12px] text-[var(--color-text-primary,#111)] leading-normal">
                            $468
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-[length:10px] text-[var(--color-text-primary,#111)] leading-normal opacity-50 [leading-trim:both] [text-edge:cap]">
                            APR
                          </span>
                          <p className="font-semibold text-[length:12px] text-[var(--color-text-primary,#111)] leading-normal">
                            5.49%
                          </p>
                        </div>
                      </div>
                      <AppButton onClick={onBuyOnline} size="md" variant="primary">
                        Buy Online
                      </AppButton>
                    </CardContent>
                  </Card>
                </div>
              );
            }

            if (preQualifiedVehicle) {
              cards.push(
                <div
                  className="w-full space-y-4 md:flex md:min-w-0 md:flex-1 md:flex-col md:space-y-2"
                  key="test-drive"
                >
                  <Heading
                    className="text-[length:var(--text-xl)] text-white tracking-wide md:pl-[var(--spacing-md)] md:text-[length:var(--font-size-xs)] lg:text-base xl:text-[length:var(--font-size-xl)]"
                    level={2}
                    weight="semibold"
                  >
                    Ready when you are
                  </Heading>
                  <Card className="w-full overflow-hidden border-0 bg-white md:flex md:flex-1 md:flex-col">
                    <CardHeader
                      className="flex flex-row items-center justify-between space-y-0 rounded-t-[16px] bg-background-light py-[12px]"
                      style={{ paddingLeft: "16px", paddingRight: "9px" }}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          alt="Calendar"
                          className="h-4 w-4"
                          height={16}
                          src="/images/hero-know-user-content/know-user-icons/calendar.svg"
                          width={16}
                        />
                        <Heading
                          className="text-center font-semibold text-[length:var(--text-sm)] text-[var(--color-card-title,#111)] leading-normal [leading-trim:both] [text-edge:cap] md:text-[length:var(--text-sm)]"
                          level={3}
                          weight="normal"
                        >
                          Book Test Drive
                        </Heading>
                      </div>
                      <Heading
                        className="text-right font-semibold text-[length:var(--text-2xs)] text-[var(--color-card-title)] uppercase leading-normal [leading-trim:both] [text-edge:cap] md:text-[length:var(--text-2xs)]"
                        level={3}
                        weight="normal"
                      >
                        3 SAVED VEHICLES
                      </Heading>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-[var(--spacing-sm,12px)] p-[var(--spacing-md,16px)] md:flex-1 md:justify-between">
                      <div className="rounded-[8px] border border-[var(--color-structure-interaction-border-two,rgba(0,0,0,0.1))] px-[var(--spacing-sm,12px)] py-[var(--spacing-xs,8px)]">
                        <p className="flex justify-center font-normal text-[length:16px] leading-normal md:justify-start">
                          <span className="font-semibold text-[var(--color-card-title,#111)]">
                            Pre-Qualified:
                          </span>{" "}
                          <span className="font-normal text-[var(--color-card-title,#111)]">
                            {preQualifiedVehicle.year} {preQualifiedVehicle.make}{" "}
                            {preQualifiedVehicle.model}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-[var(--spacing-sm,12px)]">
                        <Image
                          alt="Toyota"
                          className="h-8 w-8 shrink-0"
                          height={32}
                          src="/images/garage/Toyota-logo.svg"
                          width={32}
                        />
                        <div className="flex flex-col">
                          <p className="font-semibold text-[length:16px] text-[var(--color-brand-text-primary,#000)] leading-normal">
                            Toyota of Fort Worth, TX 76116
                          </p>
                          <p className="font-normal text-[length:12px] text-[var(--color-brand-text-secondary,#58595B)] leading-normal">
                            We are ready to schedule your test drive
                          </p>
                        </div>
                      </div>
                      <AppButton onClick={onScheduleTestDrive} size="md" variant="secondary">
                        Book Test Drive
                      </AppButton>
                    </CardContent>
                  </Card>
                </div>
              );
            }

            if (tradeInOffer) {
              cards.push(
                <div
                  className="w-full space-y-4 md:flex md:min-w-0 md:flex-1 md:flex-col md:space-y-2"
                  key="trade-in"
                >
                  <Heading
                    className="text-[length:var(--text-xl)] text-white tracking-wide md:pl-[var(--spacing-md)] md:text-[length:var(--font-size-xs)] lg:text-base xl:text-[length:var(--font-size-xl)]"
                    level={2}
                    weight="semibold"
                  >
                    Don't miss out
                  </Heading>
                  <Card className="w-full overflow-hidden border-0 bg-white md:flex md:flex-1 md:flex-col">
                    <CardHeader className="flex flex-row items-center gap-2 space-y-0 rounded-t-[16px] bg-[#F2F2F2] px-4 py-[var(--spacing-sm)]">
                      <Image
                        alt="Trade-in"
                        className="h-4 w-4"
                        height={16}
                        src="/images/hero-know-user-content/know-user-icons/trade-in.svg"
                        width={16}
                      />
                      <Heading
                        className="font-semibold text-[length:var(--font-size-sm)] text-[var(--color-text-primary,#111)] md:text-[length:var(--font-size-sm)]"
                        level={3}
                        weight="normal"
                      >
                        Trade-In Offer
                      </Heading>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-md)] md:flex-1 md:justify-between">
                      <div className="flex flex-col gap-[var(--spacing-xs)] rounded-[8px] border border-[var(--color-structure-interaction-border-two,rgba(0,0,0,0.1))] py-[var(--spacing-xs)]">
                        <div className="flex items-center justify-center gap-[var(--spacing-xs)]">
                          <p className="font-bold text-[length:var(--font-size-md)] text-[var(--color-card-price,#EB0D1C)] leading-normal">
                            {formatPrice(tradeInOffer.offerAmount)}
                          </p>
                          <p className="font-normal text-[length:var(--font-size-md,16px)] text-[var(--color-card-title,#111)] leading-normal">
                            {tradeInOffer.year} {tradeInOffer.make} {tradeInOffer.model}
                          </p>
                        </div>
                        <div className="h-[1px] bg-black opacity-10" />
                        <div className="flex items-center justify-around">
                          <Image
                            alt="Clock"
                            className="h-[30px] w-[30px]"
                            height={30}
                            src="/images/hero-know-user-content/know-user-icons/clock.svg"
                            width={30}
                          />
                          <p className="font-semibold text-[length:var(--text-md,16px)] text-[var(--color-brand-text-primary,#000)] leading-normal">
                            Expires in {tradeInOffer.expiresInDays} days
                          </p>
                          <p className="font-normal text-[length:var(--font-size-xs,12px)] text-[var(--color-brand-text-secondary,#58595B)] leading-normal">
                            Don't miss out on this offer!
                          </p>
                        </div>
                      </div>
                      <AppButton onClick={onAcceptOffer} size="md" variant="secondary">
                        Accept Offer Now
                      </AppButton>
                    </CardContent>
                  </Card>
                </div>
              );
            }

            return (
              <>
                <div className="mt-[var(--spacing-lg)] flex w-full flex-col gap-[var(--spacing-xl)] md:hidden">
                  {cards}
                </div>
                <div className="mt-[var(--spacing-lg)] hidden w-full gap-[var(--spacing-xs)] md:flex md:items-stretch">
                  {cards}
                </div>
              </>
            );
          })()}

        {showContinueShopping && (
          <div className="flex w-full justify-center pt-[var(--spacing-lg)]">
            <div className="w-full md:w-1/3">
              <AppButton
                className="w-full bg-[var(--color-core-surfaces-card)]"
                onClick={() => {
                  onContinueShopping?.();
                  router.push(ROUTES.USED_CARS);
                }}
                size="md"
                variant="tertiary"
              >
                Continue Shopping
              </AppButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
