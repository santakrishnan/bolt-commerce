"use client";

import { Carousel, CarouselContent, CarouselItem } from "@tfs-ucmp/ui";
import Autoplay from "embla-carousel-autoplay";
import { inspectionFeatures } from "../../../../data/inspection/features";
import { InspectionFeatureCard } from "./inspection-feature-card";

export function ArrowInspectedCarousel() {
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
