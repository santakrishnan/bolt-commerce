"use client";

import { MapPinIcon } from "@tfs-ucmp/ui";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "~/lib/routes/constants";
import { LocationBlock } from "./location-block";

interface MobileMenuProps {
  onClose: () => void;
}

export const MobileMenu = ({ onClose }: MobileMenuProps) => (
  <div className="fixed inset-0 z-50 lg:hidden">
    <button
      aria-label="Close menu"
      className="absolute inset-0 m-0 border-0 bg-black/40 p-0 backdrop-blur-sm"
      onClick={onClose}
      type="button"
    />
    <nav className="absolute top-0 right-0 h-full w-full max-w-full bg-linear-to-b from-white/95 to-white p-6 shadow-lg">
      <div className="flex items-center justify-between border-gray-100 border-b pb-4">
        <Link href={ROUTES.HOME} onClick={onClose}>
          <span className="font-bold text-lg text-primary">ARROW</span>
        </Link>
        <button
          aria-label="Close menu"
          className="rounded p-1 text-gray-700 hover:bg-gray-100"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      </div>

      <ul className="mt-6 flex flex-col gap-2">
        <li>
          <Link
            className="block rounded px-3 py-2 font-medium text-base text-gray-800 hover:bg-gray-50"
            href="#"
            onClick={onClose}
          >
            Buy
          </Link>
        </li>
        <li>
          <Link
            className="block rounded px-3 py-2 font-medium text-base text-gray-800 hover:bg-gray-50"
            href="#"
            onClick={onClose}
          >
            Finance
          </Link>
        </li>
        <li>
          <Link
            className="block rounded px-3 py-2 font-medium text-base text-gray-800 hover:bg-gray-50"
            href="#"
            onClick={onClose}
          >
            Why Arrow
          </Link>
        </li>
        <li className="mt-4 flex items-center gap-2">
          <MapPinIcon className={cn("h-4.5 w-4.5 text-primary")} />
          <LocationBlock useSolidStyles={true} />
        </li>
      </ul>
    </nav>
  </div>
);
