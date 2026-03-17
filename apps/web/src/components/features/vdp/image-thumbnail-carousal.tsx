"use client";

import { Button, Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@tfs-ucmp/ui";
import Image from "next/image";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ImageCarouselProps {
  /** Alt text for the main images */
  alt: string;
  /** Class for the Carousel component */
  carouselClassName?: string;
  /** Class for the main carousel container */
  containerClassName?: string;
  /** Function returning className for thumbnail buttons based on active state */
  getThumbnailButtonClassName?: (isActive: boolean) => string;
  /** Optional id for the main carousel container */
  id?: string;
  /** Array of image URLs */
  images: string[];
  /** Called when the main image area is clicked (e.g., to open fullscreen preview) */
  onImageClick?: () => void;
  /** Called when the active image index changes */
  onImageIndexChange?: (index: number) => void;
  /** Class for the thumbnail gallery container */
  thumbnailContainerClassName?: string;
  /** Class for thumbnail images */
  thumbnailImageClassName?: string;
  /** Thumbnail image dimensions */
  thumbnailSize?: { width: number; height: number };
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt,
  onImageClick,
  onImageIndexChange,
  id,
  containerClassName = "relative h-75 w-full bg-brand-surface sm:h-75 lg:min-h-0 lg:flex-1 lg:rounded-[var(--radius-xl)]",
  carouselClassName = "h-full w-full overflow-hidden lg:rounded-[var(--radius-xl)] [&>div]:h-full",
  thumbnailContainerClassName = "scrollbar-hide flex gap-xs overflow-x-auto pl-lg lg:gap-sm lg:px-0 lg:pr-lg",
  getThumbnailButtonClassName,
  thumbnailImageClassName = "h-13.5 w-auto object-cover",
  thumbnailSize = { width: 96, height: 54 },
}) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const CLICK_THRESHOLD = 5;

  const onSelect = useCallback(() => {
    if (!carouselApi) {
      return;
    }
    const idx = carouselApi.selectedScrollSnap();
    setCurrentImageIndex(idx);
    onImageIndexChange?.(idx);
  }, [carouselApi, onImageIndexChange]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    onSelect();
    carouselApi.on("select", onSelect);
    carouselApi.on("reInit", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
      carouselApi.off("reInit", onSelect);
    };
  }, [carouselApi, onSelect]);

  useEffect(() => {
    const container = thumbnailContainerRef.current;
    if (!container) {
      return;
    }
    const activeThumb = container.children[currentImageIndex] as HTMLElement | undefined;
    if (!activeThumb) {
      return;
    }
    activeThumb.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [currentImageIndex]);

  const defaultGetThumbnailButtonClassName = (isActive: boolean) =>
    `flex h-23 w-23 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[var(--radius-xl)] border pt-5.75 pb-3.75 transition-all lg:h-[11vh] lg:w-[11vh] ${
      isActive
        ? "border-brand bg-brand-surface"
        : "border-divider bg-brand-surface hover:border-border"
    }`;

  const getThumbClass = getThumbnailButtonClassName ?? defaultGetThumbnailButtonClassName;
  const seenImageCount = new Map<string, number>();
  const imagesWithMeta = images.map((src, index) => {
    const count = (seenImageCount.get(src) ?? 0) + 1;
    seenImageCount.set(src, count);
    return {
      src,
      index,
      key: `${src}::${count}`,
    };
  });

  return (
    <>
      <div className={containerClassName} id={id}>
        <Carousel className={carouselClassName} opts={{ loop: true }} setApi={setCarouselApi}>
          <CarouselContent
            className="ml-0 h-full"
            onClick={(e) => {
              if (!(onImageClick && pointerStartRef.current)) {
                return;
              }
              const dx = e.clientX - pointerStartRef.current.x;
              const dy = e.clientY - pointerStartRef.current.y;
              if (Math.abs(dx) < CLICK_THRESHOLD && Math.abs(dy) < CLICK_THRESHOLD) {
                onImageClick();
              }
              pointerStartRef.current = null;
            }}
            onPointerDown={(e) => {
              pointerStartRef.current = { x: e.clientX, y: e.clientY };
            }}
          >
            {imagesWithMeta.map((image) => (
              <CarouselItem className="h-full pl-0" key={image.key}>
                <div className="relative h-full w-full">
                  <Image alt={alt} className="object-contain" fill src={image.src} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {images.length > 1 && (
          <>
            <Button
              aria-label="Previous image"
              className="absolute top-1/2 left-(--spacing-md) z-30 hidden h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[var(--radius-full)] border border-brand-border-light bg-surface hover:bg-background-lighter lg:flex"
              onClick={(e) => {
                e.stopPropagation();
                carouselApi?.scrollPrev();
              }}
              size="icon"
              variant="ghost"
            >
              <Image
                alt="Previous"
                className="h-[12px] w-[6px]"
                height={12}
                src="/images/vdp/chevron-left2.svg"
                width={6}
              />
            </Button>
            <Button
              aria-label="Next image"
              className="absolute top-1/2 right-(--spacing-md) z-30 hidden h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[var(--radius-full)] border border-brand-border-light bg-surface hover:bg-background-lighter lg:flex"
              onClick={(e) => {
                e.stopPropagation();
                carouselApi?.scrollNext();
              }}
              size="icon"
              variant="ghost"
            >
              <Image
                alt="Next"
                className="h-[12px] w-[6px]"
                height={12}
                src="/images/vdp/Chevron-right2.svg"
                width={6}
              />
            </Button>
          </>
        )}

        <div className="absolute right-sm bottom-sm z-10 flex items-center gap-1.5 rounded-[var(--radius-full)] bg-[rgba(88,89,91,0.10)] px-sm py-1.5 lg:right-md lg:bottom-md lg:gap-xs lg:px-md lg:py-xs">
          <Image
            alt="Image count"
            className="h-3.5 w-3.5 lg:h-(--size-icon-sm) lg:w-(--size-icon-sm)"
            height={14}
            src="/images/vdp/Image-count.svg"
            width={14}
          />
          <span className="text-center font-normal text-brand-text text-xs-alt leading-normal lg:text-xs">
            {images.length} {images.length === 1 ? "Image" : "Images"}
          </span>
        </div>

        <div aria-atomic="true" aria-live="polite" className="sr-only">
          Showing image {currentImageIndex + 1} of {images.length}
        </div>
      </div>

      <div className={thumbnailContainerClassName} ref={thumbnailContainerRef}>
        {imagesWithMeta.map((image) => (
          <Button
            aria-label={`View image ${image.index + 1} of ${images.length}`}
            aria-pressed={image.index === currentImageIndex}
            className={getThumbClass(image.index === currentImageIndex)}
            key={image.key}
            onClick={() => carouselApi?.scrollTo(image.index)}
            size={null}
            variant={null}
          >
            <Image
              alt={`Thumbnail ${image.index + 1}`}
              className={thumbnailImageClassName}
              height={thumbnailSize.height}
              src={image.src}
              width={thumbnailSize.width}
            />
          </Button>
        ))}
      </div>
    </>
  );
};
