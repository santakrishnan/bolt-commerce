"use client";

import { Button, Card } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type React from "react";

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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="flex w-full justify-center pb-0 lg:pb-0">
      <div className="flex w-full max-w-[1440px] flex-col items-start">
        <div className="space-y-1 md:space-y-2">
          <h1 className="w-full max-w-[715px] font-bold text-[length:var(--font-size-2xl)] text-white uppercase leading-[1.2] tracking-[-0.449px] md:leading-[44px] lg:text-[length:var(--font-size-2xl)] xl:text-[length:var(--font-size-4xl)]">
            WELCOME BACK{userName ? `, ${userName.toUpperCase()}` : ""}!
          </h1>
          {showSubtitle && (
            <p className="w-full max-w-[400px] font-semibold text-[length:var(--font-size-sm)] text-white leading-[1.5] md:text-[length:var(--font-size-sm)] md:leading-[24px] lg:text-base">
              You're pre-qualified and off to a great start.
              <span className="hidden sm:inline">
                <br />
              </span>
              <span className="inline sm:hidden"> </span>
              Your trade-in offer and saved vehicles are ready
              <span className="hidden sm:inline">
                <br />
              </span>
              <span className="inline sm:hidden"> </span>— Let's Schedule a test drive.
            </p>
          )}
        </div>

        {showCards &&
          (() => {
            const cards: React.ReactNode[] = [];

            if (savedVehicle) {
              cards.push(
                <div className="w-full space-y-2 md:min-w-0 md:flex-1" key="saved-vehicle">
                  <h3 className="font-semibold text-[length:var(--font-size-sm)] text-white uppercase tracking-wide md:text-[length:var(--font-size-xs)] lg:text-base xl:text-[length:var(--font-size-xl)]">
                    Great Start
                  </h3>
                  <Card className="h-[160px] w-full overflow-hidden border-0 bg-white pb-[5px] backdrop-blur-sm md:h-[190px] min-[1440px]:h-[220px]">
                    <div className="flex h-full flex-col">
                      <div className="flex h-7 items-center justify-between bg-background-light px-[var(--spacing-sm)] md:h-8 min-[1440px]:h-10 min-[1440px]:px-[var(--spacing-md)]">
                        {isPreQualified && (
                          <span className="inline-flex items-center gap-1.5 font-medium text-[length:var(--font-size-sm)] md:text-[length:var(--font-size-xs)]">
                            <Image
                              alt="Check"
                              className="h-3.5 w-3.5"
                              height={14}
                              src="/images/hero-know-user-content/know-user-icons/Verified-tick.svg"
                              width={14}
                            />
                            Pre-Qualified
                          </span>
                        )}
                        <span className="font-medium text-[10px] text-foreground-500 uppercase">
                          AUTO-FINANCING
                        </span>
                      </div>
                      <div className="flex h-12 items-center justify-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] md:h-14 min-[1440px]:h-[72px] min-[1440px]:px-[var(--spacing-md)]">
                        {savedVehicle.image && (
                          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded lg:w-30">
                            <Image
                              alt={`${savedVehicle.year} ${savedVehicle.make} ${savedVehicle.model}`}
                              className="object-contain"
                              fill
                              src="/images/hero-know-user-content/know-user-images/card-car.png"
                            />
                          </div>
                        )}
                        <div className="flex min-w-0 flex-col justify-center">
                          <span className="text-[10px] text-foreground-700">Approved Vehicle</span>
                          <p className="truncate font-bold text-base text-foreground-900 md:text-sm">
                            {savedVehicle.year} {savedVehicle.make} {savedVehicle.model}
                          </p>
                        </div>
                      </div>
                      <div className="grid h-9 grid-cols-5 items-center justify-center gap-1 bg-foreground-50 px-[var(--spacing-sm)] text-[10px] md:h-10 min-[1440px]:h-12 min-[1440px]:px-[var(--spacing-md)] min-[1440px]:text-[11px]">
                        <div>
                          <span className="text-foreground-500">VIN</span>
                          <p className="truncate font-semibold text-foreground-900 text-xs">
                            {savedVehicle.stockNumber || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-foreground-500">Miles</span>
                          <p className="font-semibold text-[length:var(--font-size-xs)] text-foreground-900">
                            {savedVehicle.mileage?.toLocaleString() || "N/A"}
                          </p>
                        </div>
                        <div>
                          <span className="text-foreground-500">Price</span>
                          <p className="font-semibold text-[length:var(--font-size-xs)] text-foreground-900">
                            {formatPrice(savedVehicle.price)}
                          </p>
                        </div>
                        <div>
                          <span className="text-foreground-500">Monthly</span>
                          <p className="font-semibold text-[length:var(--font-size-xs)] text-foreground-900">
                            $468
                          </p>
                        </div>
                        <div>
                          <span className="text-foreground-500">APR</span>
                          <p className="font-semibold text-[length:var(--font-size-xs)] text-foreground-900">
                            5.49%
                          </p>
                        </div>
                      </div>
                      <div className="flex h-10 items-center px-[var(--spacing-sm)] md:h-11 min-[1440px]:h-14 min-[1440px]:px-[var(--spacing-md)]">
                        <Button
                          className="h-8 w-full rounded-full bg-primary font-medium text-[length:var(--font-size-sm)] text-white hover:bg-primary-dark md:text-[length:var(--font-size-xs)] min-[1440px]:h-10"
                          onClick={onBuyOnline}
                        >
                          Buy Online
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            }

            if (preQualifiedVehicle) {
              cards.push(
                <div className="w-full space-y-2 md:min-w-0 md:flex-1" key="test-drive">
                  <h3 className="font-semibold text-[length:var(--font-size-sm)] text-white uppercase tracking-wide md:text-[length:var(--font-size-xs)] lg:text-base xl:text-[length:var(--font-size-xl)]">
                    Ready When You Are
                  </h3>
                  <Card className="h-[160px] w-full overflow-hidden border-0 bg-white pb-[5px] backdrop-blur-sm md:h-[190px] min-[1440px]:h-[220px]">
                    <div className="flex h-full flex-col">
                      <div className="flex h-7 items-center justify-between gap-2 bg-background-light px-[var(--spacing-sm)] md:h-8 min-[1440px]:h-10 min-[1440px]:px-[var(--spacing-md)]">
                        <div className="flex items-center gap-1.5">
                          <Image
                            alt="Calendar"
                            className="h-3.5 w-3.5"
                            height={14}
                            src="/images/hero-know-user-content/know-user-icons/calendar.svg"
                            width={14}
                          />
                          <span className="font-medium text-[length:var(--font-size-sm)] text-foreground-900 md:text-[length:var(--font-size-xs)]">
                            Schedule a Test Drive
                          </span>
                        </div>
                        <span className="font-medium text-[10px] text-foreground-900">
                          3 SAVED VEHICLES
                        </span>
                      </div>
                      <div className="flex h-12 items-center px-[length:var(--font-size-sm)] md:h-14 min-[1440px]:h-[72px] min-[1440px]:px-[length:var(--font-size-md)]">
                        <p className="w-full items-center justify-center rounded-[var(--radius-md)] border-border font-semibold text-base text-foreground md:text-[length:var(--font-size-sm)] lg:px-[var(--spacing-sm)] lg:py-[var(--spacing-2xs)] xl:border xl:p-[var(--spacing-sm)]">
                          Pre-Qualified:{" "}
                          <span className="text-base text-foreground-600 md:text-[length:var(--font-size-sm)]">
                            {preQualifiedVehicle.year} {preQualifiedVehicle.make}{" "}
                            {preQualifiedVehicle.model}
                          </span>
                        </p>
                      </div>
                      <div className="flex h-9 items-center bg-foreground-50 px-[var(--spacing-sm)] md:h-10 min-[1440px]:h-12 min-[1440px]:px-[var(--spacing-md)]">
                        <div className="flex items-center justify-center gap-1.5">
                          <Image
                            alt="Location"
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 lg:h-8 lg:w-15"
                            height={30}
                            src="/images/hero-know-user-content/know-user-images/Logo.svg"
                            width={20}
                          />
                          <div>
                            <p className="font-semibold text-foreground-900 md:text-[length:var(--font-size-xs)] lg:text-[length:var(--font-size-sm)] xl:text-base">
                              Toyota of Fort Worth, TX 76116
                            </p>
                            <p className="text-[10px] text-foreground-500 lg:text-[length:var(--font-size-xs)]">
                              We are ready to schedule your test drive
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex h-10 items-center px-[var(--spacing-sm)] md:h-11 min-[1440px]:h-14 min-[1440px]:px-[var(--spacing-md)]">
                        <Button
                          className="h-8 w-full rounded-full bg-gray-900 font-medium text-[length:var(--font-size-sm)] text-white hover:bg-foreground-800 md:text-[length:var(--font-size-xs)] min-[1440px]:h-10"
                          onClick={onScheduleTestDrive}
                          variant="outline"
                        >
                          Book Test Drive
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            }

            if (tradeInOffer) {
              cards.push(
                <div className="w-full space-y-2 md:min-w-0 md:flex-1" key="trade-in">
                  <h3 className="font-semibold text-[length:var(--font-size-sm)] text-white uppercase tracking-wide md:text-[length:var(--font-size-xs)] lg:text-base xl:text-[length:var(--font-size-xl)]">
                    Don't Miss Out
                  </h3>
                  <Card className="h-[160px] w-full overflow-hidden border-0 bg-white pb-[5px] backdrop-blur-sm md:h-[190px] min-[1440px]:h-[220px]">
                    <div className="flex h-full flex-col">
                      <div className="flex h-7 items-center gap-[var(--spacing-xs)] bg-background-light px-[var(--spacing-sm)] md:h-8 min-[1440px]:h-10 min-[1440px]:px-[var(--spacing-md)]">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[length:var(--font-size-sm)] text-foreground md:text-[length:var(--font-size-xs)]">
                          <Image
                            alt="Clock"
                            className="h-3.5 w-3.5"
                            height={14}
                            src="/images/hero-know-user-content/know-user-icons/trade-in.svg"
                            width={14}
                          />
                          Trade-In Offer
                        </span>
                      </div>
                      <div className="flex h-12 items-center justify-center gap-1 px-[var(--spacing-sm)] text-[length:var(--font-size-xl)] md:h-14 min-[1440px]:h-[72px] min-[1440px]:px-[var(--spacing-md)] min-[1440px]:text-[length:var(--font-size-2xl)]">
                        <div className="flex w-full items-center justify-center gap-1.5 rounded-[8px] border-border lg:px-[var(--spacing-sm)] lg:py-[var(--spacing-xs)] xl:border xl:p-[var(--spacing-md)]">
                          <p className="font-bold text-[length:var(--font-size-xl)] text-primary md:text-base">
                            {formatPrice(tradeInOffer.offerAmount)}
                          </p>
                          <p className="flex items-center justify-center gap-1 text-[length:var(--font-size-xs) text-foreground-600">
                            {tradeInOffer.year} {tradeInOffer.make} {tradeInOffer.model}
                          </p>
                        </div>
                      </div>
                      <div className="flex h-9 items-center justify-center bg-foreground-50 px-[var(--spacing-sm)] md:h-10 min-[1440px]:h-12 min-[1440px]:px-[var(--spacing-md)]">
                        <div className="flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-md)] border-border lg:p-[var(--spacing-xs)] xl:border xl:p-[var(--spacing-md)]">
                          <Image
                            alt="Clock"
                            className="h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-5 xl:h-5 xl:w-5"
                            height={14}
                            src="/images/hero-know-user-content/know-user-icons/clock.svg"
                            width={14}
                          />
                          <span className="font-semibold text-[11px] text-foreground-900 md:text-[10px] lg:text-[length:var(--font-size-sm)]xl:text-base">
                            Expires in {tradeInOffer.expiresInDays} days
                          </span>
                          <span className="text-[10px] text-foreground-500 lg:text-[length:var(--font-size-xs)]">
                            Don't miss out on this offer!
                          </span>
                        </div>
                      </div>
                      <div className="flex h-10 items-center px-[var(--spacing-sm)] md:h-11 min-[1440px]:h-14 min-[1440px]:px-[var(--spacing-md)]">
                        <Button
                          className="h-8 w-full rounded-full bg-gray-900 font-medium text-[length:var(--font-size-sm)] text-white hover:bg-foreground-800 md:text-[length:var(--font-size-xs)] min-[1440px]:h-10"
                          onClick={onAcceptOffer}
                        >
                          Accept Offer Now
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            }

            return (
              <>
                <div className="mt-[var(--spacing-lg)] flex w-full flex-col gap-[var(--spacing-md)] md:hidden">
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
              <Button
                className="h-9 w-full rounded-full border border-actions-tertiary-border bg-white font-semibold text-[length:var(--font-size-sm)] text-actions-tertiary-foreground backdrop-blur-sm hover:border-actions-tertiary-border hover:bg-actions-tertiary-hover hover:text-actions-tertiary-foreground lg:h-10 lg:text-[length:var(--font-size-sm)]"
                onClick={() => {
                  onContinueShopping?.();
                  router.push("/used-cards/search");
                }}
                variant="outline"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
