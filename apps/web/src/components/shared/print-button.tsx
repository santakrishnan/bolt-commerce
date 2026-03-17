"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { type VehiclePrintData, VehiclePrintSheet } from "./vehicle-print-sheet";

export type { VehiclePrintData } from "./vehicle-print-sheet";

interface PrintButtonProps {
  ariaLabel?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  vehicle?: VehiclePrintData;
}

function waitForImages(node: HTMLElement, timeout = 5000): Promise<void> {
  return new Promise((resolve) => {
    const images = Array.from(node.querySelectorAll("img")) as HTMLImageElement[];
    if (images.length === 0) {
      resolve();
      return;
    }

    let loaded = 0;
    const check = () => {
      loaded += 1;
      if (loaded >= images.length) {
        resolve();
      }
    };

    const onFinish = () => {
      for (const img of images) {
        img.onload = null;
        img.onerror = null;
      }
      resolve();
    };

    for (const img of images) {
      if (img.complete) {
        check();
      } else {
        img.onload = check;
        img.onerror = check;
      }
    }

    // Safety timeout
    setTimeout(onFinish, timeout);
  });
}

export function PrintButton({
  vehicle,
  onClick,
  className,
  ariaLabel = "Print",
}: PrintButtonProps) {
  const [printPortal, setPrintPortal] = useState<HTMLElement | null>(null);

  // Mount a persistent portal container directly on <body> — no DOM cloning needed
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("data-print-portal", "");
    el.style.display = "none";
    document.body.appendChild(el);
    setPrintPortal(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (vehicle && printPortal) {
        waitForImages(printPortal, 7000).then(() => {
          window.print();
        });
      } else {
        window.print();
      }

      onClick?.(e);
    },
    [vehicle, onClick, printPortal]
  );

  return (
    <>
      {printPortal && vehicle
        ? createPortal(<VehiclePrintSheet vehicle={vehicle} />, printPortal)
        : null}
      <Button
        aria-label={ariaLabel}
        className={`h-9 w-9 rounded-full bg-white hover:bg-transparent hover:text-inherit ${className ?? ""}`}
        onClick={handleClick}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Image
          alt="Print"
          className="h-(--size-icon-md) w-(--size-icon-md) lg:h-6 lg:w-6"
          height={19}
          src="/images/vdp/Vector_7.svg"
          width={17}
        />
      </Button>
    </>
  );
}
