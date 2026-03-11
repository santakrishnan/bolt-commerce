"use client";

import { Button } from "@tfs-ucmp/ui";
import Image from "next/image";
import { useCallback, useState } from "react";

interface CarouselProps {
  images: string[];
  carName: string;
}

export function Carousel({ images, carName }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
    },
    [images.length]
  );

  const next = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    },
    [images.length]
  );

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative h-78 w-full">
      <Image
        alt={carName}
        className="absolute inset-0 h-full max-h-78 w-full max-w-104 object-contain p-4"
        height={312}
        src={images[current] ?? ""}
        width={416}
      />
      <div className="absolute right-0 bottom-2 left-0 z-20 flex items-center justify-between px-4">
        <Button
          aria-label="Previous image"
          className="h-7 w-7 rounded-full bg-white/80 p-0 opacity-0 shadow transition-opacity hover:bg-white group-hover:opacity-100"
          onClick={prev}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Image
            alt="Previous"
            className="h-5 w-5"
            height={20}
            src="/images/vdp/chevron-left2.svg"
            width={20}
          />
        </Button>
        <div className="flex flex-1 justify-center gap-1">
          {images.map((img, idx) => (
            <span
              className="relative flex h-4 w-4 items-center justify-center transition-all duration-200"
              key={img}
            >
              {idx === current ? (
                <>
                  <span className="absolute h-4 w-4 rounded-full border-2 border-black bg-white" />
                  <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-black" />
                </>
              ) : (
                <span className="h-2 w-2 rounded-full bg-gray-300" />
              )}
            </span>
          ))}
        </div>
        <Button
          aria-label="Next image"
          className="h-7 w-7 rounded-full bg-white/80 p-0 opacity-0 shadow transition-opacity hover:bg-white group-hover:opacity-100"
          onClick={next}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Image
            alt="Next"
            className="h-5 w-5"
            height={20}
            src="/images/vdp/Chevron-right2.svg"
            width={20}
          />
        </Button>
      </div>
    </div>
  );
}
