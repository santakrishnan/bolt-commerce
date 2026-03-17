"use client";

import { Heading, Button as ShadcnButton } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useState } from "react";
import { AppButton } from "~/components/shared/button";
import { useSingletonModal } from "~/hooks/use-single-modal";

interface EstimationModalProps {
  apr: string;
  creditScore: string;
  estimatedMonthlyPayment: string;
  isOpen: boolean;
  onClose: () => void;
  termLength: string;
}

export default function EstimationModal({
  creditScore,
  apr,
  termLength,
  estimatedMonthlyPayment,
  onClose,
  isOpen,
}: EstimationModalProps) {
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  useSingletonModal("estimation-open", isOpen, onClose);
  return (
    <div className="absolute inset-0 z-30 flex flex-col overflow-hidden rounded-lg bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <Heading className="text-base md:text-base" level={3} weight="bold">
          Summary
        </Heading>
        <ShadcnButton
          aria-label="Close"
          className="flex h-8 items-center justify-center rounded-full px-2 underline transition-colors hover:bg-transparent"
          onClick={onClose}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
          type="button"
          variant="ghost"
        >
          <span
            className={`mr-1 text-sm ${
              isCloseHovered ? "text-muted-foreground" : "text-(--color-brand-text)"
            }`}
          >
            Close
          </span>
          <Image
            alt="Close"
            className={`mt-0.75 block ${isCloseHovered ? "opacity-60" : "opacity-100"}`}
            height={7.15}
            src="/images/search/cross.svg"
            width={7.15}
          />
        </ShadcnButton>
      </div>

      <div className="h-px bg-black opacity-10" />

      {/* Rows */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Credit Score */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm">Credit Score:</span>
          <span className="text-right text-sm">{creditScore}</span>
        </div>
        <div className="mx-4 h-px bg-black opacity-10" />

        {/* APR */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm">APR:</span>
          <span className="text-sm">{apr}</span>
        </div>
        <div className="mx-4 h-px bg-black opacity-10" />

        {/* Term Length */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm">Term Length:</span>
          <span className="text-sm">{termLength}</span>
        </div>
        <div className="mx-4 h-px bg-black opacity-10" />

        {/* Estimated Monthly Payment */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-bold text-sm">Estimated Monthly Payment:</span>
          <span className="font-bold text-sm">{estimatedMonthlyPayment}</span>
        </div>
        <div className="mx-4 h-px bg-black opacity-10" />

        {/* Description */}
        <div className="px-4 py-3">
          <p className="text-muted-foreground text-xs leading-4">
            Tax, title, and tags vary by state and are calculated at time of purchase. Estimated
            values are for illustration purposes only; do not constitute an advertisement or offer
            of specific credit terms; and are based, where applicable, on the information you enter.
            Eligibility for lowest advertised APR limited to highly qualified borrowers with
            excellent credit, financing a term of 72 months or less with positive equity.
          </p>
          <p className="mt-2 text-muted-foreground text-xs leading-4">
            APRs and terms used in estimates may be unavailable based on vehicle, state of purchase,
            or your credit profile. Actual APR and terms are subject to credit approval and
            availability.
          </p>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex gap-3 px-4 pt-2 pb-4">
        <AppButton
          className="flex-1 whitespace-nowrap px-4 py-2.5"
          onClick={() => {
            // TODO: wire up pre-qualification flow
          }}
          variant="primary"
        >
          Get Prequalified
        </AppButton>
        <AppButton className="flex-1 px-4 py-2.5" onClick={onClose} variant="tertiary">
          Close
        </AppButton>
      </div>
    </div>
  );
}
