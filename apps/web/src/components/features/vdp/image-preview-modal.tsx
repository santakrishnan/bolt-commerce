import { Button, Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@tfs-ucmp/ui";
import Image from "next/image";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface ImagePreviewModalProps {
  alt: string;
  currentIndex: number;
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  images,
  currentIndex,
  onIndexChange,
  onClose,
  alt,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const thumbnailListRef = useRef<HTMLUListElement>(null);

  const thumbnails = useMemo(
    () => images.map((src, i) => ({ key: `${src}-${i}`, src, index: i })),
    [images]
  );

  useEffect(() => {
    if (!(api && isOpen)) {
      return;
    }
    api.scrollTo(currentIndex);
  }, [api, currentIndex, isOpen]);

  useEffect(() => {
    const container = thumbnailListRef.current;
    if (!container) {
      return;
    }
    const activeThumb = container.children[currentIndex] as HTMLElement | undefined;
    if (!activeThumb) {
      return;
    }
    activeThumb.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [currentIndex]);

  useEffect(() => {
    if (!api) {
      return;
    }
    const onSelect = () => {
      const newIndex = api.selectedScrollSnap();
      onIndexChange(newIndex);
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onIndexChange]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && api) {
        api.scrollPrev();
      } else if (e.key === "ArrowRight" && api) {
        api.scrollNext();
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, api, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface p-(--spacing-lg)">
      <Button
        aria-hidden
        className="absolute inset-0 bg-surface"
        onClick={onClose}
        size={null}
        variant={null}
      />
      <div
        aria-modal="true"
        className="relative z-10 flex items-center justify-center bg-surface p-(--spacing-lg)"
        role="dialog"
      >
        <Button
          aria-label="Close preview"
          className="absolute top-(--spacing-md) right-(--spacing-md) z-50 w-(--spacing-10) cursor-pointer rounded-full bg-background p-(--spacing-xs) shadow-sm"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          size={null}
          variant={null}
        >
          <Image
            alt="Close dialog"
            className="h-6 w-6"
            height={24}
            src="/images/vdp/x-close.svg"
            width={24}
          />
        </Button>

        <Button
          aria-label="Previous preview"
          className="absolute left-(--spacing-md) z-50 hidden cursor-pointer rounded-full bg-surface p-(--spacing-xs) shadow-sm md:flex"
          onClick={(e) => {
            e.stopPropagation();
            api?.scrollPrev();
          }}
          size={null}
          variant={null}
        >
          <Image
            alt="Previous"
            className="h-[12px] w-[6px]"
            height={12}
            src="/images/vdp/chevron-left2.svg"
            width={6}
          />
        </Button>

        <Carousel className="w-full max-w-[90vw]" setApi={setApi}>
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem key={src}>
                <div className="flex items-center justify-center">
                  <Image
                    alt={`${alt} — ${index + 1}`}
                    className="h-[90vh] w-[90vw] object-contain"
                    height={720}
                    onClick={(e) => e.stopPropagation()}
                    src={src}
                    width={1280}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Thumbnails inside preview */}
        <ul
          aria-label="Preview thumbnails"
          className={[
            "absolute",
            "bottom-[5%]",
            "left-1/2",
            "flex",
            "w-[90vw]",
            "max-w-[90vw]",
            "-translate-x-1/2",
            "gap-(--spacing-xs)",
            "overflow-x-auto",
            "pr-(--spacing-md)",
            "pb-(--spacing-xs)",
            "pl-(--spacing-md)",
            "[-ms-overflow-style:none]",
            "[scrollbar-width:none]",
            "[&::-webkit-scrollbar]:hidden",
            "list-none",
          ].join(" ")}
          ref={thumbnailListRef}
        >
          {thumbnails.map((thumb) => (
            <li className="shrink-0" key={thumb.key}>
              <Button
                aria-label={`Preview image ${thumb.index + 1}`}
                className={`h-23 w-23 cursor-pointer rounded-xl p-(--spacing-2xs) transition-all lg:h-[11vh] lg:w-[11vh] ${
                  thumb.index === currentIndex
                    ? "border-(length:--border-width-1) border-brand"
                    : "border-(length:--border-width-1) border-divider hover:border-border"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  api?.scrollTo(thumb.index);
                }}
                size={null}
                variant={null}
              >
                <Image
                  alt={`${alt} thumbnail ${thumb.index + 1}`}
                  className="h-full w-full rounded-md object-scale-down"
                  height={97}
                  src={thumb.src}
                  width={97}
                />
              </Button>
            </li>
          ))}
        </ul>

        <Button
          aria-label="Next preview"
          className="absolute right-(--spacing-md) hidden cursor-pointer rounded-full bg-surface p-(--spacing-xs) shadow-sm md:flex"
          onClick={(e) => {
            e.stopPropagation();
            api?.scrollNext();
          }}
          size={null}
          variant={null}
        >
          <Image
            alt="Next"
            className="h-[12px] w-[6px]"
            height={12}
            src="/images/vdp/Chevron-right2.svg"
            width={6}
          />
        </Button>
      </div>
    </div>
  );
};
