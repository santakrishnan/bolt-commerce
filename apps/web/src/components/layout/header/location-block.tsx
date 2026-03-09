"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { type JSX, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "~/components/providers/location-provider";

/** Validates a 5-digit US zip code */
const ZIP_RE = /^\d{5}$/;

export function LocationBlock({ useSolidStyles }: { useSolidStyles: boolean }): JSX.Element {
  const { state: locationState, actions, meta } = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [zipInput, setZipInput] = useState("");
  const [zipError, setZipError] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { displayZip, displayCity, displayState, isManualZip, description } = locationState;
  const { isLoading } = meta;

  // Focus input when modal opens
  useEffect(() => {
    if (modalOpen) {
      setZipInput("");
      setZipError("");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [modalOpen]);

  // Close on Escape
  useEffect(() => {
    if (!modalOpen) {
      return undefined;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  // Close on outside click
  useEffect(() => {
    if (!modalOpen) {
      return undefined;
    }
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setModalOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [modalOpen]);

  const handleToggle = useCallback(() => setModalOpen((s) => !s), []);

  const handleUpdate = useCallback(() => {
    const clean = zipInput.trim();
    if (!ZIP_RE.test(clean)) {
      setZipError("Please enter a valid 5-digit zip code.");
      return;
    }
    setZipError("");
    actions.setZip(clean);
    setModalOpen(false);
  }, [zipInput, actions]);

  const handleUseDeviceLocation = useCallback(() => {
    actions.clearManualZip();
    setModalOpen(false);
  }, [actions]);

  // Build the trigger label with a graceful fallback chain:
  // Manual zip with description → "Miami, FL 33101"
  // Fingerprint: "Buffalo, WV 25033" → "Buffalo 25033" → "WV 25033" → "25033"
  let triggerLabel = displayZip;

  if (isManualZip && description) {
    // Use description from state config for manual zip
    triggerLabel = description;
  } else if (displayCity && displayState) {
    triggerLabel = `${displayCity}, ${displayState} ${displayZip}`;
  } else if (displayCity) {
    triggerLabel = `${displayCity} ${displayZip}`;
  } else if (displayState) {
    triggerLabel = `${displayState} ${displayZip}`;
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger button */}
      <button
        aria-expanded={modalOpen}
        aria-haspopup="dialog"
        className={`cursor-pointer border-none bg-transparent font-normal text-sm leading-none outline-none hover:underline hover:underline-offset-4 ${
          useSolidStyles ? "text-text-dark" : "text-white"
        }`}
        onClick={handleToggle}
        type="button"
      >
        {isLoading ? "Loading…" : triggerLabel}
      </button>

      {/* Dialog */}
      {modalOpen && (
        <div
          aria-labelledby="location-dialog-title"
          aria-modal="true"
          className="absolute top-full left-0 z-50 mt-10 w-[min(96vw,20rem)] rounded bg-white px-4 py-8 lg:left-1/2 lg:w-104 lg:-translate-x-1/2"
          role="dialog"
        >
          {/* Pointy edge */}
          <div className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2">
            <Image alt="" height={16} src="/images/triangle.svg" width={24} />
          </div>

          <div className="px-4">
            <h3 className="font-semibold text-sm" id="location-dialog-title">
              Update Your Location
            </h3>

            {/* Current detected location */}
            {!isManualZip && displayCity && displayState && (
              <p className="mt-1 text-gray-400 text-xs">
                Detected: {displayCity}, {displayState} {displayZip}
              </p>
            )}
            {isManualZip && (
              <div className="mt-1">
                <p className="text-gray-400 text-xs">
                  Current: {description || displayZip} (manually set)
                </p>
                {displayCity && displayState && (
                  <p className="mt-0.5 text-gray-400 text-xs">
                    Device: {displayCity}, {displayState}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="p-4">
            <label className="sr-only" htmlFor="location-zip">
              Enter zip code
            </label>
            <input
              autoComplete="postal-code"
              className="w-full rounded bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
              id="location-zip"
              inputMode="numeric"
              maxLength={5}
              onChange={(e) => {
                setZipInput(e.target.value.replace(/\D/g, ""));
                setZipError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdate();
                }
              }}
              pattern="[0-9]{5}"
              placeholder="Enter zip code"
              ref={inputRef}
              type="text"
              value={zipInput}
            />
            {zipError && <p className="mt-1 text-red-500 text-xs">{zipError}</p>}

            <Button
              className="mt-4 w-full rounded-full bg-primary"
              disabled={isLoading}
              onClick={handleUpdate}
            >
              {isLoading ? "Loading…" : "Update"}
            </Button>

            {/* Use Device Location button - only show if manual zip is set */}
            {isManualZip && (
              <Button
                className="mt-2 w-full rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                onClick={handleUseDeviceLocation}
                variant="outline"
              >
                Use Device Location
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
