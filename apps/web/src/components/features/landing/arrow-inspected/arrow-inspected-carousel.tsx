"use client";

import { Carousel, CarouselContent, CarouselItem } from "@tfs-ucmp/ui";
import Autoplay from "embla-carousel-autoplay";
import type { InspectionFeature } from "~/lib/data";
import { InspectionFeatureCard } from "./inspection-feature-card";

export interface ArrowInspectedCarouselProps {
  inspectionFeatures: InspectionFeature[];
}

export function ArrowInspectedCarousel({ inspectionFeatures }: ArrowInspectedCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent>
        {inspectionFeatures.map((feature) => (
          <CarouselItem className="basis-[70%]" key={feature.id}>
            <InspectionFeatureCard feature={feature} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
