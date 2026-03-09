import { ScrollArea } from "@tfs-ucmp/ui";
import Image from "next/image";
import { Fragment } from "react";
import type { PriceHistoryEntry } from "~/lib/data/vehicle";

interface PriceHistoryTableProps {
  entries: PriceHistoryEntry[];
}

function formatShortDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatChange(change: number): string {
  const abs = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.abs(change));
  return change >= 0 ? `+${abs}` : `-${abs}`;
}

function UpGreenArrowImg() {
  return (
    <Image
      alt="Price up"
      className="inline-block"
      height={20}
      src="/images/vdp/Up-GreenArrow.svg"
      width={17}
    />
  );
}

function DownGreenArrowImg() {
  return (
    <Image
      alt="Price down"
      className="inline-block"
      height={20}
      src="/images/vdp/Down-GreenArrow.svg"
      width={17}
    />
  );
}

/** Returns true if the ISO date string falls in the current calendar month */
function isCurrentMonth(isoDate: string): boolean {
  const now = new Date();
  const d = new Date(isoDate);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export function PriceHistoryTable({ entries }: PriceHistoryTableProps) {
  // Show up to 4, latest at bottom
  const rows = entries.slice(0, 4).reverse();

  return (
    <ScrollArea className="w-full">
      <table className="w-full border-separate font-normal text-[length:var(--font-size-sm)]">
        <colgroup>
          <col className="w-auto" />
          <col className="w-auto" />
          <col className="w-auto" />
          <col className="w-[var(--spacing-xl)]" />
        </colgroup>
        <tbody>
          {rows.map((entry, idx) => {
            const isCurrent = isCurrentMonth(entry.date);
            const isPriceUp = entry.change > 0;
            return (
              <Fragment key={entry.date}>
                {idx !== 0 && (
                  <tr>
                    <td aria-hidden="true" className="h-[var(--spacing-md)] p-0" colSpan={4} />
                  </tr>
                )}
                <tr>
                  {/* Date — flush with price icon on the left */}
                  <td
                    className={
                      "whitespace-nowrap pr-[var(--spacing-md)] pb-[var(--spacing-md)] align-middle font-normal text-heading"
                    }
                  >
                    {formatShortDate(entry.date)}
                  </td>

                  {/* Price */}
                  <td
                    className={
                      "whitespace-nowrap pr-[var(--spacing-md)] pb-[var(--spacing-md)] align-middle font-normal text-heading"
                    }
                  >
                    {formatPrice(entry.price)}
                  </td>

                  {/* Change — hidden for current month; auto width */}
                  <td
                    className={
                      "whitespace-nowrap pr-[var(--spacing-md)] pb-[var(--spacing-md)] align-middle font-normal text-heading"
                    }
                  >
                    {!isCurrent && formatChange(entry.change)}
                  </td>

                  {/* Arrow — flush-right with the dropdown arrow; hidden for current month */}
                  <td className={"pb-[var(--spacing-md)] align-middle"}>
                    <div className="flex justify-end">
                      {!isCurrent && (isPriceUp ? <UpGreenArrowImg /> : <DownGreenArrowImg />)}
                    </div>
                  </td>
                </tr>
                {/* Divider after every row, including last */}
                <tr>
                  <td className="p-0" colSpan={4}>
                    <div
                      aria-hidden="true"
                      className="h-px w-full bg-[var(--structure-interaction-subtle-border)]"
                    />
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </ScrollArea>
  );
}
