import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";

interface EstimationModalProps {
  creditScore: string;
  apr: string;
  termLength: string;
  estimatedMonthlyPayment: string;
  onClose: () => void;
}

export default function EstimationModal({
  creditScore,
  apr,
  termLength,
  estimatedMonthlyPayment,
  onClose,
}: EstimationModalProps) {
  return (
    <div className="absolute inset-0 z-[30] flex flex-col overflow-hidden rounded-lg bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h3 className="font-bold text-base">Summary</h3>
        <Button
          aria-label="Close"
          className="flex h-8 items-center justify-center rounded-full px-2 text-[var(--color-brand-text)] underline transition-colors hover:bg-transparent hover:text-[var(--color-brand-text)]"
          onClick={onClose}
          variant="ghost"
        >
          <span className="mr-1 text-sm underline">Close</span>
          <Image
            alt="Close"
            className="mt-0.75 block"
            height={7.15}
            src="/images/search/cross.svg"
            width={7.15}
          />
        </Button>
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
        <Button
          className="flex-1 whitespace-nowrap rounded-md px-4 py-2.5 font-semibold text-sm"
          variant="default"
        >
          Get Prequalified
        </Button>
        <Button
          className="flex-1 rounded-lg px-4 py-2.5 font-semibold text-[var(--color-brand-text)] text-sm underline hover:bg-transparent hover:text-[var(--color-brand-text)]"
          onClick={onClose}
          variant="outline"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
